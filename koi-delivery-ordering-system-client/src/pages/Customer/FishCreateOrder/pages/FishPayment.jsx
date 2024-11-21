import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../../../utils/axios/order";
import { paymentOpenGateway, logPaymentHistory, getPaymentHistory } from "../../../../utils/axios/payment";
import { jwtDecode } from "jwt-decode";

function FishPayment() {
  const { orderId } = useParams();
  const location = useLocation();
  const { state } = location;

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    let customerId;
    if (token) {
      const customerInfo = jwtDecode(token);
      customerId = customerInfo.sub.substring(2);
    }

    try {
      const paymentResponse = await logPaymentHistory(customerId, orderId, Math.floor(state));
      const paymentOpen = await paymentOpenGateway(customerId, Math.floor(state), "NCB");

      if (paymentOpen) {
        let paymentWindow = window.open(paymentOpen.paymentUrl, "_blank");

        let checkWindowClosed = setInterval(async function () {
          if (paymentWindow.closed) {
            clearInterval(checkWindowClosed);
            if (paymentResponse) {
              const paymentCheck = await getPaymentHistory(paymentResponse.id);
              if (paymentCheck.paymentStatus) {
                const postedStatus = 1;
                const updateStatusResponse = await updateOrderStatus(orderId, postedStatus);
                if (updateStatusResponse) {
                  toast.success("Payment successful. Fish added to the order.");
                }
              } else {
                toast.error("Payment failed or cancelled.");
              }
            } else {
              toast.error("Unexpected error has occurred");
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment");
    }
  };

  return (
    <div>
      <h2>Payment for Fish Order</h2>
      <button onClick={() => handlePayment()}>Proceed to Payment</button>
    </div>
  );
}

export default FishPayment;