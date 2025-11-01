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

const approveGem = async (gemId) => {
  try {
    const response = await apiClient.put(`/admin/gems/${gemId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving gem ${gemId}:`, error);
    throw error.response?.data?.message || 'Failed to approve gem';
  }
};

const gemManageService = {
  getAllPendingGems,
  approveGem,
};

export default gemManageService;
