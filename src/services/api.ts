import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect
      localStorage.removeItem('auth_token');
      localStorage.removeItem('photo_share_current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Filter interface for feed search
export interface FeedFilters {
  q?: string;
  location?: string;
  tag?: string;
  type?: 'image' | 'video';
  username?: string;
}

// API Methods
export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/signup', { username, email, password });
    return response.data;
  },

  adminCreateCreator: async (username: string, email: string, password: string, adminSecret: string) => {
    const response = await apiClient.post('/admin/create-creator', 
      { username, email, password },
      {
        headers: {
          'x-admin-secret': adminSecret
        }
      }
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Feed endpoints
  getFeed: async (page: number = 1, filters?: FeedFilters) => {
    const params = new URLSearchParams({ page: page.toString() });
    
    if (filters) {
      if (filters.q) params.append('q', filters.q);
      if (filters.location) params.append('location', filters.location);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.type) params.append('type', filters.type);
      if (filters.username) params.append('username', filters.username);
    }

    const response = await apiClient.get(`/feed?${params.toString()}`);
    return response.data;
  },

  // Media upload
  uploadMedia: async (formData: FormData) => {
    const response = await apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Interactions
  toggleLike: async (postId: string) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId: string, text: string) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },
};
