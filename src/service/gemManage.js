import apiClient from './axiosConfig';

const getAllPendingGems = async () => {
  try {
    const response = await apiClient.get('/admin/gems/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending gems:', error);
    throw error.response?.data?.message || 'Failed to fetch pending gems';
  }
};

const gemManageService = {
  getAllPendingGems,
};

export default gemManageService;
