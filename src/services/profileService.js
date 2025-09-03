import api from '@/utils/axiosConfig';

const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Fetches the full, detailed user profile data.
 * @returns {Promise<object>} The user's complete profile object.
 */
export const getProfileData = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/profile`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch your profile data.');
  }
};

/**
 * Updates the user's profile data.
 * @param {object} profileData The data to update.
 * @returns {Promise<object>} The updated user profile object.
 */
export const updateProfileData = async (profileData) => {
  try {
    const response = await api.post(
      `${API_BASE_V2}/users/me/profile`,
      profileData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to update your profile.'
    );
  }
};
