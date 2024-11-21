import axiosClient from "../axios";

export async function getFishesByOrderId(orderId) {
    try {
        const response = await axiosClient.get(`fishes/getFishByOrderId/${orderId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFishById(fishId) {
    try {
        const response = await axiosClient.delete(`fishes/delete-fish/${fishId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function createFishOrderInfo(
    fishName,
    fishAge,
    fishSize,
    fishWeight,
    fishPrice,
    fishImage,
    orderId
) {
    try {
        const response = await axiosClient.post("fishes/createFishByOrderId", {
            fishName,
            fishAge,
            fishSize,
            fishWeight,
            fishPrice,
            fishImage,
            orderId
        }, {
            headers: {
                'Accept': '*/*', // Accept all types for this request
                'Content-Type': 'multipart/form-data' // Set Content-Type if uploading a file
            }
        });
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// export async function updateFishById(
//     fishId,
//     name,
//     age,
//     size,
//     weight,
//     price,
//     image,
// ) {
//     try {
//         const response = await axiosClient.post(`fishes/editFish/${fishId}`, {
//             name,
//             age,
//             size,
//             weight,
//             price,
//             image,
//         }, {
//             headers: {
//                 'Accept': '*/*', // Accept all types for this request
//                 'Content-Type': 'multipart/form-data' // Set Content-Type if uploading a file
//             }
//         });
//         return response.data
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function getAllFishes() {
    try {
        const response = await axiosClient.get("fishes/getAllFishes");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateFishStatusById(id, status) {
    console.log(status);
    try {
        const response = await axiosClient.put(`fishes/update-fish-status/${id}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}