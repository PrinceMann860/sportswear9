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

  // Create brand with multipart/form-data
  async createBrand(formData) {
    try {
      const response = await api.post('/api/brands/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create brand' };
    }
  },

  // Update brand (full update with multipart/form-data)
  async updateBrand(uuid, formData) {
    try {
      const response = await api.put(`/api/brands/admin/${uuid}/update/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update brand' };
    }
  },

  // Toggle brand active status (PATCH)
  async toggleBrandStatus(uuid, is_active) {
    try {
      const response = await api.patch(`/api/brands/${uuid}/admin/`, { is_active });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update brand status' };
    }
  },

  // Delete brand
  async deleteBrand(uuid) {
    try {
      const response = await api.delete(`/api/brands/${uuid}/admin/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete brand' };
    }
  },
};