import axiosClient from "../axios";

export async function getAllTransaction() {
    try {
        const response = await axiosClient.get("transaction/get-all-transactions");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}