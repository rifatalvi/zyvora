'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, avatar?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setUser({
        _id:       u.id,
        email:     u.email,
        name:      u.name,
        // inferAdditionalFields now makes these available directly on u
        role:      u.role   || 'learner',
        avatar:    u.avatar || u.image || '',
        createdAt: u.createdAt?.toString() || new Date().toISOString(),
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw new Error(error.message || 'Login failed');
  };

  const register = async (name: string, email: string, password: string, role: string, avatar?: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: avatar || '',  // better-auth default `image` field
      role,                 // custom additional field
      avatar: avatar || '', // custom additional field fallback
    } as any);
    if (error) throw new Error(error.message || 'Registration failed');
  };

  const logout = async () => {
    const { error } = await authClient.signOut();
    if (error) throw new Error(error.message || 'Logout failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session?.user,
        isLoading: isPending,
        login,
        register,
        logout,
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
