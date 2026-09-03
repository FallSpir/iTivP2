import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const fetchMetrics = (signal) =>
  api.get('/metrics', { signal });

export const createMetric = (metric) =>
  api.post('/metrics', metric);

export const updateMetric = (id, metric) =>
  api.put(`/metrics/${id}`, metric);

export const deleteMetric = (id) =>
  api.delete(`/metrics/${id}`);
