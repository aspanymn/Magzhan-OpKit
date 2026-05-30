import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const tasksService = {
  getTasks: () => api.get('/tasks'),
  getTask: (id: number) => api.get(`/tasks/${id}`),
  createTask: (title: string, description?: string) =>
    api.post('/tasks', { title, description }),
  updateTask: (id: number, data: any) => api.patch(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

export default api;
