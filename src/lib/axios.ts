import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("gym-sync-jwt-token");
    const isAuthEndpoint = config.url?.startsWith("/api/auth");

    if (!isAuthEndpoint && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;
