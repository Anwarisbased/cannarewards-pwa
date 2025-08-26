import api from '@/utils/axiosConfig';

export const claimRewardCode = async (code) => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/claim`, { code });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to claim this code.');
    }
};

export const redeemReward = async (productId, shippingDetails) => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/redeem`, { productId, shippingDetails });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to redeem reward.');
    }
};

export const getPointHistory = async () => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/point-history`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch point history.');
    }
};

export const getMyOrders = async () => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/my-orders`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch order history.');
    }
};

export const getWelcomeRewardPreview = async () => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/preview-reward`);
        return response.data;
    } catch(error) {
        throw new Error('Could not load welcome reward preview.');
    }
};

export const getReferralGift = async () => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/referral-gift`);
        return response.data;
    } catch(error) {
        throw new Error('Could not load referral gift information.');
    }
};

export const getMyReferrals = async () => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.get(`${API_BASE}/me/referrals`);
        return response.data;
    } catch (error) {
        throw new Error('Could not fetch your referral history.');
    }
};

/**
 * Prepares a referral "nudge" for a user.
 * @param {string} refereeEmail The email of the user to nudge.
 * @returns {Promise<object>} An object containing success status and an array of `share_options`.
 */
export const sendReferralNudge = async (refereeEmail) => {
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;
    try {
        const response = await api.post(`${API_BASE}/me/referrals/nudge`, { email: refereeEmail });
        return response.data; // Expected to contain { success: true, share_options: [...] }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to prepare nudge.');
    }
};