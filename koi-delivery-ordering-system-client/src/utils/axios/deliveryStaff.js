import axiosClient from "../axios";

const prefixAdminDeliveryStaff = "deliveryStaff/";

export async function getAllDeliveryStaff() {
    try {
        const response = await axiosClient.get(prefixAdminDeliveryStaff + "getAllDeliveryStaff");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function createDeliveryStaff(email, username, phoneNumber) {
    try {
        const response = await axiosClient.post(prefixAdminDeliveryStaff + "createDeliveryStaff",
            {
                email,
                username,
                phoneNumber
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function updateDeliveryStaffCurrentLocation(
    id,
    address,
    latitude,
    longitude) {
    try {
        const response = await axiosClient.put(prefixAdminDeliveryStaff + "updateDeliveryStaffLocation", {
            id, address, latitude, longitude
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function managerEditDeliveryStaffProfile(id, username, email, phoneNumber) {
    try {
        const response = await axiosClient.put(`deliveryStaff/updateDeliveryStaffById/${id}`,
            {
                username,
                email,
                phoneNumber
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function deliveryStaffUpdateProfile(id, email, username, phoneNumber, password) {
    try {
        const response = await axiosClient.put("deliveryStaff/updateDeliveryStaffProfile",
            {
                id,
                email,
                username,
                phoneNumber,
                password,
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function deliveryStaffUpdateProfileImage(id, file) {
    try {
        const response = await axiosClient.put(`deliveryStaff/updateDeliveryStaffAvatar/${id}`, {
            file
        }, {
            headers: {
                'Accept': '*/*', // Accept all types for this request
                'Content-Type': 'multipart/form-data' // Set Content-Type if uploading a file
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function getDeliveryStaffById(id) {
    try {
        const response = await axiosClient.get(`deliveryStaff/getDeliveryStaffById/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

// export async function deleteDeliveryStaffById(id) {
//     try {
//         const response = await axiosClient.delete(`deliveryStaff/deleteDeliveryStaffById/${id}`);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function disableDeliveryStaffById(id) {
    try {
        const response = await axiosClient.put(`deliveryStaff/disable/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function enableDeliveryStaffById(id) {
    try {
        const response = await axiosClient.put(`deliveryStaff/enable/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}