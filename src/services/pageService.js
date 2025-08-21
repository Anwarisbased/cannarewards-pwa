import api from '@/utils/axiosConfig';
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1`;

/**
 * Fetches the content of a specific page from WordPress by its slug.
 * @param {string} slug The slug of the page to fetch (e.g., 'terms-and-conditions').
 * @returns {Promise<object>} An object containing the page title and content.
 */
export const getPageContent = async (slug) => {
    try {
        const response = await api.get(`${API_BASE}/page/${slug}`);
        return response.data;
    } catch (error) {
        throw new Error(`Could not load page content for "${slug}".`);
    }
};