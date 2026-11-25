
import axios from 'axios';

// Local development uses Vite proxy.
// Production connects directly to the Render backend.
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? '/api'
    : 'https://dbms-capstone-sem3.onrender.com/api');

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fcb_auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize server errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalizedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred with the server.',
      status: error.response?.status || 500,
      details:
        error.response?.data?.details ||
        error.response?.data?.errors ||
        null,
    };

    if (error.response?.status === 401) {
      localStorage.removeItem('fcb_auth_token');
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
