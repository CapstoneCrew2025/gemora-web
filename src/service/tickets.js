import apiClient from './axiosConfig';

const getAllTickets = async () => {
  try {
    const response = await apiClient.get('/tickets/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error.response?.data?.message || 'Failed to fetch tickets';
  }
};

const ticketService = {
  getAllTickets,
};

export default ticketService;
