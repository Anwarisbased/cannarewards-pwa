import api from '@/utils/axiosConfig';

/**
 * Fetches the global application configuration data.
 * This data is static per session and should be cached.
 * @returns {Promise<object>} The application configuration object.
 */
export const getAppConfig = async () => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.get(`${API_BASE_V2}/app/config`);
    return response.data;
  } catch (error) {
    throw new Error('Could not load application configuration.');
  }
};
