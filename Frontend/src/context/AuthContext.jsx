import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (userData, userRole) => {
    const completeUserData = {
      id: Date.now(),
      ...userData,
      loginTime: new Date().toISOString()
    };
    
    setUser(completeUserData);
    setRole(userRole);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(completeUserData));
    localStorage.setItem('userRole', userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    role,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!role
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
