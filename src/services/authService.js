import api from '@/utils/axiosConfig';

// REMOVED: const API_BASE = ...

export const loginUser = async (email, password) => {
    // CONSTRUCT URL INSIDE THE FUNCTION
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
};

export const registerUser = async (registrationData) => {
    // CONSTRUCT URL INSIDE THE FUNCTION
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/register`, registrationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
};

export const getMyData = async () => {
    // CONSTRUCT URL INSIDE THE FUNCTION
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/me`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch user data. Your session may be invalid.');
    }
};

export const updateUserProfile = async (profileData) => {
    // CONSTRUCT URL INSIDE THE FUNCTION
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/me/update`, profileData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile.');
    }
};