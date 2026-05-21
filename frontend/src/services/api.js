import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

// Optional: Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Don't set Content-Type if FormData is being sent
    // Let axios auto-detect and set proper multipart headers
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    // If later you store token in redux
    // const token = store.getState().auth.token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || error.message);
  },
);

export default API;
