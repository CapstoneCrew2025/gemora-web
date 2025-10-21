import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { role, user } = useAuth();

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-green-100">
          Here's what's happening with your store today.
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
                  {stat.change} from last month
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

     

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
            <span className="text-2xl block mb-2">➕</span>
            <span className="text-sm font-medium text-gray-700">
              Add Product
            </span>
          </button>
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
            <span className="text-2xl block mb-2">👥</span>
            <span className="text-sm font-medium text-gray-700">
              Manage Users
            </span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">
              View Reports
            </span>
          </button>
          <button className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-center">
            <span className="text-2xl block mb-2">⚙️</span>
            <span className="text-sm font-medium text-gray-700">
              Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}