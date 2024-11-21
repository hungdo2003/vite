import { useEffect, useState } from "react";
import { getOnGoingOrderForDeliveryStaff } from "../../../utils/axios/order";
import OrderCard from "./OrderCard/OrderCard";
import { jwtDecode } from "jwt-decode";
import { Box, ListItemIcon, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

function GettingOrderDeliveryStaff() {
  const [orders, setOrders] = useState();

  const token = localStorage.getItem("token");
  let deliveryStaffId;
  if (token) {
    const deliveryStaffInfo = jwtDecode(token);
    deliveryStaffId = deliveryStaffInfo.sub.substring(2);
  }

  useEffect(() => {
    const gettingOrderStatus = 3;
    async function fetchOrder() {
      const ongoingGettingOrderResponse = await getOnGoingOrderForDeliveryStaff(
        deliveryStaffId,
        0,
        gettingOrderStatus
      );
      if (ongoingGettingOrderResponse) {
        setOrders(ongoingGettingOrderResponse);
      }
    }

    fetchOrder();
  }, []);

  return (
    <div className="content-container">
      <Box style={{ marginLeft: "10px" }} display="flex" alignItems="center" mb={3} marginLeft={-4} color="blue">
        <ListItemIcon sx={{ color: "blue", marginRight: "-2%" }}>
          <ListIcon />
        </ListItemIcon>
        <Typography variant="h6">Getting Orders</Typography>
      </Box>
      <OrderCard orders={orders} />
    </div>
  );
}

export default GettingOrderDeliveryStaff;
