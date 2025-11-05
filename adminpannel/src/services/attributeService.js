import api from '../utils/api';

export const attributeService = {
  // Get all attributes (public)
  async getAttributes() {
    try {
      const response = await api.get('/api/attributes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attributes' };
    }
  },

  // Admin - Get all attributes with values
  async getAdminAttributes() {
    try {
      const response = await api.get('/api/attributes/admin/attributes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin attributes' };
    }
  },

  // Admin - Create attribute
  async createAttribute(attributeData) {
    try {
      const response = await api.post('/api/attributes/admin/attributes/', attributeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create attribute' };
    }
  },

  // Admin - Update attribute
  async updateAttribute(attributeId, attributeData) {
    try {
      const response = await api.patch(`/api/attributes/admin/attributes/${attributeId}/`, attributeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update attribute' };
    }
  },

  // Admin - Delete attribute
  async deleteAttribute(attributeId) {
    try {
      const response = await api.delete(`/api/attributes/admin/attributes/${attributeId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete attribute' };
    }
  },

  // Admin - Get all attribute values
  async getAttributeValues() {
    try {
      const response = await api.get('/api/attributes/admin/values/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch attribute values' };
    }
  },

  // Admin - Create attribute value
  async createAttributeValue(valueData) {
    try {
      const response = await api.post('/api/attributes/admin/values/', valueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create attribute value' };
    }
  },

  // Admin - Update attribute value
  async updateAttributeValue(valueId, valueData) {
    try {
      const response = await api.put(`/api/attributes/admin/values/${valueId}/`, valueData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update attribute value' };
    }
  },

  // Admin - Delete attribute value
  async deleteAttributeValue(valueId) {
    try {
      const response = await api.delete(`/api/attributes/admin/values/${valueId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete attribute value' };
    }
  },

  // Admin - Get product attributes
  async getProductAttributes(productUuid) {
    try {
      const response = await api.get('/api/attributes/admin/product-attributes/', {
        params: { product_uuid: productUuid }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product attributes' };
    }
  },

  // Admin - Add attribute to product
  async addProductAttribute(productUuid, attributeId) {
    try {
      const response = await api.post('/api/attributes/admin/product-attributes/', {
        product_uuid: productUuid,
        attribute_id: attributeId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add product attribute' };
    }
  },

  // Admin - Get variants
  async getVariants(productUuid = null) {
    try {
      const params = productUuid ? { product_uuid: productUuid } : {};
      const response = await api.get('/api/attributes/admin/variants/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch variants' };
    }
  },

  // Admin - Create variant
  async createVariant(variantData) {
    try {
      const response = await api.post('/api/attributes/admin/variants/', variantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create variant' };
    }
  },

  // Public - Get product variants
  async getProductVariants(productUuid) {
    try {
      const response = await api.get(`/api/attributes/${productUuid}/variants/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product variants' };
    }
  },

  // Admin - Update variant attribute
  async updateVariantAttribute(productUuid, variantId, attributeValueId, newAttributeValueId) {
    try {
      const response = await api.patch(
        `/api/products/admin/${productUuid}/variant/${variantId}/attribute/${attributeValueId}/update/`,
        { attribute_value: newAttributeValueId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update variant attribute' };
    }
  },

  // Admin - Delete variant attribute
  async deleteVariantAttribute(productUuid, variantId, attributeValueId) {
    try {
      const response = await api.delete(
        `/api/products/admin/${productUuid}/variant/${variantId}/attribute/${attributeValueId}/delete/`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete variant attribute' };
    }
  },

  // Admin - Upload variant media
  async uploadVariantAttributeImages(productUuid, variantId, attributeValueId, formData) {
    try {
      const response = await api.post(
        `/api/products/admin/products/${productUuid}/variants/${variantId}/attributes/${attributeValueId}/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload variant media' };
    }
  },

  // Admin - Update variant
  async updateVariant(variantId, variantData) {
    try {
      const response = await api.patch(`/api/attributes/admin/variants/${variantId}/`, variantData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update variant' };
    }
  },

  // Admin - Delete variant
  async deleteVariant(variantId) {
    try {
      const response = await api.delete(`/api/attributes/admin/variants/${variantId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete variant' };
    }
  },

  // Admin - Update media metadata
  async updateMediaMetadata(imageId, metadata) {
    try {
      const response = await api.patch(`/api/media/images/${imageId}/`, metadata);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update media metadata' };
    }
  },

  // Admin - Delete variant media
  async deleteVariantMedia(mediaId) {
    try {
      const response = await api.delete(`/api/attributes/admin/media/${mediaId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete variant media' };
    }
  },
};
