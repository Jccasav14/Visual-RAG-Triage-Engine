import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer mock-jwt-token-12345';
  return config;
});
