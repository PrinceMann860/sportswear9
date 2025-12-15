import api from '../utils/api';

export const homepageService = {
  // Levels
  async getLevels() {
    try {
      const response = await api.get('/api/main/levels/');
      return response.data?.results || response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch levels' };
    }
  },

  async createLevel(levelData) {
    try {
      const response = await api.post('/api/main/levels/', levelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create level' };
    }
  },

  async updateLevel(levelUuid, levelData) {
    try {
      const response = await api.patch(`/api/main/levels/${levelUuid}/`, levelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update level' };
    }
  },

  async deleteLevel(levelUuid) {
    try {
      const response = await api.delete(`/api/main/levels/${levelUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete level' };
    }
  },

  // Sections
  async getSections(levelUuid) {
    try {
      const response = await api.get(`/api/main/levels/${levelUuid}/sections/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sections' };
    }
  },

  async createSection(levelUuid, sectionData) {
    try {
      const response = await api.post(`/api/main/levels/${levelUuid}/sections/`, sectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create section' };
    }
  },

  async updateSection(sectionUuid, sectionData) {
    try {
      const response = await api.patch(`/api/main/sections/${sectionUuid}/`, sectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update section' };
    }
  },

  async deleteSection(sectionUuid) {
    try {
      const response = await api.delete(`/api/main/sections/${sectionUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete section' };
    }
  },

  // Items
  async getItems(sectionUuid) {
    try {
      const response = await api.get(`/api/main/sections/${sectionUuid}/items/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch items' };
    }
  },

  async createItem(sectionUuid, itemData) {
    try {
      const response = await api.post(`/api/main/sections/${sectionUuid}/items/`, itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create item' };
    }
  },

  async updateItem(itemUuid, itemData) {
    try {
      const response = await api.patch(`/api/main/items/${itemUuid}/`, itemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update item' };
    }
  },

  async deleteItem(itemUuid) {
    try {
      const response = await api.delete(`/api/main/items/${itemUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete item' };
    }
  },
};