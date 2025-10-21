import apiClient from './axiosConfig';

/**
 * User Service
 * Handles all user-related API calls
 */
const userService = {
  /**
   * Get all users (Admin only)
   * @param {object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} List of users
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  /**
   * Get user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise} User details
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  /**
   * Create new user (Admin only)
   * @param {object} userData - User data
   * @returns {Promise} Created user
   */
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  /**
   * Update user
   * @param {string|number} userId - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  /**
   * Delete user (Admin only)
   * @param {string|number} userId - User ID
   * @returns {Promise} Success message
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  /**
   * Update current user profile
   * @param {object} profileData - Profile data
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Upload user avatar
   * @param {File} file - Avatar image file
   * @param {function} onProgress - Upload progress callback
   * @returns {Promise} Upload result
   */
  uploadAvatar: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.upload('/users/avatar', formData, onProgress);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Success message
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  /**
   * Search users (Admin only)
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  searchUsers: async (query) => {
    try {
      const response = await apiClient.get('/users/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users');
    }
  },
};

export default userService;
