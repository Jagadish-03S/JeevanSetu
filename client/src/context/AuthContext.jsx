import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [activeRole, setActiveRole] = useState('visitor');
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await authApi.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            setActiveRole(res.user.roles[0] || 'visitor');
          }
        } catch (e) {
          // Token expired or server offline
          setAuthToken(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setActiveRole(res.user.roles[0] || 'visitor');
      return res;
    }
    throw new Error(res.error || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setActiveRole(res.user.roles[0] || 'visitor');
      return res;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
    setActiveRole('visitor');
  };

  const switchRole = (role) => {
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      activeRole,
      loading,
      login,
      register,
      logout,
      switchRole,
      setActiveRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

