'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, tokenStorage } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { FrontendRole, UserProfile, AuthResponseData } from '@/types/api';

export type UserRole = FrontendRole;
export type { UserProfile } from '@/types/api';

interface SignupParams {
  email: string;
  password?: string;
  role: UserRole;
  name: string;
  city?: string;
  phone?: string;
  businessName?: string;
  categoryId?: string;
  startingPrice?: number;
}

interface LoginParams {
  email: string;
  password?: string;
  role?: UserRole;
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (emailOrParams: string | LoginParams, passwordOrRole?: string | UserRole, optionalRole?: UserRole, name?: string) => Promise<UserProfile>;
  signup: (emailOrParams: string | SignupParams, passwordOrRole?: string | UserRole, roleOrName?: UserRole | string, nameOrExtra?: string | any) => Promise<UserProfile>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  setUserSession: (profile: UserProfile, token?: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<UserProfile>;
  completeOnboarding: (data?: any) => void;
  approveSupplier: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'LEEMEVENTS_user_session';

// Helper to normalize backend role ('consumer' / 'supplier' / 'admin') to frontend role ('host' / 'supplier' / 'admin')
function normalizeRole(role?: string): FrontendRole {
  if (!role) return 'host';
  const r = role.toLowerCase();
  if (r === 'consumer' || r === 'host') return 'host';
  if (r === 'supplier') return 'supplier';
  if (r === 'admin') return 'admin';
  return 'host';
}

function toBackendRole(role: FrontendRole): 'consumer' | 'supplier' | 'admin' {
  if (role === 'host') return 'consumer';
  return role;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveUserLocal = useCallback((userProfile: UserProfile | null) => {
    setUser(userProfile);
    if (typeof window !== 'undefined') {
      if (userProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Initialize and verify session on load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenStorage.get();
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

        let existingLocal: Partial<UserProfile> = {};
        if (storedUser) {
          try {
            existingLocal = JSON.parse(storedUser);
            setUser(existingLocal as UserProfile);
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // If we have a JWT token, verify with backend /api/auth/me
        if (token) {
          try {
            const res = await api.get<{ user: any }>('/auth/me');
            const u = res.data?.user || (res as any)?.user;
            if (u) {
              const mappedUser: UserProfile = {
                id: u.id || u.auth_user_id || existingLocal.id || '',
                name: existingLocal.name || u.full_name || u.name || 'Valued Member',
                email: existingLocal.email || u.email || '',
                role: normalizeRole(u.role || existingLocal.role),
                city: existingLocal.city || u.city,
                phone: existingLocal.phone || u.phone,
                avatar: existingLocal.avatar || u.avatar_url,
                onboarded: u.onboarded ?? existingLocal.onboarded ?? true,
                supplierApproved:
                  u.verification_status === 'verified' ||
                  u.role === 'consumer' ||
                  u.role === 'host' ||
                  existingLocal.supplierApproved ||
                  false,
                businessName: u.business_name || existingLocal.businessName,
              };
              saveUserLocal(mappedUser);
            }
          } catch (apiErr: any) {
            // If token is invalid or unauthorized, clear session
            if (apiErr.status === 401 || apiErr.status === 403) {
              tokenStorage.clear();
              saveUserLocal(null);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load user session', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [saveUserLocal]);

  const clearError = () => setError(null);

  // REAL STRICT BACKEND LOGIN
  const login = async (
    emailOrParams: string | LoginParams,
    passwordOrRole?: string | UserRole,
    optionalRole?: UserRole,
    name = 'Valued Member'
  ): Promise<UserProfile> => {
    setError(null);

    let email = '';
    let password = '';
    let role: UserRole = 'host';
    let displayName = name;

    if (typeof emailOrParams === 'object') {
      email = emailOrParams.email;
      password = emailOrParams.password || '';
      role = emailOrParams.role || 'host';
      displayName = emailOrParams.name || displayName;
    } else {
      email = emailOrParams;
      if (typeof passwordOrRole === 'string' && passwordOrRole.length > 0 && !['host', 'supplier', 'admin'].includes(passwordOrRole)) {
        password = passwordOrRole;
        role = optionalRole || 'host';
      } else {
        role = (passwordOrRole as UserRole) || 'host';
      }
    }

    if (!email || !password) {
      const err = new Error('Please provide both email and password.');
      setError(err.message);
      throw err;
    }

    try {
      // 1. Send real login request to Backend
      const res: any = await api.post<AuthResponseData>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const token = res.data?.token || res.token;
      if (token) {
        tokenStorage.set(token);
      }

      const backendUser = res.data?.user || res.user;
      const userRole = normalizeRole(res.data?.role || backendUser?.role || res.role || role);

      const profile: UserProfile = {
        id: backendUser?.id || backendUser?.auth_user_id || '',
        name: backendUser?.full_name || backendUser?.name || displayName || email.split('@')[0],
        email: backendUser?.email || email,
        role: userRole,
        city: backendUser?.city,
        onboarded: true,
        supplierApproved: userRole === 'supplier' ? backendUser?.verification_status === 'verified' : true,
        businessName: backendUser?.business_name,
      };

      saveUserLocal(profile);
      return profile;
    } catch (err: any) {
      const errorMsg = err.message || 'Invalid email or password. Please check your credentials.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // REAL STRICT BACKEND SIGNUP
  const signup = async (
    emailOrParams: string | SignupParams,
    passwordOrRole?: string | UserRole,
    roleOrName?: UserRole | string,
    nameOrExtra?: string | any
  ): Promise<UserProfile> => {
    setError(null);

    let email = '';
    let password = '';
    let role: UserRole = 'host';
    let name = 'Event Organizer';
    let city = 'Den Haag';
    let businessName: string | undefined;
    let startingPrice: number | undefined;

    if (typeof emailOrParams === 'object') {
      email = emailOrParams.email;
      password = emailOrParams.password || '';
      role = emailOrParams.role || 'host';
      name = emailOrParams.name || name;
      city = emailOrParams.city || city;
      businessName = emailOrParams.businessName;
      startingPrice = emailOrParams.startingPrice;
    } else {
      email = emailOrParams;
      if (typeof passwordOrRole === 'string' && ['host', 'supplier', 'admin'].includes(passwordOrRole)) {
        role = passwordOrRole as UserRole;
        name = (roleOrName as string) || name;
      } else if (typeof passwordOrRole === 'string') {
        password = passwordOrRole;
        role = (roleOrName as UserRole) || 'host';
        name = (typeof nameOrExtra === 'string' ? nameOrExtra : nameOrExtra?.name) || name;
      }
    }

    if (!email || !password) {
      const err = new Error('Please fill all required fields.');
      setError(err.message);
      throw err;
    }

    try {
      // 1. Send real signup request to Backend
      const backendPayload: any = {
        email: email.trim().toLowerCase(),
        password,
        full_name: name,
        role: toBackendRole(role),
        city,
      };

      if (role === 'supplier') {
        backendPayload.business_name = businessName || name;
        backendPayload.starting_price = startingPrice || 500;
      }

      const res: any = await api.post<AuthResponseData>('/auth/signup', backendPayload);

      const token = res.data?.token || res.token;
      if (token) {
        tokenStorage.set(token);
      }

      const backendUser = res.data?.user || res.user;
      const userRole = normalizeRole(res.data?.role || backendUser?.role || res.role || role);

      const profile: UserProfile = {
        id: backendUser?.id || backendUser?.auth_user_id || '',
        name: backendUser?.full_name || backendUser?.name || name,
        email: backendUser?.email || email,
        role: userRole,
        city: backendUser?.city || city,
        onboarded: false,
        supplierApproved: userRole === 'supplier' ? false : true,
        businessName: businessName || (userRole === 'supplier' ? name : undefined),
      };

      saveUserLocal(profile);
      return profile;
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed. Email might already be registered.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // GOOGLE OAUTH FLOW
  const loginWithGoogle = async (role: UserRole = 'host') => {
    setError(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('LEEMEVENTS_oauth_role', role);
      }

      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google OAuth initialization error:', err);
      const msg = err.message || 'Failed to initialize Google login. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const setUserSession = useCallback((userProfile: UserProfile, token?: string) => {
    if (token) {
      tokenStorage.set(token);
    }
    saveUserLocal(userProfile);
  }, [saveUserLocal]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      tokenStorage.clear();
      saveUserLocal(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('LEEMEVENTS_local_events');
        localStorage.removeItem('LEEMEVENTS_local_contracts');
        localStorage.removeItem('LEEMEVENTS_local_payments');
        localStorage.removeItem('LEEMEVENTS_oauth_role');
      }
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) {
      throw new Error('No user logged in.');
    }
    const updated: UserProfile = {
      ...user,
      ...updatedData,
    };
    saveUserLocal(updated);

    try {
      const res = await api.patch('/auth/profile', updatedData);
      if (res.data) {
        const p = res.data;
        const fullyUpdated: UserProfile = {
          ...updated,
          name: p.full_name || updated.name,
          city: p.city || updated.city,
          phone: p.phone || updated.phone,
          avatar: p.avatar_url || updated.avatar,
          businessName: p.business_name || updated.businessName,
        };
        saveUserLocal(fullyUpdated);
        return fullyUpdated;
      }
    } catch (e) {
      console.warn('Backend profile update note:', e);
    }

    return updated;
  };

  const completeOnboarding = (additionalData?: any) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      onboarded: true,
      ...additionalData,
    };
    saveUserLocal(updated);
  };

  const approveSupplier = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      supplierApproved: true,
    };
    saveUserLocal(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        loginWithGoogle,
        setUserSession,
        logout,
        updateProfile,
        completeOnboarding,
        approveSupplier,
        clearError,
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
