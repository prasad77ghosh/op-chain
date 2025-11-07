import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auto-refresh token logic
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
