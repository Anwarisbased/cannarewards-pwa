import api from '@/utils/axiosConfig';

// Define the v2 API base for our new proxy endpoints.
const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Fetches the rewards catalog from our secure backend proxy.
 * No API keys are needed here. Authentication is handled by the user's JWT.
 * @returns {Promise<Array>} A list of product objects.
 */
export const getProducts = async () => {
    try {
        const response = await api.get(`${API_BASE_V2}/catalog/products`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load the product catalog.');
    }
};

/**
 * Fetches a single product by its ID from our secure backend proxy.
 * @param {string|number} productId The ID of the product to fetch.
 * @returns {Promise<Object>} The product object.
 */
export const getProductById = async (productId) => {
    try {
        const response = await api.get(`${API_BASE_V2}/catalog/products/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load product details.');
    }
};