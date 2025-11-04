import api from '../utils/api';

export const couponService = {
  // Global coupons
  async getGlobalCoupons() {
    try {
      const response = await api.get('/api/products/admin/coupons/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch global coupons' };
    }
  },

  async createGlobalCoupon(couponData) {
    try {
      const response = await api.post('/api/products/admin/coupons/', couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create global coupon' };
    }
  },

  async updateGlobalCoupon(couponId, couponData) {
    try {
      const response = await api.patch(`/api/products/admin/coupons/${couponId}/`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update global coupon' };
    }
  },

  async deleteGlobalCoupon(couponId) {
    try {
      const response = await api.delete(`/api/products/admin/coupons/${couponId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete global coupon' };
    }
  },

  // Product-specific coupons
  async getProductCoupons(productUuid) {
    try {
      const response = await api.get(`/api/products/admin/${productUuid}/coupons/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product coupons' };
    }
  },

  async createProductCoupon(productUuid, couponData) {
    try {
      const response = await api.post(`/api/products/admin/${productUuid}/coupons/`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product coupon' };
    }
  },

  async updateProductCoupon(productUuid, couponId, couponData) {
    try {
      const response = await api.patch(`/api/products/admin/${productUuid}/coupons/${couponId}/`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product coupon' };
    }
  },

  async deleteProductCoupon(productUuid, couponId) {
    try {
      const response = await api.delete(`/api/products/admin/${productUuid}/coupons/${couponId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product coupon' };
    }
  },

  // Validate coupon
  async validateCoupon(couponCode, productUuid = null) {
    try {
      const payload = { code: couponCode };
      if (productUuid) {
        payload.product_uuid = productUuid;
      }
      const response = await api.post('/api/products/validate-coupon/', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to validate coupon' };
    }
  },
};