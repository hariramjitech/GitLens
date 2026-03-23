import axios from "axios";

// Create an Axios instance with base URL depending on environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Add an interceptor to inject the token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("github_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if it's unauthorized
      localStorage.removeItem("github_token");
    }
    return Promise.reject(error);
  }
);

export default api;
