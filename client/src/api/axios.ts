import axios from 'axios';

// In production (Docker), use relative URLs so nginx can proxy to backend
// In development, use the full backend URL
const baseURL = import.meta.env.MODE === 'production' 
  ? '/api' 
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !window.location.href.includes('login')) {
      // Token is invalid or expired
      localStorage.removeItem('accessToken');
      // Redirect to login page
      window.location.href = '/login?message=Session expired. Please log in again.';
    }
    return Promise.reject(error);
  }
);

export default instance;