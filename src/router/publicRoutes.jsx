import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div className="text-2xl font-bold">Register Page - Coming Soon</div>} />
      
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
