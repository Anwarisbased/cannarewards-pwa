import api from '@/utils/axiosConfig';

/**
 * Submits a scanned QR code to the backend for validation and processing.
 */
export const claimCodeV2 = async (code) => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.post(`${API_BASE_V2}/actions/claim`, { code });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to claim this code.'
    );
  }
};

/**
 * Submits a redemption request for a product using points.
 */
export const redeemRewardV2 = async (productId, shippingDetails) => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.post(`${API_BASE_V2}/actions/redeem`, {
      productId,
      shippingDetails,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to redeem reward.'
    );
  }
};

/**
 * Fetches the user's point transaction history from the new v2 endpoint.
 */
export const getPointHistoryV2 = async () => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/history`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch point history.');
  }
};

/**
 * Fetches the user's order history from the new v2 endpoint.
 */
export const getMyOrdersV2 = async () => {
  const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/orders`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch order history.');
  }
};

// --- LEGACY V1 FUNCTIONS (to be refactored or deleted) ---

export const getWelcomeRewardPreview = async () => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.get(`${API_BASE_V1}/preview-reward`);
    return response.data;
  } catch (error) {
    throw new Error('Could not load welcome reward preview.');
  }
};

export const getReferralGift = async () => {
  const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
  try {
    const response = await api.get(`${API_BASE_V1}/referral-gift`);
    return response.data;
  } catch (error) {
    throw new Error('Could not load referral gift information.');
  }
};
