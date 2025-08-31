'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoginCredentials, SignupData, AuthState } from '@/types/auth';
import { login, signup, verifyToken, tokenStorage, logout as authLogout } from '@/lib/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenStorage.get();
        if (token) {
          const user = verifyToken(token);
          if (user) {
            setAuthState({
              user,
              token,
              isLoading: false,
              error: null
            });
            return;
          } else {
            // Invalid token, remove it
            tokenStorage.remove();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const loginUser = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        tokenStorage.set(token);
        
        setAuthState({
          user,
          token,
          isLoading: false,
          error: null
        });
        
        return { success: true, user };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error ? { message: response.error.message } : { message: 'Login failed' }
        }));
        
        return { success: false, error: response.error?.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: { message: errorMessage }
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const signupUser = useCallback(async (data: SignupData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await signup(data);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        tokenStorage.set(token);
        
        setAuthState({
          user,
          token,
          isLoading: false,
          error: null
        });
        
        return { success: true, user };
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error ? { message: response.error.message } : { message: 'Signup failed' }
        }));
        
        return { success: false, error: response.error?.message || 'Signup failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: { message: errorMessage }
      }));
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const logoutUser = useCallback(() => {
    authLogout();
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Helper methods
  const isAuthenticated = authState.user !== null && authState.token !== null;
  const isPassenger = authState.user?.role === 'passenger';
  const isDriver = authState.user?.role === 'driver';
  const isAdmin = authState.user?.role === 'admin';

  return {
    ...authState,
    login: loginUser,
    signup: signupUser,
    logout: logoutUser,
    clearError,
    isAuthenticated,
    isPassenger,
    isDriver,
    isAdmin
  };
}

// Custom hook for protected routes
export function useRequireAuth(requiredRole?: string) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login page
      window.location.href = '/auth/login';
    }

    if (requiredRole && auth.user && auth.user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardRoutes = {
        passenger: '/passenger/dashboard',
        driver: '/driver/dashboard',
        admin: '/admin/dashboard'
      };
      
      window.location.href = dashboardRoutes[auth.user.role as keyof typeof dashboardRoutes] || '/';
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, requiredRole]);

  return auth;
}