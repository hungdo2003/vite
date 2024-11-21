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
} from "@mui/material";
import { useEffect, useState } from "react";
import { getOrdersByStatusAndCustomerId } from "../../../../utils/axios/order";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  gap: "30px",
}));

function DeliveringOrder({ customerId }) {
  const [orders, setOrders] = useState();
  const [expandedOrderId, setExpandedOrderId] = useState(null); // To track expanded orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders for display
  const [searchTrackingId, setSearchTrackingId] = useState(""); // For search by order ID
  const [searchOrderName, setSearchOrderName] = useState(""); // For search by customer name

  const handleClick = (orderId) => {
    // Toggle the visibility of the order table by setting the orderId
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    const deliveringOrderStatus = 6;
    async function fetchGettingOrder() {
      const response = await getOrdersByStatusAndCustomerId(
        customerId,
        deliveringOrderStatus
      );
      if (response) {
        setOrders(response);
        setFilteredOrders(response);
      }
    }

    fetchGettingOrder();
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

  useEffect(() => {
    handleFilter();
  }, [searchTrackingId, searchOrderName]);

  return (
    <div className="customer-home-order-list">
      {orders && orders.length > 0 ? (
        <>
          <SearchBox>
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
          </SearchBox>

          {filteredOrders &&
            filteredOrders.map &&
            filteredOrders.map((order) => (
              <>
                <Box
                  sx={{ ...commonStyles, borderRadius: "16px" }}
                  className="order-box"
                  key={order.id}
                >
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
                        <Typography>
                          {Math.floor(order.price).toLocaleString()} VND
                        </Typography>
                      </div>
                      <div>
                        <OrderInfoHeader>Tracking Id</OrderInfoHeader>
                        <Typography>{order.trackingId}</Typography>
                      </div>

                      <div className="icon-group">
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
                                {fish.status === 1 && (
                                  <TableCell>Good</TableCell>
                                )}
                                {fish.status === 2 && (
                                  <TableCell>Sick</TableCell>
                                )}
                                {fish.status === 3 && (
                                  <TableCell>Dead</TableCell>
                                )}
                                <TableCell>{fish.weight} gram</TableCell>
                                <TableCell>
                                  <div className="button-icon">
                                    <MoreHorizIcon />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </>
            ))}
        </>
      ) : (
        <Typography>No order found</Typography>
      )}
    </div>
  );
}

export default DeliveringOrder;
