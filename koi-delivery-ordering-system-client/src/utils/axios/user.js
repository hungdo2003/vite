import axiosClient from "../axios";

export async function forgotPassword(email, userType) {
    try {
        const response = await axiosClient.post("auth/forgot-password", {
            email, userType
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function resetPassword(email, userType, password) {
    try {
        const response = await axiosClient.put("auth/reset-password", {
            email, userType, password
        })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}