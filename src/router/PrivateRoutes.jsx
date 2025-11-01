import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import AdminLayout from '../layouts/AdminLayouts';
import UserLayout from '../layouts/UserLayout';

// Pages
import AdminDashboard from '../pages/admin/Dashboard';
import UserDashboard from '../pages/user/Dashboard';
import UserManage from '../pages/admin/UserManage';
import GemManage from '../pages/admin/GemManage';

const PrivateRoutes = () => {
  const { role } = useAuth();

  // Redirect to appropriate dashboard based on role
  const defaultRedirect = role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <Routes>
      {/* ==================== ADMIN ROUTES ==================== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route 
          path="users" 
          element={<UserManage />} 
        />
        <Route 
          path="gems" 
          element={<GemManage />} 
        />
        <Route 
          path="products" 
          element={<div className="text-2xl font-bold">Products Page</div>} 
        />
        <Route 
          path="orders" 
          element={<div className="text-2xl font-bold">Orders Page</div>} 
        />
        <Route 
          path="analytics" 
          element={<div className="text-2xl font-bold">Analytics Page</div>} 
        />
        <Route 
          path="reports" 
          element={<div className="text-2xl font-bold">Reports Page</div>} 
        />
        <Route 
          path="settings" 
          element={<div className="text-2xl font-bold">Settings Page</div>} 
        />
      </Route>

      {/* ==================== USER ROUTES ==================== */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route 
          path="my-orders" 
          element={<div className="text-2xl font-bold">My Orders Page</div>} 
        />
        <Route 
          path="shop" 
          element={<div className="text-2xl font-bold">Shop Page</div>} 
        />
        <Route 
          path="wishlist" 
          element={<div className="text-2xl font-bold">Wishlist Page</div>} 
        />
        <Route 
          path="profile" 
          element={<div className="text-2xl font-bold">Profile Page</div>} 
        />
        <Route 
          path="settings" 
          element={<div className="text-2xl font-bold">Settings Page</div>} 
        />
      </Route>

      {/* Default redirect based on role */}
      <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
    </Routes>
  );
};

export default PrivateRoutes;
