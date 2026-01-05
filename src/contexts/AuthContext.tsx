'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, userApi, apiClient } from '@/lib/api';
import type { AuthState, User, TelegramWebApp } from '@/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  canRegister: boolean;
  telegram: TelegramWebApp | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  sessionId: null,
  isTelegram: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const [canRegister, setCanRegister] = useState(true);
  const [telegram, setTelegram] = useState<TelegramWebApp | null>(null);

  // Check if running inside Telegram WebApp
  const checkTelegram = useCallback((): TelegramWebApp | null => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (tg.initData && tg.initData.length > 0) {
        return tg;
      }
    }
    return null;
  }, []);

  // Initialize auth
  useEffect(() => {
    const init = async () => {
      const tg = checkTelegram();
      
      if (tg) {
        // Telegram WebApp mode
        setTelegram(tg);
        tg.ready();
        tg.expand();
        
        try {
          // Auth via Telegram
          const authResponse = await authApi.telegramAuth(tg.initData);
          const sessionId = authResponse.session_id!;
          apiClient.setSessionId(sessionId);
          
          // Get user profile
          const user = await userApi.getProfile();
          
          setState({
            isAuthenticated: true,
            isLoading: false,
            user,
            sessionId,
            isTelegram: true,
            error: null,
          });
        } catch (error) {
          console.error('Telegram auth error:', error);
          setState({
            ...initialState,
            isLoading: false,
            isTelegram: true,
            error: 'Ошибка авторизации через Telegram',
          });
        }
      } else {
        // Web mode - check existing session
        const existingSession = apiClient.getSessionId();
        
        if (existingSession) {
          try {
            const user = await userApi.getProfile();
            setState({
              isAuthenticated: true,
              isLoading: false,
              user,
              sessionId: existingSession,
              isTelegram: false,
              error: null,
            });
          } catch {
            // Session expired or invalid
            apiClient.setSessionId(null);
            setState({
              ...initialState,
              isLoading: false,
            });
          }
        } else {
          setState({
            ...initialState,
            isLoading: false,
          });
        }
        
        // Check if registration is available
        try {
          const canReg = await authApi.canRegister();
          setCanRegister(canReg);
        } catch {
          setCanRegister(false);
        }
      }
    };

    init();
  }, [checkTelegram]);

  const login = useCallback(async (username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const authResponse = await authApi.login(username, password);
      const sessionId = authResponse.id!;
      apiClient.setSessionId(sessionId);
      
      const user = await userApi.getProfile();
      
      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        sessionId,
        isTelegram: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка авторизации',
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    if (!canRegister) {
      throw new Error('Регистрация отключена');
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await userApi.register(username, password);
      // After registration, login
      await login(username, password);
      
      setState(prev => ({
        ...prev,
        user,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Ошибка регистрации',
      }));
      throw error;
    }
  }, [canRegister, login]);

  const logout = useCallback(() => {
    apiClient.setSessionId(null);
    setState({
      ...initialState,
      isLoading: false,
      isTelegram: state.isTelegram,
    });
  }, [state.isTelegram]);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const user = await userApi.getProfile();
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
        canRegister,
        telegram,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
