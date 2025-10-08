import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Add request interceptor for auth tokens if needed
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
export const productService = {
  getAllRestaurants: () => api.get('/restaurants'),
  getAllFoods: () => api.get(`/foods`),
  getAllOpenings: () => api.get('/openings'),
  getOpeningsByDay: (id, day) => api.get(`/openings/${id}/${day}`),
  updateRestaurant: (id, data) => api.put(`/restaurant/${id}`, data),
  updateOpening: (id, data) => api.put(`/openings/${id}`, data)
};
export default api;