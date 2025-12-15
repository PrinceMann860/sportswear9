import api from '../utils/api';

export const userService = {
  // Get all users
  async getUsers() {
    try {
      const response = await api.get('/profile/admin/users/');
      return response.data?.results || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get single user details
  async getUser(userUuid) {
    try {
      const response = await api.get(`/profile/admin/users/${userUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

  // Get user addresses
  async getUserAddresses(userUuid) {
    try {
      const response = await api.get(`/profile/admin/users/${userUuid}/addresses/`);
      return response.data?.results || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user addresses' };
    }
  },

  // Delete user
  async deleteUser(userUuid) {
    try {
      const response = await api.delete(`/profile/admin/users/${userUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },
};