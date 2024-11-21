import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { getOrderByTrackingId } from "../../../utils/axios/order"; // Ensure this function is defined to fetch order data
import { useNavigate } from "react-router-dom";
import CurrentPosition from "../../../assets/delivery-current.svg";
import dateTimeConvert, { calculateDistance } from "../../../components/utils";
import { getFileByFileId } from "../../../utils/axios/file";
import { Modal } from "antd";
import Title from "antd/es/skeleton/Title";
import ImageSlider from "../../../components/ImageSlider";
import { toast } from "react-toastify";
import ToastUtil from "../../../components/toastContainer";
import BlueMarker from "../../../assets/inTransit.svg"
import GreenMarker from "../../../assets/succeeded.svg"

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

const Trackin = () => {
  const [trackingId, setTrackingId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [isShowAll, setIsShowAll] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState();
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [licenseImages, setLicenseImages] = useState([]);
  const [map, setMap] = useState();

  const orderStatusLabels = {
    0: "Draft",
    1: "Posted",
    2: "Accepted",
    3: "Getting",
    4: "Received",
    5: "Confirmed",
    6: "Delivering",
    7: "Completed",
    8: "Failed",
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

      const handleSearch = async () => {
        if (trackingId) {
          try {
            const order = await getOrderByTrackingId(trackingId);

            if (order) {
              if (
                order.orderStatus === 0 ||
                order.orderStatus === 8 ||
                order.orderStatus === 9
              ) {
                setOrderData(null);
                setCurrentDelivery(null);
                toast("There is no order to track", { type: "warning" });
                return;
              }
              setOrderData(order);
              if (order.orderDeliveringSet && order.orderDeliveringSet.length > 0) {
                const availableOrderDelivering = order.orderDeliveringSet.reduce(
                  (prev, current) => {
                    return prev.id > current.id ? prev : current;
                  }
                );
                setCurrentDelivery(availableOrderDelivering);
              }
            } else {
              setOrderData(null);
              setCurrentDelivery(null);
              toast("Tracking ID not found", { type: "error" });
            }
          } catch (error) {
            console.error("Error fetching order:", error);
          }
        }
      };

  // const handleLicenseClick = async (order) => {
  //   setSelectedLicense(order.fishes[1].licenses[0]);

  //   try {
  //     if (
  //       Array.isArray(order.fishes[0].licenses[0].files) &&
  //       order.fishes[0].licenses[0].files.length > 0
  //     ) {
  //       const imagePromises = order.fishes[0].licenses[0].files.map(
  //         async (file) => {
  //           const fileId = file.file.id;
  //           const imageResponse = await getFileByFileId(fileId);
  //           console.log(imageResponse);
  //           return URL.createObjectURL(
  //             new Blob([imageResponse], { type: "image/jpeg" })
  //           );
  //         }
  //       );
  //       const images = await Promise.all(imagePromises);
  //       setLicenseImages(images);
  //       setIsLicenseModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching license image:", error);
  //   }
  // };

  // Close License Modal
  const handleCloseLicenseModal = () => {
    licenseImages.forEach((url) => URL.revokeObjectURL(url)); // Revoke URLs
    setIsLicenseModalOpen(false);
    setSelectedLicense(null);
    setLicenseImages([]);
  };

  async function handleFishClick(order) {
    setSelectedFish(order.fishes);
    setIsModalOpen(true);

    try {
      if (Array.isArray(order.fishes) && order.fishes.length > 0) {
        const imagePromises = order.fishes.map(async (fish) => {
          const fileId = fish.file.id;
          const imageResponse = await getFileByFileId(fileId);
          return URL.createObjectURL(
            new Blob([imageResponse], { type: "image/jpeg" })
          );
        });

        const imageUrls = await Promise.all(imagePromises);
        setImagePreviews(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching fish images:", error);
    }
  }

  const handleCloseModal = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setIsModalOpen(false);
    setSelectedFish(null);
    setImagePreviews([]);
  };

  // useEffect(() => {
  //   if (origin && destination) {
  //     const directionsService = new window.google.maps.DirectionsService();
  //     directionsService.route(
  //       {
  //         origin: origin,
  //         destination: destination,
  //         travelMode: window.google.maps.TravelMode.DRIVING,
  //       },
  //       (result, status) => {
  //         if (status === "OK" && result) {
  //           setDirections(result);
  //           const route = result.routes[0];
  //           const totalDistance = route.legs[0].distance.text;
  //           setDistance(totalDistance);
  //         } else {
  //           console.error(`Error fetching directions ${status}`);
  //         }
  //       }
  //     );
  //   } else {
  //     setDirections(null);
  //   }
  // }, [origin, destination]);

  
  useEffect(() => {
    fetchMapBounds();
  }, [orderData])
  
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const handleHomeBack = () => {
    navigate("/");
  };

  const handleMapLoad = (map) => {
    setMap(map);
    fetchMapBounds();
  };

  function fetchMapBounds() {
    if (map) {
      if (!orderData) {
        return;
      }
      // eslint-disable-next-line no-undef
      const bounds = new google.maps.LatLngBounds();

      if (orderData) {
        // eslint-disable-next-line no-undef
        bounds.extend(new google.maps.LatLng(parseFloat(orderData.destinationLatitude), parseFloat(orderData.destinationLongitude)));
        // eslint-disable-next-line no-undef
        bounds.extend(new google.maps.LatLng(parseFloat(orderData.senderLatitude), parseFloat(orderData.senderLongitude)));
      }

      map.fitBounds(bounds);
    }
  }

  return (
    <div>
      <ToastUtil />
      <AppBar position="static" color="default">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <img
              onClick={() => handleHomeBack()}
              src="./src/assets/logo.png"
              alt="Logo"
              style={{ height: "40px", width: "auto" }}
            />
          </Box>
          {/* Search Input */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TextField
              variant="outlined"
              label="Search by Tracking ID"
              type=""
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Google Map with Order Details */}
        <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={10}
            center={center}
            onLoad={handleMapLoad}
          >
            {currentDelivery && (
              <>
                <Marker
                  position={{
                    lat: parseFloat(currentDelivery.latitude),
                    lng: parseFloat(currentDelivery.longitude),
                  }}
                  icon={{
                    url: CurrentPosition,
                  }}
                ></Marker>
              </>
            )}

            {orderData && (
              <>
                <Marker
                  position={{
                    lat: parseFloat(orderData.senderLatitude),
                    lng: parseFloat(orderData.senderLongitude),
                  }}
                  icon={{
                    url: GreenMarker,
                  }}
                >
                </Marker>
                <Marker
                  position={{
                    lat: parseFloat(orderData.destinationLatitude),
                    lng: parseFloat(orderData.destinationLongitude),
                  }}
                  icon={{
                    url: BlueMarker,
                  }}
                >
                </Marker>

                <Polyline
                  path={[
                    {
                      lat: parseFloat(orderData.senderLatitude),
                      lng: parseFloat(orderData.senderLongitude),
                    },
                    {
                      lat: parseFloat(orderData.destinationLatitude),
                      lng: parseFloat(orderData.destinationLongitude),
                    },
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
              </>
            )}
            {/* {directions && <DirectionsRenderer directions={directions} />} */}
          </GoogleMap>

          {/* Display order data and distance if available */}
          {orderData && (
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: 2,
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                zIndex: 1,
                maxWidth: "300px",
              }}
              onClick={() => setIsShowAll(!isShowAll)}
            >
              <>
                {/* .toLocaleString() */}
                <Typography variant="h6">Order Detail</Typography>
                <Typography variant="body2">
                  <strong>Expected finish date:</strong>{" "}
                  {dateTimeConvert(orderData.expectedFinishDate)}
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong>{" "}
                  {`${Math.floor(orderData.price).toLocaleString()} VND`}
                </Typography>
                <Typography variant="body2">
                  <strong>Order status:</strong>{" "}
                  {orderStatusLabels[orderData.orderStatus]}
                </Typography>
                <Typography variant="body2">
                  <strong>Sender:</strong> {orderData.senderAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Receiver:</strong> {orderData.destinationAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Distance:</strong> {calculateDistance(
                    parseFloat(orderData.senderLatitude),
                    parseFloat(orderData.senderLongitude),
                    parseFloat(orderData.destinationLatitude),
                    parseFloat(orderData.destinationLongitude)
                  )}
                </Typography>
              </>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleFishClick(orderData)}
                  sx={{
                    padding: "6px 12px",
                    fontSize: "0.875rem",
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#115293",
                    },
                  }}
                >
                  View Fish
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Modal
        open={isLicenseModalOpen}
        onCancel={handleCloseLicenseModal}
        onOk={handleCloseLicenseModal}
        style={{ maxWidth: "80vw", top: 20 }}
      >
        {selectedLicense ? (
          <div>
            <Title level={4} style={{ color: "#01428E" }}>
              License Details
            </Title>

            <div className="slider-container" style={{ marginTop: "16px" }}>
              {licenseImages.length === 1 ? (
                // Show single image if there's only one license image
                <img
                  src={licenseImages[0]}
                  alt="License"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              ) : (
                // Show ImageSlider if there are multiple license images
                <ImageSlider images={licenseImages} />
              )}
            </div>
          </div>
        ) : (
          "No licenses to show"
        )}
      </Modal>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        style={{ maxWidth: "80vw", top: 20 }}
      >
        {selectedFish ? (
          <div>
            <Title level={4} style={{ color: "#01428E" }}>
              {selectedFish?.name || "Unnamed Fish"}
            </Title>

            <div className="slider-container" style={{ marginTop: "16px" }}>
              {imagePreviews.length === 1 ? (
                // Show single image if there's only one
                <img
                  src={imagePreviews[0]}
                  alt="Fish"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              ) : (
                // Show ImageSlider if there are multiple images
                <ImageSlider images={imagePreviews} />
              )}
            </div>
          </div>
        ) : (
          "No fish selected"
        )}
      </Modal>
    </div>
  );
};

export default Trackin;
