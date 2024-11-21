/* eslint-disable react/prop-types */
import {
  Box,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  deleteOrderById,
  getOrdersByStatusAndCustomerId,
} from "../../../../utils/axios/order";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";
import { deleteFishById } from "../../../../utils/axios/fish";
import dateTimeConvert from "../../../../components/utils";

const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "text.primary",
  m: 1,
  border: 1,
};

const OrderInfoHeader = styled(Typography)(() => ({
  margin: "0px",
  color: "#252c6d",
  fontSize: "12px",
}));

const SearchBox = styled(Box)(() => ({
  display: "flex",
  gap: "30px"
}));

// const searchInputStyle = {
//   width: "100px", // Adjust width for smaller search inputs
//   boxSizing: "border-box",
//   padding: "8px", // Add some padding to ensure usability
// };

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

function PostedOrder({ customerId }) {
  const [orders, setOrders] = useState();
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders for display
  const [expandedOrderId, setExpandedOrderId] = useState(null); // To track expanded orders
  const [searchTrackingId, setSearchTrackingId] = useState(""); // For search by order ID
  const [searchOrderName, setSearchOrderName] = useState(""); // For search by customer name
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [fishModalOpen, setFishModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFishId, setSelectedFishId] = useState(null);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
  };

  const handleCloseFishrModal = () => {
    setFishModalOpen(false);
  };

  const navigate = useNavigate();

  const handleClick = (orderId) => {
    // Toggle the visibility of the order table by setting the orderId
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDeleteFish = (fishId, order) => {
    if (order.fishes.length > 1) {
      setSelectedFishId(fishId);
      setFishModalOpen(true);
    } else {
      toast("An order can not have empty fish");
    }
  }

  const handleDeleteFishConfirm = async () => {
    const response = await deleteFishById(selectedFishId);
    if (response) {
      toast("Delete fish successfully");
      fetchPostedOrder();
      setFishModalOpen(false);
    } else {
      toast("Unexpected error has been occured");
    }
  }

  const handleOpenEditPage = (order) => {
    if (order.fishes && order.fishes.length > 0) {
      navigate(`/customer-edit-order/${order.id}`, {
        state: order,
      });
    } else {
      toast("An order must have at least one fish");
    }
  };

  const handleOpenAddFishPage = (order) => {
    navigate(`/customer-add-fish/${order.id}`, {
      state: order,
    });
  };

  const handleDeleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setOrderModalOpen(true);
  };

  const postedOrderStatus = 1;
  async function fetchPostedOrder() {
    const response = await getOrdersByStatusAndCustomerId(customerId, postedOrderStatus);
    if (response) {
      setOrders(response);
      setFilteredOrders(response);
    }
  }

  useEffect(() => {
    fetchPostedOrder();
  }, []);

  const handleFilter = () => {
    let filtered = orders;

    if (searchTrackingId !== "") {
      // Filter by order ID
      filtered = filtered.filter((order) =>
        order.trackingId.includes(searchTrackingId.toUpperCase())
      );
    }

    if (searchOrderName !== "") {
      // Filter by customer name
      filtered = filtered.filter((order) =>
        order.name.toLowerCase().includes(searchOrderName.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  async function handleDeleteOrderConfirm() {
    try {
      const response = await deleteOrderById(
        selectedOrderId,
      );
      if (response) {
        toast("Delete order successfully");
        fetchPostedOrder();
        setOrderModalOpen(false);
      } else {
        toast("Unexpected error has been occured");
      }
    } catch (error) {
      console.log(error);
      toast("Unexpected error has been occured");
    }
  }

  useEffect(() => {
    handleFilter();
  }, [searchTrackingId, searchOrderName]);

  return (
    <div className="customer-home-order-list">
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
            Are you sure about delete this order ?
          </Typography>
          <div style={{ margin: "20px" }}></div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => handleDeleteOrderConfirm()}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      <Modal
        open={fishModalOpen}
        onClose={handleCloseFishrModal}
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
            Are you sure about delete this fish ?
          </Typography>
          <div style={{ margin: "20px" }}></div>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
            onClick={() => handleDeleteFishConfirm()}
          >
            Confirm
          </Button>
        </Box>
      </Modal>

      {orders && orders.length > 0 ? (
        <>
          <SearchBox >
            <div className="form-group">
              <input
                style={{
                  boxSizing: "border-box",
                }}
                placeholder="Tracking ID"
                type="text"
                name="text"
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                style={{
                  boxSizing: "border-box",
                }}
                placeholder="Name"
                type="text"
                name="text"
                value={searchOrderName}
                onChange={(e) => setSearchOrderName(e.target.value)}
                className="form-input"
              />
            </div>
          </SearchBox >

          {filteredOrders &&
            filteredOrders.map &&
            filteredOrders.map((order) => (
              <Box
                sx={{ ...commonStyles, borderRadius: "16px" }}
                className="order-box"
                key={order.id}
              >
                {/* Order details */}
                <div className="order-main-info">
                  <div className="order-text-info">
                    <div>
                      <OrderInfoHeader>Name</OrderInfoHeader>
                      <Typography>{order.name}</Typography>
                    </div>

                    <div>
                      <OrderInfoHeader>Created Date</OrderInfoHeader>
                      <Typography>
                      {dateTimeConvert(order.createdDate)}
                      </Typography>
                    </div>

                    <div>
                      <OrderInfoHeader>Expected Finish Date</OrderInfoHeader>
                      <Typography>
                      {dateTimeConvert(order.expectedFinishDate)}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <div>
                      <OrderInfoHeader>Sender Address</OrderInfoHeader>
                      <Typography>{order.senderAddress}</Typography>
                    </div>
                    <div>
                      <OrderInfoHeader>Destination Address</OrderInfoHeader>
                      <Typography>{order.destinationAddress}</Typography>
                    </div>
                  </div>

                  <div className="order-text-info">
                    <div>
                      <OrderInfoHeader>Price</OrderInfoHeader>
                      <Typography>{Math.floor(order.price).toLocaleString()} VND</Typography>
                    </div>
                    <div>
                      <OrderInfoHeader>Tracking Id</OrderInfoHeader>
                      <Typography>{order.trackingId}</Typography>
                    </div>

                    <div className="icon-group">
                      <div
                        className="button-icon"
                        onClick={() => handleOpenEditPage(order)}
                      >
                        <EditIcon />
                      </div>
                      <div
                        className="button-icon"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <RestoreFromTrashIcon />
                      </div>
                      <div
                        className="button-icon"
                        onClick={() => handleClick(order.id)}
                      >
                        <MenuOpenIcon />
                      </div>
                    </div>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table aria-label="order-details">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Age</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Weight</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.fishes &&
                          order.fishes.map &&
                          order.fishes.map((fish) => (
                            <TableRow key={fish.id}>
                              <TableCell>{fish.name}</TableCell>
                              <TableCell>{fish.age} years old</TableCell>
                              <TableCell>{fish.price} VND</TableCell>
                              <TableCell>{fish.size} cm</TableCell>
                              {fish.status === 0 && (
                                <TableCell>Unknown</TableCell>
                              )}
                              {fish.status === 1 && <TableCell>Good</TableCell>}
                              {fish.status === 2 && <TableCell>Sick</TableCell>}
                              {fish.status === 3 && <TableCell>Dead</TableCell>}
                              <TableCell>{fish.weight} gram</TableCell>
                              <TableCell><div className="button-icon" onClick={(e) => handleDropdownClick(e)}><MoreHorizIcon /></div>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={() => handleDropdownClose()}
                                >
                                  <MenuItem onClick={() => handleDeleteFish(fish.id, order)}>Delete Fish</MenuItem>
                                  {/* <MenuItem onClick={() => handleViewLicense()}>View License</MenuItem> */}
                                </Menu>
                              </TableCell>
                            </TableRow>
                          ))}
                        {/* Add "+" button below the fish list */}
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenAddFishPage(order)} // Correct
                              style={{
                                fontSize: "25px",
                                padding: "5px 20px",
                                borderRadius: "50%",
                              }}
                            >
                              +
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            ))}
        </>
      ) : (
        <Typography>No order found</Typography>
      )}
      <ToastUtil />
    </div>
  );
}

export default PostedOrder;
