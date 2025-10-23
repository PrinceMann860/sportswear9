import api from '../utils/api';

export const productService = {
  // Get all products
  async getProducts(params = {}) {
    try {
      const response = await api.get('/api/products/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get single product
  async getProduct(productUuid) {
    try {
      const response = await api.get(`/api/products/${productUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create product
  async createProduct(productData) {
    try {
      const response = await api.post('/api/products/admin/create/', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Update product - using PATCH instead of PUT
  async updateProduct(productUuid, productData) {
    try {
      const response = await api.patch(`/api/products/admin/${productUuid}/`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Delete product
  async deleteProduct(productUuid) {
    try {
      const response = await api.delete(`/api/products/admin/${productUuid}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // Add variant
  async addVariant(productId, variantData) {
    try {
      const response = await api.post(`/api/products/admin/${productId}/add-variant/`, variantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add variant' };
    }
  },

  // Update variant
  async updateVariant(variantId, variantData) {
    try {
      const response = await api.put(`/api/products/admin/variant/${variantId}/update/`, variantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update variant' };
    }
  },

  // Delete variant
  async deleteVariant(variantId) {
    try {
      const response = await api.delete(`/api/products/admin/variant/${variantId}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete variant' };
    }
  },

  // Upload media
  async uploadMedia(variantId, formData) {
    try {
      const response = await api.post(`/api/products/admin/variant/${variantId}/upload-media/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload media' };
    }
  },

  // Delete media
  async deleteMedia(mediaId) {
    try {
      const response = await api.delete(`/api/products/admin/media/${mediaId}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete media' };
    }
  },

  // Add specifications
  async addSpecs(productId, specsData) {
    try {
      const response = await api.post(`/api/products/admin/${productId}/add-specs/`, specsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add specifications' };
    }
  },

  // Update specification
  async updateSpec(specId, specData) {
    try {
      const response = await api.put(`/api/products/admin/spec/${specId}/update/`, specData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update specification' };
    }
  },

  // Delete specification
  async deleteSpec(specId) {
    try {
      const response = await api.delete(`/api/products/admin/spec/${specId}/delete/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete specification' };
    }
  },
};