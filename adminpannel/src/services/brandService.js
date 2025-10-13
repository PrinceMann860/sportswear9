import api from '../utils/api';

export const brandService = {
  async getBrands() {
    try {
      const response = await api.get('/api/brands/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch brands' };
    }
  },

  async getBrand(uuid) {
    try {
      const response = await api.get(`/api/brands/${uuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch brand' };
    }
  },

  // Create brand
  async createBrand(brandData) {
    try {
      const response = await api.post('/api/brands/admin/create/', brandData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create brand' };
    }
  },

  // Update brand
  async updateBrand(uuid, brandData) {
    try {
      const response = await api.put(`/api/brands/admin/${uuid}/update/`, brandData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update brand' };
    }
  },

  // Delete brand
  async deleteBrand(uuid) {
    try {
      const response = await api.delete(`/api/brands/admin/${uuid}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete brand' };
    }
  },
};