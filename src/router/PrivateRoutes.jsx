import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayouts';
import UserLayout from '../layouts/UserLayout';

// Pages - Dashboard
import Dashboard from '../pages/Dashboard/Dashboard';

// Pages - Users
import UserList from '../pages/Users/UserList';

const PrivateRoutes = () => {
  // TODO: Add authentication check here
  // const { isAuthenticated, userRole } = useAuth();
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <Routes>
      {/* ==================== ADMIN ROUTES ==================== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
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
        <Route path="dashboard" element={<Dashboard />} />
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

      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default PrivateRoutes;
