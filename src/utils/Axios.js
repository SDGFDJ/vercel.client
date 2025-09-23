import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Axios = axios.create({
  baseURL,
  withCredentials: true,
});

// Flag to avoid multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return Axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        localStorage.setItem("accesstoken", newAccessToken);
        Axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Refresh token function
const refreshAccessToken = async (refreshToken) => {
  const response = await axios({
    ...SummaryApi.refreshToken,
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data.data.accessToken;
};

// Logout handler
const handleLogout = () => {
  localStorage.removeItem("accesstoken");
  localStorage.removeItem("refreshToken");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default Axios;
