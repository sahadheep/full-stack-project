import axios from 'axios';
import storage from './storageService';
const BASE_API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/api' : '/api';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies
});

api.interceptors.request.use((config) => {
  const tokens = storage.getTokens();
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  } else {
    // If no token, check if we're on a protected route and redirect to login
    const protectedPaths = ['/profiles', '/connections'];
    if (protectedPaths.some(path => window.location.pathname.startsWith(path))) {
      window.location.href = '/login';
    }
  }
  return config;
});

api.interceptors.response.use((res) => res, async (err) => {
  const original = err.config;
  if (err.response?.status === 401 && !original._retry && err.response?.data?.code === 'TOKEN_EXPIRED') {
    original._retry = true;
    try {
      // Refresh token is handled via HTTP-only cookie
      const refreshRes = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
        withCredentials: true
      });
      const { accessToken, expiresIn } = refreshRes.data.data;
      storage.setTokens({ access: accessToken, expiresIn });
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (e) {
      storage.clearTokens();
      window.location.href = '/login';
      return Promise.reject(e);
    }
  }
  // Enhance error message
  const message = err.response?.data?.message || err.message || 'An error occurred';
  err.message = message;
  return Promise.reject(err);
});

export default api;
