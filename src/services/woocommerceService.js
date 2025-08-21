import api from '@/utils/axiosConfig';

const WC_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3`;
const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
const authString = `consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

/**
 * Fetches all products from WooCommerce.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const getProducts = async () => {
    try {
        const response = await api.get(`${WC_BASE}/products?${authString}`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load the product catalog.');
    }
};

/**
 * Fetches a single product from WooCommerce by its ID.
 * @param {number|string} productId The ID of the product.
 * @returns {Promise<object>} A promise that resolves to the product object.
 */
export const getProductById = async (productId) => {
    try {
        const response = await api.get(`${WC_BASE}/products/${productId}?${authString}`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load product details.');
    }
};