import axios, { CanceledError } from "axios";
import { clearAuthData, saveTokenInLocalStorage } from "./auth-service";

export { CanceledError };

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${apiClient.defaults.baseURL}/refresh-token`, { refreshToken }); 
                saveTokenInLocalStorage(response.data);

                originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                return apiClient(originalRequest);
            } catch {
                clearAuthData();
                window.location.href = "/auth";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;