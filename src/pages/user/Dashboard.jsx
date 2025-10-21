import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "My Orders",
      value: "12",
      change: "+2 this month",
      icon: "📦",
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Spent",
      value: "$2,450",
      change: "+$320 this month",
      icon: "💰",
      bgColor: "bg-green-500",
    },
    {
      title: "Wishlist",
      value: "8",
      change: "+3 this week",
      icon: "❤️",
      bgColor: "bg-pink-500",
    },
    {
      title: "Rewards Points",
      value: "1,240",
      change: "+120 this month",
      icon: "⭐",
      bgColor: "bg-purple-500",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      orderNumber: "ORD-1001",
      product: "Emerald Ring",
      price: "$450",
      status: "Delivered",
      date: "Oct 15, 2025",
    },
    {
      id: 2,
      orderNumber: "ORD-1002",
      product: "Diamond Necklace",
      price: "$890",
      status: "In Transit",
      date: "Oct 18, 2025",
    },
    {
      id: 3,
      orderNumber: "ORD-1003",
      product: "Gold Bracelet",
      price: "$320",
      status: "Processing",
      date: "Oct 20, 2025",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-green-100">
          Discover our latest jewelry collections and exclusive offers.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-green-500 text-sm font-medium mt-2">
                  {stat.change}
                </p>
              </div>
              <div
                className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    💎
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{order.product}</p>
                    <p className="text-sm text-gray-500">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 mb-1">{order.price}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "In Transit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
              <span>🛍️</span>
              <span className="font-medium">Browse Shop</span>
            </button>
            <button className="w-full p-3 bg-white border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2">
              <span>📦</span>
              <span className="font-medium">Track Orders</span>
            </button>
            <button className="w-full p-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <span>❤️</span>
              <span className="font-medium">My Wishlist</span>
            </button>
            <button className="w-full p-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <span>👤</span>
              <span className="font-medium">My Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sapphire Ring", price: "$680", rating: "4.8" },
            { name: "Pearl Earrings", price: "$340", rating: "4.9" },
            { name: "Platinum Band", price: "$520", rating: "4.7" },
          ].map((product, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="w-full h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-5xl">💍</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold">{product.price}</span>
                <span className="text-sm text-gray-500">⭐ {product.rating}</span>
              </div>
              <button className="w-full mt-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}