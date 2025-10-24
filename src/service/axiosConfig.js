import axios from 'axios';

// API Base URL - Update this for production
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Create axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication token to all requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response scenarios
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('Error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Error setting up the request
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper methods for common HTTP requests
 */
const apiClient = {
  /**
   * GET request
   * @param {string} url - Endpoint URL
   * @param {object} config - Axios config options
   * @returns {Promise} Axios response
   */
  get: (url, config = {}) => {
    return axiosInstance.get(url, config);
  },

  /**
   * POST request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body data
   * @param {object} config - Axios config options
   * @returns {Promise} Axios response
   */
  post: (url, data = {}, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  /**
   * PUT request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body data
   * @param {object} config - Axios config options
   * @returns {Promise} Axios response
   */
  put: (url, data = {}, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  /**
   * PATCH request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body data
   * @param {object} config - Axios config options
   * @returns {Promise} Axios response
   */
  patch: (url, data = {}, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },

  /**
   * DELETE request
   * @param {string} url - Endpoint URL
   * @param {object} config - Axios config options
   * @returns {Promise} Axios response
   */
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  },

  /**
   * Upload file with FormData
   * @param {string} url - Endpoint URL
   * @param {FormData} formData - Form data with files
   * @param {function} onUploadProgress - Progress callback
   * @returns {Promise} Axios response
   */
  upload: (url, formData, onUploadProgress = null) => {
    return axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  /**
   * Download file
   * @param {string} url - Endpoint URL
   * @param {string} filename - File name for download
   * @returns {Promise} Axios response
   */
  download: async (url, filename) => {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response;
  },
};

// Export both the instance and helper methods
export { axiosInstance, API_BASE_URL };
export default apiClient;
