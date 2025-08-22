import api from '@/utils/axiosConfig';
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;

export const claimRewardCode = async (code) => {
    try {
        const response = await api.post(`${API_BASE}/claim`, { code });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to claim this code.');
    }
};

export const redeemReward = async (productId, shippingDetails) => {
    try {
        const response = await api.post(`${API_BASE}/redeem`, { productId, shippingDetails });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to redeem reward.');
    }
};

export const getPointHistory = async () => {
    try {
        const response = await api.get(`${API_BASE}/point-history`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch point history.');
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get(`${API_BASE}/my-orders`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch order history.');
    }
};

export const getWelcomeRewardPreview = async () => {
    try {
        const response = await api.get(`${API_BASE}/preview-reward`);
        return response.data;
    } catch(error) {
        throw new Error('Could not load welcome reward preview.');
    }
};

export const getReferralGift = async () => {
    try {
        const response = await api.get(`${API_BASE}/referral-gift`);
        return response.data;
    } catch(error) {
        throw new Error('Could not load referral gift information.');
    }
};

export const getMyReferrals = async () => {
    try {
        const response = await api.get(`${API_BASE}/me/referrals`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch your referral history.');
    }
};

export const sendReferralNudge = async (refereeEmail) => {
    try {
        const response = await api.post(`${API_BASE}/me/referrals/nudge`, { email: refereeEmail });
        return response.data; // Returns { success, message, share_text }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to prepare nudge.');
    }
};