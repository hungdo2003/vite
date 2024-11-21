import { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";
import { getOrdersByStatus } from "../../../utils/axios/order";
import { useOutletContext } from "react-router-dom";

function ReceivedOrderSalesStaff() {
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders for display
  const { titleHeader } = useOutletContext();
  
  useEffect(() => {
    const receivedOrderStatus = 4;
    async function fetchPostedOrder() {
      const response = await getOrdersByStatus(receivedOrderStatus);
      if (response) {
        setFilteredOrders(response);
      }
    }

    fetchPostedOrder();
  }, []);

  return (
    <OrderCard orders={filteredOrders} titleHeader={titleHeader} />
  );
}

export default ReceivedOrderSalesStaff;
