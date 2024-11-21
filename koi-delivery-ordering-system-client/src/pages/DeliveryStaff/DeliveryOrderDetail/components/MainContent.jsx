import { Box, Button, Grid, Modal, Paper, styled, TextField, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { startDeliveringOrder, startGettingOrder, updateOrderDeliveringLocation } from "../../../../utils/axios/orderDelivering";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";
import dateTimeConvert from "../../../../components/utils";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import GreenMarker from "../../../../assets/succeeded.svg"
import BlueMarker from "../../../../assets/inTransit.svg"
import RedMarker from "../../../../assets/failed.svg"
import CurrentPosition from "../../../../assets/delivery-current.svg"
import { updateDeliveryStaffCurrentLocation } from "../../../../utils/axios/deliveryStaff";
import { abortOrder, cancelOrder, finishOrder } from "../../../../utils/axios/order";
import Spinner from "../../../../components/SpinnerLoading";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),

  minHeight: '48px', // Adjust as needed for desired height
  lineHeight: '1.5', // Adjust line height for better spacing
}));

const SubmitButton = styled(Button)(() => ({
  padding: "10px 50px"
}))

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function MainContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const centerDefault = {
    lat: 10.75,
    lng: 106.6667
  };
  const { id } = useParams();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const googleMapStyled = {
    width: "100%",
    height: "50vh",
  }

  const token = localStorage.getItem("token");
  let deliveryStaffId;
  if (token) {
    const deliveryStaffInfo = jwtDecode(token);
    deliveryStaffId = deliveryStaffInfo.sub.substring(2);
  }

  const [center, setCenter] = useState(centerDefault);
  const { state } = location;
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [abortOrderModalOpen, setAbortOrderModalOpen] = useState(false);

  const onLoad = useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const senderPosition = {
    lat: parseFloat(state.senderLatitude),
    lng: parseFloat(state.senderLongitude),
  };
  const receiverPosition = {
    lat: parseFloat(state.destinationLatitude),
    lng: parseFloat(state.destinationLongitude),
  };

  const storagePosition = {
    lat: parseFloat(state.storage.latitude),
    lng: parseFloat(state.storage.longitude),
  }

  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = parseFloat(position.coords.latitude.toFixed(15));
          const longitude = parseFloat(position.coords.longitude.toFixed(15));
          setCurrentLocation({ lat: latitude, lng: longitude });
          getAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher);
      }
    } else {
      console.log("Geolocation is not available.");
    }
  }, []);

  function handleCancelOrder() {
    setOrderModalOpen(true);
  }

  function handleAbortOrder() {
    setAbortOrderModalOpen(true);
  }

  async function handleAbortOrderConfirm() {
    setIsLoading(true);
    const response = await abortOrder(
      state.id,
    );
    if (response) {
      setUpdateStatus(true);
      toast("Order abort successfully");
      setAbortOrderModalOpen(false);
    } else {
      toast("Unexpected Error has been occurred");
    }
    setIsLoading(false);
  }

  function handleCloseAbortOrderModal() {
    setAbortOrderModalOpen(false);
  }

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
  };

  async function handleCancelOrderConfirm() {
    setIsLoading(true);
    const deliveryUserType = 3;
    const response = await cancelOrder(
      state.id,
      deliveryStaffId,
      deliveryUserType,
      cancelReason
    );
    if (response) {
      setUpdateStatus(true);
      toast("Order cancelled successfully");
      setOrderModalOpen(false);
    } else {
      toast("Unexpected Error has been occurred");
    }
    setIsLoading(false);
  }

  // Function to reverse geocode lat, lng to an address
  const getAddressFromCoordinates = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error("Geocoder failed due to: ", status);
      }
    });
  };

  async function handleDeliveryOrder() {
    setIsLoading(true);
    try {
      const response = await startDeliveringOrder(deliveryStaffId, state.id);

      if (response) {
        toast("Order information updated");
        setUpdateStatus(true);
      } else {
        toast("Unexpected error has been occurred");
      }

    } catch (error) {
      console.error("Error while receiving the order:", error);
      toast("An error occurred while processing request.");
    } finally {
      setIsLoading(false); // Hide loading spinner after processing
    }
  }

  async function handleReceiveOrder() {
    setIsLoading(true);
    try {
      const response = await startGettingOrder(deliveryStaffId, state.id);

      if (response) {
        toast("Order information updated");
        setUpdateStatus(true);
      } else {
        toast("Unexpected error has been occurred");
      }

    } catch (error) {
      console.error("Error while receiving the order:", error);
      toast("An error occurred while processing request.");
    } finally {
      setIsLoading(false); // Hide loading spinner after processing
    }
  }



  useEffect(() => {
    if (address && currentLocation.lat && currentLocation.lng) {
      if (state.orderDeliveringSet && state.orderDeliveringSet.length > 0) {

        const availableOrderDelivering = state.orderDeliveringSet.reduce((prev, current) => {
          return (prev.id > current.id) ? prev : current;
        });
        async function handleUpdateOrderLocation() {
          const response = await updateOrderDeliveringLocation(availableOrderDelivering.id, address, currentLocation.lat, currentLocation.lng);

          if (response) {
            await updateDeliveryStaffCurrentLocation(deliveryStaffId, address, currentLocation.lat, currentLocation.lng);
          }
        }

        handleUpdateOrderLocation();
      }
    }
  }, [currentLocation])

  async function handleFinishOrderStep(processType) {
    setIsLoading(true);
    try {
      if (state.orderDeliveringSet && state.orderDeliveringSet.length > 0) {
        const availableOrderDelivering = state.orderDeliveringSet.reduce((prev, current) => {
          return (prev.id > current.id) ? prev : current;
        });
        const response = await finishOrder(state.id, availableOrderDelivering.id, deliveryStaffId, state.storage.id, processType);
        console.log(response);
        if (response) {
          toast("Order Finish");
          setUpdateStatus(true);
        } else {
          toast("Unexpected Error has been occurred");
        }
      }
    } catch (error) {
      console.error("Error while receiving the order:", error);
      toast("An error occurred while processing request.");
    } finally {
      setIsLoading(false); // Hide loading spinner after processing
    }

  }

  function handleBackPreviousPage() {
    navigate("/delivery-order-home");
  }

  function handleViewFishDetail() {
    navigate(`/delivery-order-detail/${id}/delivery-fish-detail`, {
      state: state
    });
  }

  return (
    <div className="sales-order-details-container">
      {/* Order Details Table */}
      <ToastUtil />
      {isLoading && <Spinner />}

      <Modal
        open={abortOrderModalOpen}
        onClose={handleCloseAbortOrderModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            Are you sure about this ?
          </Typography>
          <div style={{ margin: "20px" }}></div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => handleAbortOrderConfirm()}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      <Modal
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            Why this order is not valid ?
          </Typography>
          <div style={{ margin: "20px" }}></div>
          <TextField
            fullWidth
            label="Cancel Reason"
            type=""
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div style={{ margin: "20px" }}></div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => handleCancelOrderConfirm()}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      <div className="order-name-detail">
        <strong>{state.name}</strong>
      </div>

      <div className="order-details">
        <div className="details-row">
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Item>Create Dated: {dateTimeConvert(state.createdDate)}</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Expected Finish Date: {dateTimeConvert(state.expectedFinishDate)}</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Tracking Id: {state.trackingId}</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Storage Address: {state.storage.address}</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Sender Address: {state.senderAddress}</Item>
            </Grid>
            <Grid item xs={6} sx={{ height: '100px' }}>
              <Item>Destination Address: {state.destinationAddress}</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>Receiver Email: {state.receiverEmail}</Item>
            </Grid>
            <Grid item xs={6} sx={{ height: "100px" }}>
              <Item>Receiver Phone Number: {state.receiverPhoneNumber}</Item>
            </Grid>
          </Grid>

        </div>
        <div className="view-fish">
          <button className="view-fish-btn" onClick={() => handleViewFishDetail()}>View Fishes</button>
        </div>

        <GoogleMap
          mapContainerStyle={googleMapStyled}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Polyline
            path={[
              senderPosition,
              storagePosition,
            ]}
            options={{
              strokeColor: "#041967",
              //strokeOpacity: 0.5,
              strokeWeight: 2,
              geodesic: true,
              icons: [{
                // eslint-disable-next-line no-undef
                icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                offset: '50%'
              }]
            }}
          />

          <Polyline
            path={[
              storagePosition,
              receiverPosition,
            ]}
            options={{
              strokeColor: "#041967",
              //strokeOpacity: 0.5,
              strokeWeight: 2,
              geodesic: true,
              icons: [{
                // eslint-disable-next-line no-undef
                icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                offset: '50%'
              }]
            }}
          />


          <Marker
            position={currentLocation}
            icon={{
              url: CurrentPosition,
            }}
          >
          </Marker>

          <Marker
            position={senderPosition}
            icon={{
              url: GreenMarker,
            }}
          >
          </Marker>
          <Marker
            position={storagePosition}
            icon={{
              url: BlueMarker,
            }}
          >
          </Marker>
          <Marker
            position={receiverPosition}
            icon={{
              url: RedMarker,
            }}
          >
          </Marker>
        </GoogleMap>

        <div className="order-description">
          <h4>Description</h4>
          <p>{state.description}</p>
        </div>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: "30px",
            gap: "20px"
          }}>

          {userData.roleId === 3 && (
            <>
              {updateStatus ? (
                <SubmitButton variant="contained" onClick={() => navigate("/delivery-order-home")}>Back to home page</SubmitButton>
              ) : (
                <>
                  <SubmitButton variant="contained" onClick={() => handleBackPreviousPage()}>Back</SubmitButton>

                  {state.orderStatus === 3 && (
                    state.orderDeliveringSet && state.orderDeliveringSet.length > 0 && (
                      <>
                        {/* <SubmitButton
                          variant="contained"
                          style={{ backgroundColor: "#f44336" }}
                          onClick={() => handleAbortOrder()}
                        >
                          Abort
                        </SubmitButton> */}
                        <SubmitButton
                          variant="contained"
                          style={{ backgroundColor: "#f44336" }}
                          onClick={() => handleCancelOrder()}
                        >
                          Cancel
                        </SubmitButton>
                        <SubmitButton variant="contained" style={{ backgroundColor: "#01428E" }} onClick={() => handleFinishOrderStep(0)}>
                          Getting Complete
                        </SubmitButton>
                      </>
                    )
                  )}

                  {state.orderStatus === 6 && (
                    state.orderDeliveringSet && state.orderDeliveringSet.length > 0 && (
                      <>
                        <SubmitButton
                          variant="contained"
                          style={{ backgroundColor: "#f44336" }}
                          onClick={() => handleCancelOrder()}
                        >
                          Cancel
                        </SubmitButton>
                        <SubmitButton variant="contained" style={{ backgroundColor: "#01428E" }} onClick={() => handleFinishOrderStep(1)}>
                          Delivering Complete
                        </SubmitButton>
                      </>
                    )
                  )}

                  {state.orderStatus === 2 && (
                    <SubmitButton variant="contained" onClick={() => handleReceiveOrder()}>
                      Get This Order
                    </SubmitButton>
                  )}

                  {state.orderStatus === 5 && (
                    <SubmitButton variant="contained" onClick={() => handleDeliveryOrder()}>
                      Delivery This Order
                    </SubmitButton>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </div>

      {/* Google Map Section */}
    </div>
  );
}

export default MainContent;