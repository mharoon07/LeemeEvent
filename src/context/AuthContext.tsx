'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'host' | 'supplier';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  onboarded: boolean;
  supplierApproved: boolean;
  avatar?: string;
  businessName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, role: UserRole, name?: string) => UserProfile;
  signup: (email: string, role: UserRole, name: string) => UserProfile;
  logout: () => void;
  completeOnboarding: (data?: any) => void;
  approveSupplier: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'LEEMEVENTS_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (userProfile: UserProfile | null) => {
    setUser(userProfile);
    if (userProfile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (email: string, role: UserRole, name = 'Valued Member') => {
    const existingSession = localStorage.getItem(STORAGE_KEY);
    let profile: UserProfile;

    if (existingSession) {
      const parsed = JSON.parse(existingSession);
      profile = {
        ...parsed,
        role: role || parsed.role,
      };
    } else {
      profile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: name || email.split('@')[0],
        email,
        role,
        onboarded: false,
        supplierApproved: role === 'supplier' ? false : true,
      };
    }

    saveUser(profile);
    return profile;
  };

  const signup = (email: string, role: UserRole, name: string) => {
    const profile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || 'Event Organizer',
      email,
      role,
      onboarded: false,
      supplierApproved: role === 'supplier' ? false : true,
    };

    saveUser(profile);
    return profile;
  };

  const logout = () => {
    saveUser(null);
  };

  const completeOnboarding = (additionalData?: any) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      onboarded: true,
      ...additionalData,
    };
    saveUser(updated);
  };

  const approveSupplier = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      supplierApproved: true,
    };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        completeOnboarding,
        approveSupplier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
