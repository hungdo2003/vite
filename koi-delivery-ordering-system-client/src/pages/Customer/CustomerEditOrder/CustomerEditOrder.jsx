import OrderInfo from "./pages/OrderInfo";
import "./customer_create_order.scss"
import { useLocation } from "react-router-dom";

function CustomerEditOrder() {
    const location = useLocation();
    const { state } = location;

    return (
        <OrderInfo order={state} />
    )
}

export default CustomerEditOrder;