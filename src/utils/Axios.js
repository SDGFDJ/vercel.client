import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const baseURL = import.meta.env.VITE_API_URL;

const Axios = axios.create({
  baseURL,
  withCredentials: true,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Unauthorized Error
    if (error.response?.status === 401 && !originalRequest._retry) {
      // avoid multiple refresh requests
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
        handleLogout(error.config.url);
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
        handleLogout(error.config.url);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Refresh Token function
const refreshAccessToken = async (refreshToken) => {
  const response = await axios({
    ...SummaryApi.refreshToken,
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  return response.data.data.accessToken;
};

// ✅ Logout handler (Smart redirect)
const handleLogout = (requestUrl) => {
  localStorage.removeItem("accesstoken");
  localStorage.removeItem("refreshToken");

  // ⚠️ Public routes → don't redirect
  const publicRoutes = ["/", "/home", "/product", "/products"];
  const isPublicRoute = publicRoutes.some((r) => requestUrl?.includes(r));

  if (!isPublicRoute && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default Axios;
