import axiosClient from "../axios";

export async function getAllPaymentHistory() {
    try {
        const response = await axiosClient.get("payment-history/get-all-payment-history");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}