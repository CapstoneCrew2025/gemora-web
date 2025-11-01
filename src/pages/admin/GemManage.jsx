import { useState, useEffect } from 'react';
import gemManageService from '../../service/gemManage';

const GemManage = () => {
  const [gems, setGems] = useState([]);
  const [selectedGem, setSelectedGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [imageModal, setImageModal] = useState(null);

  const fixImageUrl = (url) => {
    if (!url) return null;
    return url.replace(/http:\/\/192\.168\.\d+\.\d+:8080/, 'http://localhost:8080');
  };

  useEffect(() => {
    fetchPendingGems();
  }, []);

  const fetchPendingGems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await gemManageService.getAllPendingGems();
      setGems(data);
    } catch (err) {
      setError(err.message || 'Failed to load pending gems');
    } finally {
      setLoading(false);
    }
  };

  const handleViewGem = (gem) => {
    setSelectedGem(gem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGem(null);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-700 border-green-300',
      REJECTED: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getListingTypeBadge = (type) => {
    return type === 'SALE'
      ? 'bg-blue-100 text-blue-700 border-blue-300'
      : 'bg-purple-100 text-purple-700 border-purple-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading pending gems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Gem Management</h1>
        <p className="text-sm sm:text-base text-gray-600">Review and manage pending gem listings</p>
      </div>

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

      <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Pending Gem Listings</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1">{gems.length}</p>
          </div>
          <div className="bg-yellow-100 p-3 sm:p-4 rounded-full">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {gems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center border border-gray-200">
          <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-800">No pending gems</h3>
          <p className="mt-2 text-sm sm:text-base text-gray-600">All gem listings have been reviewed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gem Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gems.map((gem) => (
                  <tr key={gem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{gem.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{gem.name}</div>
                          <div className="text-xs text-gray-500">{gem.certificationNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{gem.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${gem.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{gem.carat} ct</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getListingTypeBadge(gem.listingType)}`}>
                        {gem.listingType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(gem.status)}`}>
                        {gem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewGem(gem)}
                        className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-200">
            {gems.map((gem) => (
              <div key={gem.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{gem.name}</p>
                      <p className="text-xs text-gray-500">ID: #{gem.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(gem.status)}`}>
                    {gem.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">{gem.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-green-600">${gem.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Carat:</span>
                    <span className="font-semibold text-gray-900">{gem.carat} ct</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Type:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getListingTypeBadge(gem.listingType)}`}>
                      {gem.listingType}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewGem(gem)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Review Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && selectedGem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 sm:p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedGem.name}</h2>
                    <p className="text-green-100 text-sm">Gem ID: #{selectedGem.id}</p>
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

            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gem Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Category</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">{selectedGem.category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Price</p>
                    <p className="text-sm sm:text-base text-green-600 font-bold">${selectedGem.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Carat Weight</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">{selectedGem.carat} ct</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Origin</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">{selectedGem.origin}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Certification Number</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">{selectedGem.certificationNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Listing Type</p>
                    <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border ${getListingTypeBadge(selectedGem.listingType)}`}>
                      {selectedGem.listingType}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 text-xs sm:text-sm font-semibold rounded-full border ${getStatusBadgeColor(selectedGem.status)}`}>
                      {selectedGem.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Seller ID</p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">#{selectedGem.sellerId}</p>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Description</p>
                  <p className="text-sm sm:text-base text-gray-900">{selectedGem.description}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Created At</p>
                    <p className="text-xs sm:text-sm text-gray-900">{formatDateTime(selectedGem.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Updated At</p>
                    <p className="text-xs sm:text-sm text-gray-900">{formatDateTime(selectedGem.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {selectedGem.imageUrls && selectedGem.imageUrls.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Gem Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedGem.imageUrls.map((url, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div onClick={() => setImageModal({ url: fixImageUrl(`http://localhost:8080${url}`), title: `Image ${index + 1}` })} className="cursor-pointer">
                          <img
                            src={fixImageUrl(`http://localhost:8080${url}`)}
                            alt={`Gem ${index + 1}`}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-gray-300 hover:border-green-500 transition-all shadow-sm hover:shadow-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Image not available</text></svg>';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGem.certificates && selectedGem.certificates.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Certificates
                  </h3>
                  <div className="space-y-3">
                    {selectedGem.certificates.map((cert) => (
                      <div key={cert.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-600">Certificate Number</p>
                            <p className="text-sm font-semibold text-gray-900">{cert.certificateNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Issuing Authority</p>
                            <p className="text-sm font-semibold text-gray-900">{cert.issuingAuthority}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Issue Date</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(cert.issueDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Verification Status</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                              cert.verified ? 'bg-green-100 text-green-700 border-green-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            }`}>
                              {cert.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        {cert.fileUrl && (
                          <div className="mt-3">
                            <a
                              href={fixImageUrl(`http://localhost:8080${cert.fileUrl}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-semibold"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              View Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Reject
                </button>
                <button
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col">
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

export default GemManage;
