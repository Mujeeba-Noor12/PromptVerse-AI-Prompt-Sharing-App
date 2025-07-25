import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getUser } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const queryClient = useQueryClient();

  // Fetch user data if token exists
  const { data: user, isLoading, error } = useQuery(
    ['user'],
    getUser,
    {
      enabled: !!token,
      retry: false,
      onError: () => {
        // Clear invalid token
        logout();
      },
    }
  );

  const login = (userData, authToken) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    queryClient.setQueryData(['user'], userData);
    toast.success('Login successful!');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    queryClient.setQueryData(['user'], userData);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 