import api from '@/utils/axiosConfig';

const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Fetches a preview of the referral gift for unauthenticated users.
 */
export const getReferralGift = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/unauthenticated/referral-gift-preview`);
    return response.data;
  } catch (error) {
    throw new Error('Could not load the referral gift preview.');
  }
};

/**
 * Fetches the list of users referred by the current user from the v2 endpoint.
 * @returns {Promise<Array>} A list of referral objects.
 */
export const getMyReferrals = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/referrals`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch your referral history.');
  }
};

/**
 * Requests pre-composed "nudge" messages from the v2 endpoint for a specific referee.
 * @param {string} refereeEmail The email of the user to nudge.
 * @returns {Promise<object>} An object containing shareable message options.
 */
export const getNudgeOptions = async (refereeEmail) => {
  try {
    const response = await api.post(`${API_BASE_V2}/users/me/referrals/nudge`, {
      email: refereeEmail,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to prepare nudge.'
    );
  }
};