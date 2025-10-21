import apiClient from './axiosConfig';

const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Response with token and role
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Store token and role in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
      }

      return response.data;
    } catch (error) {
      // Handle error response
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred. Please try again.');
      }
    }
  },

  /**
   * Register new user with form data (including file uploads)
   * @param {FormData} formData - Form data with user details and images
   * @returns {Promise} Response with token and role
   */
  register: async (formData) => {
    try {
      const response = await apiClient.upload('/auth/register', formData);

      // Store token and role in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
      }

      return response.data;
    } catch (error) {
      // Handle error response
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw new Error('An error occurred. Please try again.');
      }
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  },

  /**
   * Get current token
   * @returns {string|null} JWT token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Get current user role
   * @returns {string|null} User role (ADMIN or USER)
   */
  getRole: () => {
    return localStorage.getItem('role');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Check if user is admin
   * @returns {boolean} Admin status
   */
  isAdmin: () => {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  },

  /**
   * Check if user is regular user
   * @returns {boolean} User status
   */
  isUser: () => {
    const role = localStorage.getItem('role');
    return role === 'USER';
  },
};

export default authService;