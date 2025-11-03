import apiClient from './axiosConfig';

const getAllApprovedGems = async () => {
  try {
    const response = await apiClient.get('/admin/gems/approved');
    return response.data;
  } catch (error) {
    console.error('Error fetching approved gems:', error);
    throw error.response?.data?.message || 'Failed to fetch approved gems';
  }
};

const deleteGem = async (gemId) => {
  try {
    const response = await apiClient.delete(`/admin/gems/${gemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting gem ${gemId}:`, error);
    throw error.response?.data?.message || 'Failed to delete gem';
  }
};

const listedGemsService = {
  getAllApprovedGems,
  deleteGem,
};

export default listedGemsService;
