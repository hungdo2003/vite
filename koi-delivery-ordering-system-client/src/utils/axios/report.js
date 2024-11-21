import axiosClient from "../axios";
export async function getTotalOrders() {
  try {
    const response = await axiosClient.get("report/get-total-orders");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export async function getDeliveryStaffReporById(deliveryId) {
    try {
      const response = await axiosClient.get(`report/get-delivery-staff-report/${deliveryId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }