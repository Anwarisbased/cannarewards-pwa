// src/utils/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// It's highly recommended to use environment variables for sensitive keys
// For Next.js, you would typically use process.env.NEXT_PUBLIC_WC_CONSUMER_KEY
// and process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET
const CONSUMER_KEY = 'Ck_f558638ba132f7aefbf4901cfb07b990e9673f8e';
const CONSUMER_SECRET = 'cs_2b65b3d9cad3279e015ebc84b32c350ec72ac011';

const api = axios.create({
    baseURL: API_BASE_URL,
    auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET
    }
});

export const fetchProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("API call failed:", error.response?.data || error.message);
        throw new Error('Failed to fetch products from API.');
    }
};