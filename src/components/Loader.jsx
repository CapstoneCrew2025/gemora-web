const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
          {/* Spinning Ring - Double Border for Enhanced Effect */}
          <div className="absolute inset-0 border-4 border-transparent border-t-green-600 border-r-green-500 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
          {message}
        </p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
