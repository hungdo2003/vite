import { useEffect, useState } from "react";
import { getOrdersByStatus } from "../../../utils/axios/order";
import OrderCard from "./OrderCard/OrderCard";
import { Box, ListItemIcon, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

function AvailableToGet() {
  const [orders, setOrders] = useState();

  useEffect(() => {
    const availableToGetStatus = 2;
    async function fetchOrder() {
      const response = await getOrdersByStatus(availableToGetStatus);
      if (response) {
        setOrders(response);
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
        <Typography variant="h6">Available to Get</Typography>
      </Box>
      <OrderCard orders={orders} />
    </div>
  );
}

export default AvailableToGet;
