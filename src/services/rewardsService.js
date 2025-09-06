import api from '@/utils/axiosConfig';

const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Fetches a preview of the welcome reward for unauthenticated users.
 */
export const getWelcomeRewardPreview = async () => {
  try {
    // This is a public endpoint, no auth needed.
    const response = await api.get(`${API_BASE_V2}/unauthenticated/welcome-reward-preview`);
    return response.data;
  } catch (error) {
    // A specific error is more helpful for debugging on the frontend.
    throw new Error('Could not load the welcome reward preview.');
  }
};

/**
 * --- START NEW FUNCTION ---
 * Submits a code for an unauthenticated user to validate it and get a registration token.
 * @param {string} code The QR code string.
 * @returns {Promise<object>} The server response containing the registration token.
 */
export const claimUnauthenticatedCode = async (code) => {
  try {
    const response = await api.post(`${API_BASE_V2}/unauthenticated/claim`, { code });
    return response.data.data; // The v2 response is nested in a 'data' property
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'This code is invalid or has already been used.'
    );
  }
};
/**
 * --- END NEW FUNCTION ---
 */

/**
 * Submits a scanned QR code to the backend for validation and processing.
 */
export const claimCodeV2 = async (code) => {
  try {
    const response = await api.post(`${API_BASE_V2}/actions/claim`, { code });
    return response.data.data; // Unwrap the data property
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
    return response.data.data; // Unwrap the data property
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
    // --- FIX: Unwrap the 'data' and then the 'history' property ---
    return response.data.data.history;
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
    // --- FIX: Unwrap the 'data' and then the 'orders' property ---
    return response.data.data.orders;
  } catch (error) {
    throw new Error('Could not fetch order history.');
  }
};