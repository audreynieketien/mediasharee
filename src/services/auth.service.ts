import type { User } from '../types';

const CURRENT_USER_KEY = 'photo_share_current_user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AuthService = {
  login: async (username: string, role: 'consumer' | 'creator', password?: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, role, password }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error('Login failed');
    }
    const user = data.user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (username: string, email: string, password?: string): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
          throw new Error('Signup failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Signup failed');
      }
      const user = data.user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
    
  isAuthenticated: (): boolean => {
      return !!localStorage.getItem(CURRENT_USER_KEY);
  }
};
