import axiosClient from "../axios";

const prefixSalesStaff = "salesStaff/";

export async function getAllSalesStaff() {
  try {
    const response = await axiosClient.get(
      prefixSalesStaff + "getAllSalesStaff"
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function getSalesStaffById(id) {
  try {
    const response = await axiosClient.get(
      prefixSalesStaff + `getSalesStaffById/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function createSalesStaff(email, username, phoneNumber) {
  try {
    const response = await axiosClient.post(
      prefixSalesStaff + "createSalesStaff",
      {
        email,
        username,
        phoneNumber,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function salesStaffUpdateProfile(
  id,
  email,
  username,
  phoneNumber,
  password
) {
  try {
    const response = await axiosClient.put(
      prefixSalesStaff + "updateSalesStaffProfile",
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
    throw error.response.data;
  }
}

export async function salesStaffUpdateProfileImage(id, file) {
  try {
    const response = await axiosClient.put(
      prefixSalesStaff + `updateSalesStaffAvatar/${id}`,
      {
        file,
      },
      {
        headers: {
          Accept: "*/*", // Accept all types for this request
          "Content-Type": "multipart/form-data", // Set Content-Type if uploading a file
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function managerEditSalesStaffProfile(
  id,
  username,
  email,
  phoneNumber
) {
  try {
    const response = await axiosClient.put(
      `salesStaff/updateSalesStaffById/${id}`,
      {
        username,
        email,
        phoneNumber,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

// export async function deletesalesStaffById(id) {
//     try {
//         const response = await axiosClient.delete(`salesStaff/${id}`);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function disableSalesStaffById(id) {
  try {
    const response = await axiosClient.put(`salesStaff/disable/${id}`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}

export async function enableSalesStaffById(id) {
  try {
    const response = await axiosClient.put(`salesStaff/enable/${id}`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("An unexpected error occurred");
  }
}
