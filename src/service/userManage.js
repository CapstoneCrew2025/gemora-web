import apiClient from './axiosConfig';

/**
 * User Management Service
 * Handles all user-related API calls for admin operations
 */

/**
 * Get all users
 * @returns {Promise} List of all users
 */
const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error.response?.data?.message || 'Failed to fetch users';
  }
};

/**
 * Get user details by ID
 * @param {number} userId - The ID of the user
 * @returns {Promise} User details including ID photos
 */
const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error.response?.data?.message || 'Failed to fetch user details';
  }
};

/**
 * Delete user by ID
 * @param {number} userId - The ID of the user to delete
 * @returns {Promise} Delete confirmation
 */
const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

/**
 * Update user details
 * @param {number} userId - The ID of the user
 * @param {object} userData - Updated user data (name, contactNumber)
 * @returns {Promise} Updated user details
 */
const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error.response?.data?.message || 'Failed to update user';
  }
};

const userManageService = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};

export default userManageService;
