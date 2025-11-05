import { useAuth } from "../../context/AuthContext";
// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from "react-router-dom";
// Import React hooks for state management and side effects
import { useState, useEffect } from "react";
// Import the service to fetch pending gems data from the backend
import gemManageService from "../../service/pendingGems";

export default function Dashboard() {
  const { role, user } = useAuth();
  // Initialize navigate function to handle routing
  const navigate = useNavigate();
  
  // State to store the count of pending gems
  const [pendingGemsCount, setPendingGemsCount] = useState(0);
  // State to track loading status while fetching data
  const [isLoadingPendingCount, setIsLoadingPendingCount] = useState(true);

  // useEffect hook to fetch pending gems data when component mounts
  useEffect(() => {
    const fetchPendingGemsCount = async () => {
      try {
        setIsLoadingPendingCount(true);
        // Fetch all pending gems from the API
        const pendingGems = await gemManageService.getAllPendingGems();
        // Set the count based on the array length
        setPendingGemsCount(pendingGems?.length || 0);
      } catch (error) {
        console.error('Failed to fetch pending gems count:', error);
        // Set count to 0 if there's an error
        setPendingGemsCount(0);
      } finally {
        // Set loading to false after fetch completes
        setIsLoadingPendingCount(false);
      }
    };

    fetchPendingGemsCount();
  }, []); // Empty dependency array means this runs once when component mounts

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12.5%",
      icon: "👥",
      bgColor: "bg-blue-500",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+8.2%",
      icon: "💰",
      bgColor: "bg-green-500",
    },
    {
      title: "Orders",
      value: "856",
      change: "+23.1%",
      icon: "📦",
      bgColor: "bg-purple-500",
    },
    {
      title: "Products",
      value: "432",
      change: "+4.3%",
      icon: "💎",
      bgColor: "bg-pink-500",
    },
  ];

 return (
  <div className="min-h-screen bg-gray-50">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-lg">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-emerald-50 text-lg">
              Here's what's happening with Gemora Auction today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-emerald-50 text-sm">Today's Date</p>
              <p className="text-white font-semibold">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Key Metrics - Auction Specific with Custom Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Pending Approvals",
            // Display loading indicator or actual count of pending gems
            value: isLoadingPendingCount ? "..." : pendingGemsCount.toString(),
            change: "+3 today",
            bgColor: "bg-orange-500",
            description: "Gems awaiting valuation review",
            icon: (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                <path d="M13 3v4a1 1 0 001 1h4"/>
              </svg>
            )
          },
          {
            title: "Active Auctions",
            value: "45",
            change: "+8 this week",
            bgColor: "bg-emerald-500",
            description: "Live bidding sessions",
            icon: (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            )
          },
          {
            title: "Total Bids Today",
            value: "234",
            change: "+18.5%",
            bgColor: "bg-blue-500",
            description: "Active bidding activity",
            icon: (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.8 3.9l-6.9 6.9a1 1 0 000 1.4l6.9 6.9a1 1 0 001.4 0l2.8-2.8a1 1 0 000-1.4l-2.8-2.8 2.8-2.8a1 1 0 000-1.4l-2.8-2.8a1 1 0 00-1.4 0zm7.7 7.5a3 3 0 11-4.2 4.2 3 3 0 014.2-4.2z"/>
                <path d="M6.5 17.5l-3.2 3.2a1 1 0 01-1.4-1.4l3.2-3.2"/>
              </svg>
            )
          },
          {
            title: "Revenue (Month)",
            value: "$125,430",
            change: "+23.1%",
            bgColor: "bg-green-500",
            description: "Commission earned",
            icon: (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            )
          },
        ].map((stat, index) => (
          <div
            key={index}
            // Add cursor-pointer class and onClick handler for the "Pending Approvals" card (index 0)
            className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 ${
              index === 0 ? 'cursor-pointer' : ''
            }`}
            // Navigate to pending gems page when "Pending Approvals" card is clicked
            onClick={() => {
              if (index === 0) {
                navigate('/admin/gems');
              }
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-emerald-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold text-emerald-600">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Valuation Approvals */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pending Gem Approvals</h2>
                <p className="text-sm text-gray-600">Review valuation reports and approve/reject gems</p>
              </div>
            </div>
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              12 Pending
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gem Details</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valuation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Report</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { gem: 'Blue Sapphire 5.2ct', seller: 'John Doe', valuation: '$12,500', submitted: '2 hours ago', report: 'GIA Certified' },
                { gem: 'Emerald 3.8ct', seller: 'Jane Smith', valuation: '$8,900', submitted: '5 hours ago', report: 'IGI Report' },
                { gem: 'Ruby 4.5ct', seller: 'Bob Wilson', valuation: '$15,200', submitted: '1 day ago', report: 'AGS Certified' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.gem}</p>
                        <p className="text-xs text-gray-500">Natural gemstone</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{item.seller}</p>
                    <p className="text-xs text-gray-500">Verified Seller</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-900">{item.valuation}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.submitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Report</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        <span>Approve</span>
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Auctions & Bidding Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Auctions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Live Auctions</h2>
                  <p className="text-sm text-gray-600">Currently active bidding</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                View all →
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {[
              { gem: 'Diamond Ring 2.5ct', currentBid: '$45,000', bids: 23, timeLeft: '2h 15m', status: 'Hot' },
              { gem: 'Emerald Necklace', currentBid: '$28,500', bids: 18, timeLeft: '5h 30m', status: 'Active' },
              { gem: 'Ruby Bracelet', currentBid: '$19,200', bids: 12, timeLeft: '1d 3h', status: 'Active' },
              { gem: 'Sapphire Earrings', currentBid: '$15,800', bids: 9, timeLeft: '8h 45m', status: 'Active' },
            ].map((auction, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-bold text-gray-900">{auction.gem}</p>
                      {auction.status === 'Hot' && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                          </svg>
                          <span>HOT</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Current Bid: <span className="font-bold text-emerald-600">{auction.currentBid}</span></p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.8 3.9l-6.9 6.9a1 1 0 000 1.4l6.9 6.9a1 1 0 001.4 0l2.8-2.8a1 1 0 000-1.4l-2.8-2.8 2.8-2.8a1 1 0 000-1.4l-2.8-2.8a1 1 0 00-1.4 0z"/>
                        </svg>
                        <span>{auction.bids} bids</span>
                      </span>
                      <span className="text-xs font-semibold text-orange-600 flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span>{auction.timeLeft}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bidding Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.8 3.9l-6.9 6.9a1 1 0 000 1.4l6.9 6.9a1 1 0 001.4 0l2.8-2.8a1 1 0 000-1.4l-2.8-2.8 2.8-2.8a1 1 0 000-1.4l-2.8-2.8a1 1 0 00-1.4 0z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Bids</h2>
                  <p className="text-sm text-gray-600">Latest bidding activity</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {[
              { user: 'Alice Johnson', gem: 'Diamond Ring', bid: '$45,000', time: '2 min ago', type: 'new' },
              { user: 'Mark Davis', gem: 'Emerald Necklace', bid: '$28,500', time: '5 min ago', type: 'outbid' },
              { user: 'Sarah Lee', gem: 'Ruby Bracelet', bid: '$19,200', time: '12 min ago', type: 'new' },
              { user: 'Tom Wilson', gem: 'Sapphire Earrings', bid: '$15,800', time: '18 min ago', type: 'leading' },
              { user: 'Emma Brown', gem: 'Diamond Ring', bid: '$44,500', time: '25 min ago', type: 'outbid' },
            ].map((bid, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  bid.type === 'new' ? 'bg-green-100 text-green-600' :
                  bid.type === 'leading' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {bid.type === 'new' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : bid.type === 'leading' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{bid.user}</p>
                  <p className="text-xs text-gray-500">
                    Bid <span className="font-bold text-emerald-600">{bid.bid}</span> on {bid.gem}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{bid.time}</p>
                </div>
                {bid.type === 'leading' && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Leading
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions with Custom Icons */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { 
              label: 'Review Gems', 
              color: 'from-orange-500 to-red-500', 
              badge: '12',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              )
            },
            { 
              label: 'Manage Users', 
              color: 'from-blue-500 to-cyan-500',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              )
            },
            { 
              label: 'View Reports', 
              color: 'from-purple-500 to-pink-500',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              )
            },
            { 
              label: 'Transactions', 
              color: 'from-green-500 to-emerald-500',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              )
            },
            { 
              label: 'Settings', 
              color: 'from-gray-500 to-gray-600',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              )
            },
            { 
              label: 'Analytics', 
              color: 'from-teal-500 to-emerald-500',
              icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              )
            },
          ].map((action, idx) => (
            <button
              key={idx}
              className={`group relative p-6 bg-gradient-to-br ${action.color} hover:scale-105 rounded-2xl transition-all duration-300 transform hover:shadow-xl text-white`}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {action.badge}
                </span>
              )}
              <div className="flex flex-col items-center space-y-3">
                <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {action.icon}
                </div>
                <span className="text-sm font-semibold text-center">
                  {action.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section - Analytics & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Auction Success Rate */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Auction Success Rate</h3>
          <div className="space-y-4">
            {[
              { category: 'Diamonds', rate: 92, count: 45 },
              { category: 'Emeralds', rate: 88, count: 32 },
              { category: 'Rubies', rate: 85, count: 28 },
              { category: 'Sapphires', rate: 90, count: 38 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <span className="font-bold text-emerald-600">{item.rate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.count} auctions completed</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Sellers</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', sales: 23, revenue: '$245K', rank: 1 },
              { name: 'Jane Smith', sales: 19, revenue: '$198K', rank: 2 },
              { name: 'Bob Wilson', sales: 15, revenue: '$156K', rank: 3 },
              { name: 'Alice Brown', sales: 12, revenue: '$134K', rank: 4 },
            ].map((seller, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    seller.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    seller.rank === 2 ? 'bg-gray-100 text-gray-700' :
                    seller.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {seller.rank}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{seller.name}</p>
                    <p className="text-xs text-gray-500">{seller.sales} sales</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">{seller.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Buyers */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Buyers</h3>
          <div className="space-y-3">
            {[
              { name: 'Emma Davis', purchases: 18, spent: '$312K', rank: 1 },
              { name: 'Michael Lee', purchases: 14, spent: '$267K', rank: 2 },
              { name: 'Sarah Johnson', purchases: 11, spent: '$198K', rank: 3 },
              { name: 'Tom Anderson', purchases: 9, spent: '$145K', rank: 4 },
            ].map((buyer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    buyer.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    buyer.rank === 2 ? 'bg-gray-100 text-gray-700' :
                    buyer.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {buyer.rank}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{buyer.name}</p>
                    <p className="text-xs text-gray-500">{buyer.purchases} purchases</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-blue-600">{buyer.spent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}