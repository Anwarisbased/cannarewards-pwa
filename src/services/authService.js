import api from '@/utils/axiosConfig';
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;

export const loginUser = async (email, password) => {
    try {
        // This proxies to the JWT plugin
        const response = await api.post(`${API_BASE}/login`, { email, password });
        return response.data; // Should contain the token
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
};

export const registerUser = async (registrationData) => {
    try {
        const response = await api.post(`${API_BASE}/register`, registrationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
};

export const getMyData = async () => {
    try {
        const response = await api.get(`${API_BASE}/me`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch user data. Your session may be invalid.');
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.post(`${API_BASE}/me/update`, profileData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
};
// Add password request/reset functions here as needed