import { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";
import { useOutletContext } from "react-router-dom";
import { getOrdersByStatus } from "../../../utils/axios/order";

function PostedOrderSalesStaff() {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { titleHeader } = useOutletContext();  
  
  useEffect(() => {
    const fetchPostedOrders = async () => {
      const response = await getOrdersByStatus(1); // postedOrderStatus = 1
      if (response) {
        setFilteredOrders(response);
      }
    };
    fetchPostedOrders();
  }, []);

  return <OrderCard orders={filteredOrders} titleHeader={titleHeader} />;
}

export default PostedOrderSalesStaff;
