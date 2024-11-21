import axiosClient from "../axios";

export async function userLogin(email, password, userType) {
    try {
        const response = await axiosClient.post("auth/login",
            {
                email,
                password,
                userType
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function userRegister(email, username, password, phoneNumber) {
    try {
        const response = await axiosClient.post("auth/register-confirmation",
            {
                email,
                username,
                password,
                phoneNumber
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
        
        
    }
}

export async function userUpdateProfile(id, email, username, phoneNumber, password) {
    try {
        const response = await axiosClient.put("customer/updateCustomerProfile",
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

export async function userUpdateProfileImage(id, file) {
    try {
        const response = await axiosClient.put(`customer/updateCustomerAvatar/${id}`, {
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

export async function getCustomerById(id) {
    try {
        const response = await axiosClient.get(`customer/getCustomerById/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function getAllCustomers() {
    try {
        const response = await axiosClient.get("customer/getAllCustomers");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function managerEditCustomerProfile(id, username, email, phoneNumber) {
    try {
        const response = await axiosClient.put(`customer/updateCustomerById/${id}`,
            {
                username,
                email,
                phoneNumber
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function disableCustomerById(id) {
    try {
        const response = await axiosClient.put(`customer/disable/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function enableCustomerById(id) {
    try {
        const response = await axiosClient.put(`customer/enable/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}
