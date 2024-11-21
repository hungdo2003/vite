import axiosClient from "../axios";

export async function createNews(
  salesStaffId,
  title,
  description,
  image,
) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    console.log(description);
    formData.append("image", image);  // assuming image is a File object

    const response = await axiosClient.post(`news/createNews/${salesStaffId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function getAllNews() {
  try {
    const response = await axiosClient.get("news/getAllNews");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export async function deleteNewsById(newId) {
  try {
    const response = await axiosClient.delete(`news/deleteNewsById/${newId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


export async function getNewsById(newId) {
  try {
    const response = await axiosClient.get(`news/getNewsById/${newId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


// export async function updateNews(newsId, salesStaffId, title, description, imageFile) {
//   try {
//     const formData = new FormData();
//     formData.append('newsId', newsId);
//     formData.append('salesStaffId', salesStaffId);
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('image', imageFile);

//     const response = await axiosClient.put('news/update-news', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log('News updated successfully', response.data);
//   } catch (error) {
//     console.error('Error updating news', error);
//   }
// };