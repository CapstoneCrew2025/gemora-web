import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../service/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = authService.getToken();
    const userRole = authService.getRole();

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
      setUser({ role: userRole });
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      setIsAuthenticated(true);
      setRole(response.role);
      setUser({ role: response.role });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    login,
    logout,
    isAdmin: () => role === 'ADMIN',
    isUser: () => role === 'USER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;