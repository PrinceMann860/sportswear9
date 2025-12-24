import BASE_URL from "../store/Baseurl";
// Centralized API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || BASE_URL,
  TIMEOUT: 30000,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Cache implementation
class APICache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, duration = API_CONFIG.CACHE_DURATION) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration,
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp, duration } = cached;
    const isExpired = Date.now() - timestamp > duration;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new APICache();

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    SEND_OTP: '/auth/send-otp/',
    VERIFY_OTP: '/auth/verify-otp/',
    SET_PASSWORD: '/auth/set-password/',
    FORGOT_PASSWORD: '/auth/forgot-password/',
    RESET_PASSWORD: '/auth/reset-password/',
    REFRESH_TOKEN: '/auth/token/refresh/',
    GOOGLE_LOGIN: '/auth/google/token/',
  },
  
  // Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/products/',
    DETAIL: (uuid) => `/api/products/${uuid}/`,
    SEARCH: '/api/products/search/',
    FEATURED: '/api/products/featured/',
  },
  
  // Brands
  BRANDS: {
    LIST: '/api/brands/',
    DETAIL: (name) => `/api/brands/${name}/`,
  },
  
  // Cart
  CART: {
    GET: '/api/cart/',
    ADD: '/api/cart/add/',
    UPDATE: (id) => `/api/cart/update/${id}/`,
    REMOVE: (id) => `/api/cart/remove/${id}/`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/api/orders/',
    DETAIL: (id) => `/api/orders/${id}/`,
    CREATE: '/api/orders/create/',
  },
  
  // Homepage
  HOMEPAGE: {
    LEVELS: '/api/homepage/levels/',
  },
};

// Request handler with caching
export const makeRequest = async (endpoint, options = {}, useCache = false) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}_${url}`;

  // Check cache for GET requests
  if (useCache && (!options.method || options.method === 'GET')) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.detail || data.message || data.error || 'An error occurred';
      throw new Error(errorMessage);
    }

    // Cache successful GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      apiCache.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Export base URL for media files
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path}`;
};

export default API_CONFIG;
