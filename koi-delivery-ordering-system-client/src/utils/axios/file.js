import axiosClient from "../axios";

export async function getFileByFileId(id) {
    try {
        const response = await axiosClient.get(`images/getFileSystem/${id}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
