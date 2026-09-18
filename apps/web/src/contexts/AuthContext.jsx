import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    
    // Subscribe to auth state changes from PocketBase
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setIsAuthenticated(!!model);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      return authData;
    } catch (error) {
      const errorMessage = error?.response?.message || 'Invalid email or password. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!currentUser) throw new Error("Not authenticated");
    
    try {
      const result = await pb.collection('admin_users').update(currentUser.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword
      }, { $autoCancel: false });
      
      setCurrentUser(result);
      return result;
    } catch (error) {
      const errorMessage = error?.response?.message || 'Failed to change password. Ensure your current password is correct.';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);