import axios from 'axios';

// Create a generic axios instance for our custom backend API calls (e.g. for /api/items)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for Better Auth cookies to be sent across domains
});

// Since Better Auth manages tokens via HttpOnly cookies, we no longer need an interceptor
// to manually attach a Bearer token from localStorage.

// We can still keep the response interceptor for generic error handling if we want.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if not already on login/register
        const currentPath = window.location.pathname;
        if (!['/login', '/register', '/'].includes(currentPath)) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
