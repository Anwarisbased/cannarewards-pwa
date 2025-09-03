import api from '@/utils/axiosConfig';

// For now, these still point to the v1 endpoints.
// We will refactor these to v2 in a future slice if needed.
const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;

/**
 * Fetches the list of users referred by the current user.
 * @returns {Promise<Array>} A list of referral objects.
 */
export const getMyReferrals = async () => {
  try {
    const response = await api.get(`${API_BASE_V1}/me/referrals`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch your referral history.');
  }
};

/**
 * Requests pre-composed "nudge" messages from the backend for a specific referee.
 * @param {string} refereeEmail The email of the user to nudge.
 * @returns {Promise<object>} An object containing shareable message options.
 */
export const getNudgeOptions = async (refereeEmail) => {
  try {
    const response = await api.post(`${API_BASE_V1}/me/referrals/nudge`, {
      email: refereeEmail,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to prepare nudge.'
    );
  }
};
