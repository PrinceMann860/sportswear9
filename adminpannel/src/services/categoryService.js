import api from '../utils/api';

export const categoryService = {
  async getCategories() {
    try {
      const response = await api.get('/api/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  },

  async getCategory(uuid) {
    try {
      const response = await api.get(`/api/categories/${uuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch category' };
    }
  },

  // Create category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/api/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create category' };
    }
  },

  // Update category
  async updateCategory(uuid, categoryData) {
    try {
      const response = await api.patch(`/api/categories/${uuid}/`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update category' };
    }
  },

  // Delete category
  async deleteCategory(uuid) {
    try {
      const response = await api.delete(`/api/categories/${uuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete category' };
    }
  },
};