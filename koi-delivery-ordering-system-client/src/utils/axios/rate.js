import axiosClient from "../axios";

export async function getAllPaymentRateService() {
    try {
        const response = await axiosClient.get("payment-service/get-all-payment-info");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateRateById(id, rate) {
    try {
        const response = await axiosClient.put(`payment-service/update-payment-info?id=${id}&rate=${rate}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
