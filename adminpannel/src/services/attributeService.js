import api from '../utils/api';

export const attributeService = {
  async getAttributes() {
    try {
      const response = await api.get('/api/attributes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attributes' };
    }
  },

  async createAttribute(attributeData) {
    try {
      const response = await api.post('/api/attributes/admin/create/', attributeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create attribute' };
    }
  },

  async createAttributeValue(valueData) {
    try {
      const response = await api.post('/api/attributes/values/admin/create/', valueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create attribute value' };
    }
  },
};
