import api from '../utils/api';

export const authService = {
  // Login user
  async login(identifier, password) {
    try {
      const response = await api.post('/auth/login/', {
        identifier,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Check admin status
  async checkAdminStatus() {
    try {
      const response = await api.get('/auth/is-admin/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check admin status' };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};