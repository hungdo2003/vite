import axios from "axios";

const axiosClient = axios.create({
    baseURL: `http://localhost:8080/api/`,
    headers: {
		"Content-Type": "application/json",
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

// Axios request interceptor to add the Authorization header
axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        // Add Authorization header if the token exists
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    // Handle request errors here
    return Promise.reject(error);
});

// axiosClient.interceptors.request.use(async (config) => {
//     // Handle token here ...
//     const worker = localStorage.getItem("worker");
//     const { isLogged = false, access_token = "" } = JSON.parse(worker) || {};

//     if (isLogged) {
//       config.headers = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'AUTH_TOKEN': access_token,
//       }
//     }
//     return config;
//   });

export default axiosClient;