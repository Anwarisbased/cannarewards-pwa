import api from '@/utils/axiosConfig';

// REMOVED ALL TOP-LEVEL CONSTANTS

export const getProducts = async () => {
    const WC_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3`;
    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
    const authString = `consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    try {
        const response = await api.get(`${WC_BASE}/products?${authString}`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load the product catalog.');
    }
};

export const getProductById = async (productId) => {
    const WC_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3`;
    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
    const authString = `consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    try {
        const response = await api.get(`${WC_BASE}/products/${productId}?${authString}`);
        return response.data;
    } catch (error) {
        throw new Error('Could not load product details.');
    }
};