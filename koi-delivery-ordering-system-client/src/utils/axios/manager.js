import axiosClient from "../axios";

const prefixManager = "manager/";

export async function getAllManagers() {
    try {
        const response = await axiosClient.get(prefixManager + "get-all-managers");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function createManagers(email, username, phoneNumber) {
    try {
        const response = await axiosClient.post(prefixManager + "create-manager",
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

export async function editManagerProfile(id, username, email, phoneNumber) {
    try {
        const response = await axiosClient.put(`manager/update-manager-by-id/${id}`,
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

export async function managerUpdateProfile(id, email, username, phoneNumber, password) {
    try {
        const response = await axiosClient.put(`manager/manager-edit-profile`,
            {
                id,
                email,
                username,
                phoneNumber,
                password
            }
        );
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function getManagerById(id) {
    try {
        const response = await axiosClient.get(`manager/get-manager-by-id/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}

export async function deleteManagerById(id) {
    try {
        const response = await axiosClient.delete(`manager/delete-manager-by-id/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An unexpected error occurred');
    }
}