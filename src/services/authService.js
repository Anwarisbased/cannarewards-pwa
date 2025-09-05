import api from '@/utils/axiosConfig';

// Define the base URLs for our v2 and legacy v1 APIs.
const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;
const API_BASE_V1 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`; // For password reset

/**
 * Logs a user in by calling the /v2/auth/login endpoint.
 * @param {string} email The user's email.
 * @param {string} password The user's password.
 * @returns {Promise<object>} The server response containing the JWT token and user data.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(`${API_BASE_V2}/auth/login`, {
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

/**
 * Registers a new user by calling the /v2/auth/register endpoint.
 * @param {object} registrationData The user's registration details.
 * @returns {Promise<object>} The server response.
 */
export const registerUser = async (registrationData) => {
  try {
    // This now points to our clean, contract-compliant v2 endpoint.
    const response = await api.post(
      `${API_BASE_V2}/auth/register`,
      registrationData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Registration failed. Please try again.'
    );
  }
};

/**
 * Fetches the lightweight session data for an already authenticated user.
 * @returns {Promise<object>} The user session object.
 */
export const getUserSession = async () => {
  try {
    const response = await api.get(`${API_BASE_V2}/users/me/session`);
    return response.data;
  } catch (error) {
    // This error is critical as it often means the token is invalid.
    // The AuthContext will handle this by logging the user out.
    throw new Error('Your session is invalid or has expired. Please log in again.');
  }
};

/**
 * Requests a password reset link from the legacy v1 endpoint.
 * @param {string} email The user's email address.
 * @returns {Promise<object>} The server's confirmation message.
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post(`${API_BASE_V1}/password/request`, { email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "An error occurred while requesting a password reset.");
    }
};

/**
 * Submits a new password along with the reset token.
 * @param {string} token The password reset token from the email link.
 * @param {string} email The user's email.
 * @param {string} password The new password.
 * @returns {Promise<object>} The server's success message.
 */
export const resetPassword = async (token, email, password) => {
    try {
        const response = await api.post(`${API_BASE_V1}/password/reset`, { token, email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to reset password. The link may be invalid or expired.");
    }
}