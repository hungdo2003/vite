import "./MainContent.scss";
import { useEffect, useState } from "react";
import { getOrdersByStatus } from "../../../../utils/axios/order";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ToastUtil from "../../../../components/toastContainer";
// import { toast } from "react-toastify";
// import Paragraph from "antd/es/typography/Paragraph";
import dateTimeConvert from "../../../../components/utils";
import ListIcon from "@mui/icons-material/List";

function MainContent() {
  const [postedOrder, setPostedOrder] = useState([]);
  const [receivedOrder, setReceivedOrder] = useState([]);
  // const [visibleNewsCount, setVisibleNewsCount] = useState(4);

  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedNewsId, setSelectedNewsId] = useState(null);

  const navigate = useNavigate();

  const postedStatus = 1; // Status for posted orders
  const receivedStatus = 4; // Status for received orders

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const postedOrderResponse = await getOrdersByStatus(postedStatus);
        const receivedOrderResponse = await getOrdersByStatus(receivedStatus);
        setPostedOrder(postedOrderResponse);
        setReceivedOrder(receivedOrderResponse);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrderData();
  }, []);

  // Handle the opening of the delete confirmation dialog

  const handleViewDetail = (order) => {
    navigate(`/sales-order-detail/${order.id}`, {
      state: order,
    });
  };

  return (
    <div className="main-content-container">
      <ToastUtil />
      <Box
        style={{ marginLeft: "10px" }}
        display="flex"
        alignItems="center"
        mb={3}
        marginLeft={-4}
        color="blue"
      >
        <ListItemIcon sx={{ color: "blue", marginRight: "-2%" }}>
          <ListIcon />
        </ListItemIcon>
        <Typography variant="h6">Home</Typography>
      </Box>

      <div className="order-container-sale">
        {postedOrder.length > 0 && (
          <div className="order-container">
            <div className="order">
              <strong>Posted Orders</strong>
            </div>
            <div className="order-card">
              {postedOrder.slice(0, 3).map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-content">
                    <h3 className="order-title">{order.name}</h3>
                    <p className="order-description">
                      Created Date: {dateTimeConvert(order.createdDate)}
                    </p>
                    <p className="order-description">
                      Expected Finish Date:{" "}
                      {dateTimeConvert(order.expectedFinishDate)}
                    </p>
                    <div className="order-footer">
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetail(order)}
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="view-more">
              <Button onClick={handleViewMorePostedOrders}>View more →</Button>
            </div> */}
          </div>
        )}

        <div className="gap"></div>

        {receivedOrder.length > 0 && (
          <div className="order-container">
            <div className="order">
              <strong>Received Orders</strong>
            </div>
            <div className="order-card">
              {receivedOrder.slice(0, 3).map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-content">
                    <h3 className="order-title">{order.name}</h3>
                    <p className="order-description">
                      Created Date: {dateTimeConvert(order.createdDate)}
                    </p>
                    <p className="order-description">
                      Expected Finish Date:{" "}
                      {dateTimeConvert(order.expectedFinishDate)}
                    </p>
                    <div className="order-footer">
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetail(order)}
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="view-more">
              <Button onClick={handleViewMoreReceivedOrders}>
                View more →
              </Button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainContent;
