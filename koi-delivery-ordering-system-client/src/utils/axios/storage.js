import axiosClient from "../axios";

export async function getAllStorages() {
    try {
        const response = await axiosClient.get("storage/getAllStorages");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function createStorage(name, address, latitude, longitude) {
    try {
        const response = await axiosClient.post("storage/createStorage",
            {
                name, 
                address, 
                latitude, 
                longitude
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
