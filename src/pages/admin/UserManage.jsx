import { useState, useEffect } from 'react';
import userManageService from '../../service/userManage';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageModal, setImageModal] = useState(null); // For full-size image view

  // Helper function to fix image URLs
  const fixImageUrl = (url) => {
    if (!url) return null;
    // Replace the IP address with localhost
    return url.replace(/http:\/\/192\.168\.\d+\.\d+:8080/, 'http://localhost:8080');
  };

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userManageService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific user details
  const handleViewUser = async (userId) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const data = await userManageService.getUserById(userId);
      setSelectedUser(data);
    } catch (err) {
      setError(err.message || 'Failed to load user details');
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await userManageService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
      if (selectedUser?.id === userId) {
        handleCloseModal();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    return role === 'ADMIN' 
      ? 'bg-purple-100 text-purple-700 border-purple-300' 
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage all registered users</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Users Count */}
      <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Registered Users</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{users.length}</p>
          </div>
          <div className="bg-green-100 p-3 sm:p-4 rounded-full">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center border border-gray-200">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-800">No users found</h3>
          <p className="mt-2 text-sm sm:text-base text-gray-600">There are no registered users yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.contactNumber || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.idFrontImageUrl || user.idBackImageUrl || user.selfieImageUrl ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Available
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="text-green-600 hover:text-green-800 font-semibold mr-4 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">ID: #{user.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </div>
                  {user.contactNumber && (
                    <div className="flex items-center text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.contactNumber}
                    </div>
                  )}
                  <div className="flex items-center text-xs">
                    {user.idFrontImageUrl || user.idBackImageUrl || user.selfieImageUrl ? (
                      <span className="text-green-600 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Documents Available
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        No Documents
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewUser(user.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {modalLoading ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading user details...</p>
              </div>
            ) : selectedUser ? (
              <>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-green-600 font-bold text-xl sm:text-2xl">{selectedUser.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedUser.name}</h2>
                        <p className="text-green-100 text-sm">User ID: #{selectedUser.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 md:p-8">
                  {/* User Information */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      User Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Email Address</p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold break-all">{selectedUser.email}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Contact Number</p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold">
                          {selectedUser.contactNumber || <span className="text-gray-400 italic">Not provided</span>}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Role</p>
                        <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border ${getRoleBadgeColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ID Documents */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Identity Documents
                    </h3>

                    {!selectedUser.idFrontImageUrl && !selectedUser.idBackImageUrl && !selectedUser.selfieImageUrl ? (
                      <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center border border-gray-200">
                        <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 font-medium">No documents uploaded</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">This user has not provided any identity documents yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* ID Front Image */}
                        {selectedUser.idFrontImageUrl && (
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              ID Front
                            </p>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idFrontImageUrl), title: 'ID Front' })} className="cursor-pointer">
                              <img 
                                src={fixImageUrl(selectedUser.idFrontImageUrl)} 
                                alt="ID Front" 
                                className="w-full h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all shadow-sm hover:shadow-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idFrontImageUrl), title: 'ID Front' })}
                              className="mt-2 sm:mt-3 w-full text-center text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}

                        {/* ID Back Image */}
                        {selectedUser.idBackImageUrl && (
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              ID Back
                            </p>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idBackImageUrl), title: 'ID Back' })} className="cursor-pointer">
                              <img 
                                src={fixImageUrl(selectedUser.idBackImageUrl)} 
                                alt="ID Back" 
                                className="w-full h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all shadow-sm hover:shadow-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: selectedUser.idBackImageUrl, title: 'ID Back' })}
                              className="mt-2 sm:mt-3 w-full text-center text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}

                        {/* Selfie Image */}
                        {selectedUser.selfieImageUrl && (
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              Selfie
                            </p>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.selfieImageUrl), title: 'Selfie' })} className="cursor-pointer">
                              <img 
                                src={fixImageUrl(selectedUser.selfieImageUrl)} 
                                alt="Selfie" 
                                className="w-full h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all shadow-sm hover:shadow-md"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: fixImageUrl(selectedUser.selfieImageUrl), title: 'Selfie' })}
                              className="mt-2 sm:mt-3 w-full text-center text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Close
                    </button>
                    {selectedUser.role !== 'ADMIN' && (
                      <button
                        onClick={() => setDeleteConfirm(selectedUser.id)}
                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Size Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg sm:text-xl font-semibold">{imageModal.title}</h3>
              <button
                onClick={() => setImageModal(null)}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-10"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image Container */}
            <div className="flex items-center justify-center flex-1 overflow-auto">
              <img 
                src={imageModal.url} 
                alt={imageModal.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23ffffff" font-size="18">Image could not be loaded</text></svg>';
                }}
              />
            </div>

            {/* Instructions */}
            <div className="text-center mt-4">
              <p className="text-white text-xs sm:text-sm opacity-75">
                Click outside the image or press the X button to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManage;
