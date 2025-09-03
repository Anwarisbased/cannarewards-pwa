import api from '@/utils/axiosConfig';

// --- V1 Endpoints (Still in use by forms, modals, etc.) ---

export const loginUser = async (email, password) => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.post(`${API_BASE_V1}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Login failed. Please check your credentials.'
    );
  }
};

export const registerUser = async (registrationData) => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.post(
      `${API_BASE_V1}/register`,
      registrationData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Registration failed. Please try again.'
    );
  }
};

export const updateUserProfile = async (profileData) => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.post(`${API_BASE_V1}/me/update`, profileData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile.'
    );
  }
};

export const validateMagicLink = async (token) => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.post(`${API_BASE_V1}/validate-magic-link`, {
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'The magic link is invalid or has expired.'
    );
  }
};

// --- V2 Endpoints (Our new refactored endpoint) ---

export const getUserSession = async () => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/session`);
    return response.data;
  } catch (error) {
    throw new Error(
      'Could not fetch user session. Your session may be invalid.'
    );
  }
};
