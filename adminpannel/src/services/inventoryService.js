import api from '../utils/api';

export const inventoryService = {
  async getInventory(productUuid) {
    try {
      const response = await api.get(`/api/inventory/admin/${productUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory' };
    }
  },

  async updateInventory(productUuid, inventoryData) {
    try {
      const response = await api.post(`/api/inventory/admin/${productUuid}/update/`, inventoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update inventory' };
    }
  },
};
