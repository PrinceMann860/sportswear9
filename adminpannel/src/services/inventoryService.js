import api from '../utils/api';

export const inventoryService = {
  // Get all inventory (admin view)
  async getAllInventory() {
    try {
      const response = await api.get('/api/inv/admin/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory' };
    }
  },

  // Get single inventory item
  async getInventoryItem(inventoryUuid) {
    try {
      const response = await api.get(`/api/inv/admin/${inventoryUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory item' };
    }
  },

  // Create inventory for a product/variant
  async createInventory(inventoryData) {
    try {
      const response = await api.post('/api/inv/admin/', inventoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create inventory' };
    }
  },

  // Update stock or availability
  async updateInventory(inventoryUuid, inventoryData) {
    try {
      const response = await api.patch(`/api/inv/admin/${inventoryUuid}/`, inventoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update inventory' };
    }
  },

  // Delete inventory record
  async deleteInventory(inventoryUuid) {
    try {
      const response = await api.delete(`/api/inv/admin/${inventoryUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete inventory' };
    }
  },

  // Get public stock info
  async getPublicStock(inventoryUuid) {
    try {
      const response = await api.get(`/api/inv/${inventoryUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch stock info' };
    }
  },

  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const response = await api.get('/api/inv/admin/summary/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory summary' };
    }
  },
};