import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Main content will go here */}
          <div className="container mx-auto">
            <h1 className="text-3xl font-semibold text-green-800 mb-6">Dashboard</h1>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;