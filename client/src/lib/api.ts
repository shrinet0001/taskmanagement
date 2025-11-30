import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: 'pending' | 'completed';
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, username: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, username });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  
  create: async (input: CreateTaskInput) => {
    const response = await api.post<Task>('/tasks', input);
    return response.data;
  },
  
  update: async (id: string, input: UpdateTaskInput) => {
    const response = await api.put<Task>(`/tasks/${id}`, input);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;
