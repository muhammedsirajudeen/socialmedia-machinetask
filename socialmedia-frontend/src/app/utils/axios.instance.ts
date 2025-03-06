import axios from "axios";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

// Add a request interceptor to set the Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;