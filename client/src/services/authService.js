import api from './api.js';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('fcb_auth_token', res.data.token);
      localStorage.setItem('fcb_auth_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('fcb_auth_token');
    localStorage.removeItem('fcb_auth_user');
  },
  getStoredUser: () => {
    const userStr = localStorage.getItem('fcb_auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('fcb_auth_token');
  },
};
