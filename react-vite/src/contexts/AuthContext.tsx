import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AuthContextType, AuthState, GitHubUser } from '../types/auth';
import { GitHubAuthService } from '../services/githubAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const githubAuth = GitHubAuthService.getInstance();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if GitHub auth service is properly configured
      if (!githubAuth.getLoginUrl()) {
        throw new Error('GitHub OAuth not configured');
      }

      if (githubAuth.isAuthenticated()) {
        const user = await githubAuth.getUserInfo();
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
      });
    }
  };

  const login = () => {
    const loginUrl = githubAuth.getLoginUrl();
    if (!loginUrl) {
      setAuthState(prev => ({
        ...prev,
        error: 'GitHub OAuth not configured. Please check environment variables.',
      }));
      return;
    }
    window.location.href = loginUrl;
  };

  const logout = () => {
    githubAuth.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const handleOAuthCallback = useCallback(async (code: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await githubAuth.exchangeCodeForToken(code);
      const user = await githubAuth.getUserInfo();
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Authentication failed. Please try again.',
      }));
    }
  }, [githubAuth]);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    handleOAuthCallback,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
