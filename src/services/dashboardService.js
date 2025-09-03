import api from '@/utils/axiosConfig';

/**
 * Fetches the dynamic data needed for the user dashboard.
 * @returns {Promise<object>} The dashboard data object.
 */
export const getDashboardData = async () => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/dashboard`);
    return response.data;
  } catch (error) {
    throw new Error('Could not load dashboard data.');
  }
};
