import BASE_URL from "../store/Baseurl";


const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.detail || data.message || data.error || 'An error occurred';
    throw new Error(errorMessage);
  }

  return data;
};

const makeRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const authAPI = {
  register: async (fullName, gender, email, password, confirmPassword) => {
    return makeRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        full_name: fullName,
        gender: gender,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      }),
      skipAuth: true,
    });
  },

  sendOTP: async (email) => {
    return makeRequest('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  verifyOTP: async (email, otp) => {
    return makeRequest('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      skipAuth: true,
    });
  },

  setPassword: async (email, password, confirmPassword) => {
    return makeRequest('/auth/set-password/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword
      }),
      skipAuth: true,
    });
  },

  login: async (identifier, password) => {
    return makeRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      skipAuth: true,
    });
  },

  forgotPassword: async (email) => {
    return makeRequest('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  resetPassword: async (email, otp, password, confirmPassword) => {
    return makeRequest('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        otp,
        password,
        confirm_password: confirmPassword
      }),
      skipAuth: true,
    });
  },

  googleLogin: async (accessToken) => {
    return makeRequest('/auth/google/token/', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
      skipAuth: true,
    });
  },

  // getCurrentUser: async () => {
  //   return makeRequest('/auth/me/', {
  //     method: 'GET',
  //   });
  // },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return makeRequest('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      skipAuth: true,
    });
  },
};

export const profileAPI = {
  getProfile: async () => {
    return makeRequest('/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (profileData) => {
    return makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

export const storeTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};
