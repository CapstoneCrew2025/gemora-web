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

const replyToTicket = async (ticketId, replyData) => {
  try {
    const response = await apiClient.put(`/tickets/admin/${ticketId}/reply`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error replying to ticket ${ticketId}:`, error);
    throw error.response?.data?.message || 'Failed to send reply';
  }
};

const ticketService = {
  getAllTickets,
  replyToTicket,
};

export default ticketService;
