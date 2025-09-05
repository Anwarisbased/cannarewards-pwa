import api from '@/utils/axiosConfig';

const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Submits a scanned QR code to the backend for validation and processing.
 */
export const claimCodeV2 = async (code) => {
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
 * Fetches the user's point transaction history from the v2 endpoint.
 */
export const getPointHistoryV2 = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/history`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch point history.');
  }
};

/**
 * Fetches the user's order history from the v2 endpoint.
 */
export const getMyOrdersV2 = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/orders`);
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch order history.');
  }
};