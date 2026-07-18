'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '@/types';
import api from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  loginWithGoogle: (googleData: { name: string; email: string; avatar?: string; googleId: string }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Hydrate from localStorage on mount ────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('zyvora_token');
    const savedUser  = localStorage.getItem('zyvora_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('zyvora_token');
        localStorage.removeItem('zyvora_user');
      }
    }
    setIsLoading(false);
  }, []);

  const persistSession = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('zyvora_token', newToken);
    localStorage.setItem('zyvora_user', JSON.stringify(newUser));
  };

  // ── Login ──────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    persistSession(data.token, data.user);
  }, []);

  // ── Register ───────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string, role = 'learner') => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, role });
    persistSession(data.token, data.user);
  }, []);

  // ── Google Auth ────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async (googleData: { name: string; email: string; avatar?: string; googleId: string }) => {
    const { data } = await api.post<AuthResponse>('/auth/google', googleData);
    persistSession(data.token, data.user);
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('zyvora_token');
    localStorage.removeItem('zyvora_user');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('zyvora_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
