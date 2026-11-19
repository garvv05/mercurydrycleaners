import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedAdmin = localStorage.getItem('admin');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        if (storedAdmin) {
          try {
            setAdmin(JSON.parse(storedAdmin));
          } catch (e) {
            localStorage.removeItem('admin');
          }
        } else if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.removeItem('admin');
      setToken(res.data.token);
      setUser(res.data.user);
      setAdmin(null);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const registerUser = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.removeItem('admin');
      setToken(res.data.token);
      setUser(res.data.user);
      setAdmin(null);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const loginAdmin = async (email, password) => {
    const res = await api.post('/auth/admin/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      localStorage.removeItem('user');
      setToken(res.data.token);
      setAdmin(res.data.admin);
      setUser(null);
      return res.data;
    }
    throw new Error(res.data.message || 'Admin login failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setToken(null);
    setUser(null);
    setAdmin(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin: !!token && !!admin,
      loginUser,
      registerUser,
      loginAdmin,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
