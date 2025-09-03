import api from '@/utils/axiosConfig';

const API_BASE_V2 = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v2`;

/**
 * Fetches the content of a specific WordPress page by its slug.
 * This is the new v2 endpoint.
 * @param {string} slug The slug of the page to fetch (e.g., 'terms-and-conditions').
 * @returns {Promise<object>} An object containing the page title and content.
 */
export const getPageContentV2 = async (slug) => {
  try {
    const response = await api.get(`${API_BASE_V2}/pages/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(`Could not load page content for "${slug}".`);
  }
};
