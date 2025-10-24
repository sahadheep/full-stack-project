import api from '../utils/apiClient';

const sendRequest = async (recipientId) => {
  try {
    if (!recipientId) {
      throw new Error('Recipient ID is required');
    }
    const response = await api.post('/connections/request', { recipientId });
    if (!response.data || response.data.status === 'error') {
      throw new Error(response.data?.message || 'Failed to send connection request');
    }
    return response.data;
  } catch (error) {
    console.error('Failed to send connection request:', error.response?.data || error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to send connection request'
    );
  }
};

const acceptRequest = async (id) => {
  try {
    const response = await api.post(`/connections/${id}/accept`);
    return response.data;
  } catch (error) {
    console.error('Failed to accept connection:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to accept connection request');
  }
};

const rejectRequest = async (id) => {
  try {
    const response = await api.post(`/connections/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Failed to reject connection:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to reject connection request');
  }
};

const listConnections = async (query = '') => {
  try {
    const response = await api.get(`/connections${query ? `?${query}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Failed to list connections:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to list connections');
  }
};

export default { sendRequest, acceptRequest, rejectRequest, listConnections };
