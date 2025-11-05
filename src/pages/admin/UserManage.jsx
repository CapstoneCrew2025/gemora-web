import { useState, useEffect } from 'react';
import userManageService from '../../service/userManage';
import Loader from '../../components/Loader';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', contactNumber: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Helper function to fix image URLs
  const fixImageUrl = (url) => {
    if (!url) return null;
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
      const [data] = await Promise.all([
        userManageService.getAllUsers(),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
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
      setError('');
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

  // Open edit modal
  const handleOpenEditModal = (user) => {
    setEditForm({
      name: user.name || '',
      contactNumber: user.contactNumber || ''
    });
    setEditModal(user);
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setEditLoading(true);
      setError('');
      
      const updatedUser = await userManageService.updateUser(editModal.id, {
        name: editForm.name.trim(),
        contactNumber: editForm.contactNumber.trim()
      });

      setUsers(users.map(user => 
        user.id === editModal.id ? updatedUser : user
      ));

      if (selectedUser?.id === editModal.id) {
        setSelectedUser(updatedUser);
      }

      setEditModal(null);
      setEditForm({ name: '', contactNumber: '' });
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    return role === 'ADMIN' 
      ? 'bg-purple-100 text-purple-700 border-purple-300' 
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  if (loading) {
    return <Loader message="Loading users..." />;
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/20 font-['Inter'] relative overflow-hidden">
    {/* Gem Watermark */}
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
      <svg className="w-[800px] h-[800px] text-emerald-600 transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>

    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
      {/* Header with Gradient */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-['Poppins'] tracking-tight">
              User Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">Manage all registered users</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm animate-slideDown">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats Card */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-50 uppercase tracking-wider mb-2">Total Registered Users</p>
                <p className="text-5xl font-black text-white font-['Poppins'] tracking-tight">{users.length}</p>
                <p className="text-emerald-100 text-sm mt-2 font-medium">Active accounts in the system</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 sm:p-16 text-center border border-gray-100">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Poppins']">No users found</h3>
          <p className="text-gray-500 font-medium">There are no registered users in the system yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-green-50">
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">#{user.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-black text-base font-['Poppins']">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 font-medium">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.contactNumber ? (
                        <div className="flex items-center text-sm text-gray-600 font-medium">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {user.contactNumber}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic font-medium">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-extrabold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.idFrontImageUrl || user.idBackImageUrl || user.selfieImageUrl ? (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                          <span className="text-sm text-emerald-600 font-bold">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                          <span className="text-sm text-gray-400 font-medium">None</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-bold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-bold transition-colors"
                        >
                          Edit
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet/Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="p-5 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-xl font-['Poppins']">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-bold text-gray-900 font-['Poppins']">{user.name}</p>
                      <p className="text-xs text-gray-500 font-semibold">ID: #{user.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="space-y-2.5 mb-4 bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center text-sm text-gray-700 font-medium">
                    <svg className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.contactNumber && (
                    <div className="flex items-center text-sm text-gray-700 font-medium">
                      <svg className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.contactNumber}
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    {user.idFrontImageUrl || user.idBackImageUrl || user.selfieImageUrl ? (
                      <>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-emerald-600 font-bold">Documents Available</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                        <span className="text-gray-400 font-medium">No Documents</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewUser(user.id)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-black py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] font-['Poppins']"
                >
                  View Full Details
                </button>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-bold py-2.5 px-4 rounded-xl transition-all"
                  >
                    Edit
                  </button>
                  {user.role !== 'ADMIN' ? (
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold py-2.5 px-4 rounded-xl transition-all"
                    >
                      Delete
                    </button>
                  ) : (
                    <div className="bg-gray-100 text-gray-400 text-sm font-bold py-2.5 px-4 rounded-xl text-center cursor-not-allowed">
                      Protected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" onClick={(e) => e.stopPropagation()}>
            {modalLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600 font-semibold">Loading user details...</p>
              </div>
            ) : selectedUser ? (
              <>
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-emerald-600 font-black text-2xl font-['Poppins']">{selectedUser.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-black text-white font-['Poppins']">{selectedUser.name}</h2>
                        <p className="text-emerald-100 text-sm font-bold">User ID: #{selectedUser.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="text-white hover:text-gray-200 transition-colors bg-white/20 hover:bg-white/30 rounded-xl p-2"
                    >
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8">
                  {/* User Information */}
                  <div className="mb-8">
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 font-['Poppins']">User Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-600 font-bold mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Address
                        </p>
                        <p className="text-base text-gray-900 font-bold break-all">{selectedUser.email}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-600 font-bold mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Contact Number
                        </p>
                        <p className="text-base text-gray-900 font-bold">
                          {selectedUser.contactNumber || <span className="text-gray-400 italic font-medium">Not provided</span>}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <p className="text-sm text-gray-600 font-bold mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          User Role
                        </p>
                        <span className={`inline-flex px-4 py-2 text-sm font-extrabold rounded-xl ${getRoleBadgeColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ID Documents */}
                  <div>
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 font-['Poppins']">Identity Documents</h3>
                    </div>

                    {!selectedUser.idFrontImageUrl && !selectedUser.idBackImageUrl && !selectedUser.selfieImageUrl ? (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-2xl text-center border-2 border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-lg font-bold text-gray-700 mb-2 font-['Poppins']">No documents uploaded</p>
                        <p className="text-sm text-gray-500 font-medium">This user hasn't provided any identity documents yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ID Front Image */}
                        {selectedUser.idFrontImageUrl && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-all hover:shadow-lg group">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-black text-gray-700 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                ID Front
                              </p>
                            </div>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idFrontImageUrl), title: 'ID Front' })} className="cursor-pointer relative overflow-hidden rounded-xl">
                              <img 
                                src={fixImageUrl(selectedUser.idFrontImageUrl)} 
                                alt="ID Front" 
                                className="w-full h-52 object-cover rounded-xl border-2 border-gray-300 group-hover:border-emerald-500 transition-all shadow-md group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idFrontImageUrl), title: 'ID Front' })}
                              className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition-all"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}

                        {/* ID Back Image */}
                        {selectedUser.idBackImageUrl && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-all hover:shadow-lg group">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-black text-gray-700 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                ID Back
                              </p>
                            </div>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idBackImageUrl), title: 'ID Back' })} className="cursor-pointer relative overflow-hidden rounded-xl">
                              <img 
                                src={fixImageUrl(selectedUser.idBackImageUrl)} 
                                alt="ID Back" 
                                className="w-full h-52 object-cover rounded-xl border-2 border-gray-300 group-hover:border-emerald-500 transition-all shadow-md group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: fixImageUrl(selectedUser.idBackImageUrl), title: 'ID Back' })}
                              className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition-all"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}

                        {/* Selfie Image */}
                        {selectedUser.selfieImageUrl && (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-all hover:shadow-lg group">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-black text-gray-700 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Selfie
                              </p>
                            </div>
                            <div onClick={() => setImageModal({ url: fixImageUrl(selectedUser.selfieImageUrl), title: 'Selfie' })} className="cursor-pointer relative overflow-hidden rounded-xl">
                              <img 
                                src={fixImageUrl(selectedUser.selfieImageUrl)} 
                                alt="Selfie" 
                                className="w-full h-52 object-cover rounded-xl border-2 border-gray-300 group-hover:border-emerald-500 transition-all shadow-md group-hover:scale-105"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
                                <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <button 
                              onClick={() => setImageModal({ url: fixImageUrl(selectedUser.selfieImageUrl), title: 'Selfie' })}
                              className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 py-2 rounded-lg transition-all"
                            >
                              View Full Size →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-xl transition-all text-base"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handleCloseModal();
                        handleOpenEditModal(selectedUser);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold rounded-xl transition-all text-base shadow-md hover:shadow-lg font-['Poppins']"
                    >
                      Edit User
                    </button>
                    {selectedUser.role !== 'ADMIN' && (
                      <button
                        onClick={() => setDeleteConfirm(selectedUser.id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold rounded-xl transition-all text-base shadow-md hover:shadow-lg font-['Poppins']"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 font-['Poppins']">Confirm Deletion</h3>
              <p className="text-base text-gray-600 mb-6 font-medium">
                Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg font-['Poppins']"
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
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-black font-['Poppins']">{imageModal.title}</h3>
              <button
                onClick={() => setImageModal(null)}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-center flex-1 overflow-auto">
              <img 
                src={imageModal.url} 
                alt={imageModal.title}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23374151"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23ffffff" font-size="18">Image could not be loaded</text></svg>';
                }}
              />
            </div>

            <div className="text-center mt-4">
              <p className="text-white text-sm opacity-75 font-medium">
                Click outside the image or press the X button to close
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - UPDATED WITH EMERALD COLORS AND WATERMARK */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp relative overflow-hidden">
            {/* Watermark in Edit Modal */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-64 h-64 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>

            {/* Modal Header - Changed to Emerald */}
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6 rounded-t-2xl relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg mr-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white font-['Poppins']">Edit User</h2>
                    <p className="text-emerald-100 text-sm font-bold">Update user information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditModal(null);
                    setEditForm({ name: '', contactNumber: '' });
                    setError('');
                  }}
                  className="text-white hover:text-gray-200 transition-colors bg-white/20 hover:bg-white/30 rounded-xl p-2"
                  disabled={editLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 relative z-10">
              <div className="space-y-5">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-extrabold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                    disabled={editLoading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="edit-contact" className="block text-sm font-extrabold text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="edit-contact"
                    name="contactNumber"
                    value={editForm.contactNumber}
                    onChange={handleEditFormChange}
                    disabled={editLoading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed font-semibold"
                    placeholder="Enter contact number"
                  />
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border-2 border-emerald-100">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-bold">Email:</span>
                    <span className="font-extrabold text-gray-900">{editModal.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-bold">Role:</span>
                    <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${getRoleBadgeColor(editModal.role)}`}>
                      {editModal.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Buttons - Changed to Emerald */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(null);
                    setEditForm({ name: '', contactNumber: '' });
                    setError('');
                  }}
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg font-['Poppins']"
                >
                  {editLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

    <style jsx>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideDown {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-slideDown {
        animation: slideDown 0.3s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
    `}</style>
  </div>
);
};

export default UserManage;