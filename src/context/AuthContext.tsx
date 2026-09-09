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
  isSuspended: boolean;
  suspensionReason?: string;
  error: string | null;
  login: (emailOrParams: string | LoginParams, passwordOrRole?: string | UserRole, optionalRole?: UserRole, name?: string) => Promise<UserProfile>;
  signup: (emailOrParams: string | SignupParams, passwordOrRole?: string | UserRole, roleOrName?: UserRole | string, nameOrExtra?: string | any) => Promise<UserProfile>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  setUserSession: (profile: UserProfile, token?: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<UserProfile>;
  completeOnboarding: (data?: any) => void;
  approveSupplier: () => void;
  checkSuspension: () => Promise<UserProfile | null>;
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
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState<string | undefined>(undefined);
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

  // Real-time check if user is suspended or approved in backend
  const checkSuspension = useCallback(async (): Promise<UserProfile | null> => {
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    let localUser: Partial<UserProfile> | null = null;
    try {
      if (storedUserStr) localUser = JSON.parse(storedUserStr);
    } catch {}

    const currentUser = user || (localUser as UserProfile | null);
    const userRole = normalizeRole(currentUser?.role);

    try {
      // 1. If user is a supplier, prioritize live supplier profile lookup
      if (userRole === 'supplier') {
        try {
          const suppRes = await api.get('/suppliers/me/profile');
          const suppData = suppRes.data?.data || suppRes.data || suppRes;
          if (suppData && suppData.id) {
            const verificationStatus = suppData.verification_status || 'pending';
            const isApproved = verificationStatus === 'verified';
            const isUserSuspended =
              suppData.profile?.is_active === false ||
              suppData.is_active === false ||
              verificationStatus === 'suspended';

            setIsSuspended(isUserSuspended);
            setSuspensionReason(
              suppData.verification_notes ||
              (isUserSuspended ? 'Account suspended by administrator' : undefined)
            );

            const updatedProfile: UserProfile = {
              id: suppData.id || suppData.profile?.id || currentUser?.id || '',
              name: suppData.profile?.full_name || suppData.business_name || currentUser?.name || 'Valued Partner',
              email: suppData.profile?.email || currentUser?.email || '',
              role: 'supplier',
              city: suppData.city || currentUser?.city,
              phone: suppData.profile?.phone || currentUser?.phone,
              avatar: suppData.profile?.avatar_url || currentUser?.avatar,
              onboarded: true,
              supplierApproved: isApproved,
              businessName: suppData.business_name || currentUser?.businessName,
              is_active: !isUserSuspended,
              isActive: !isUserSuspended,
              isSuspended: isUserSuspended,
              verification_status: verificationStatus,
              suspensionReason: suppData.verification_notes || undefined,
            };

            saveUserLocal(updatedProfile);
            return updatedProfile;
          }
        } catch (suppErr: any) {
          if (suppErr?.message?.toLowerCase().includes('suspended') || suppErr?.status === 403) {
            setIsSuspended(true);
            return null;
          }
        }
      }

      // 2. Query /auth/me for user status
      const res = await api.get<{ user: any }>('/auth/me');
      const u = res.data?.user || (res as any)?.user;
      if (u) {
        const mappedRole = normalizeRole(u.role || currentUser?.role);
        let verificationStatus = u.verification_status || currentUser?.verification_status;
        let businessName = u.business_name || currentUser?.businessName;
        let verificationNotes = u.verification_notes;

        if (mappedRole === 'supplier') {
          try {
            const suppRes = await api.get('/suppliers/me/profile');
            const suppData = suppRes.data?.data || suppRes.data || suppRes;
            if (suppData && suppData.verification_status) {
              verificationStatus = suppData.verification_status;
              businessName = suppData.business_name || businessName;
              verificationNotes = suppData.verification_notes || verificationNotes;
            }
          } catch {}
        }

        const isUserSuspended =
          u.is_active === false ||
          u.isActive === false ||
          verificationStatus === 'suspended';

        const isApproved =
          mappedRole === 'supplier'
            ? verificationStatus === 'verified'
            : true;

        setIsSuspended(isUserSuspended);
        setSuspensionReason(verificationNotes || u.suspension_reason || (isUserSuspended ? 'Account suspended by administrator' : undefined));

        const cachedAvatar = typeof window !== 'undefined'
          ? (localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${u.id || currentUser?.id}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current'))
          : null;
        const finalAvatar = u.avatar_url || currentUser?.avatar || cachedAvatar || undefined;

        const updatedProfile: UserProfile = {
          id: u.id || u.auth_user_id || currentUser?.id || '',
          name: u.full_name || u.name || currentUser?.name || 'Valued Member',
          email: u.email || currentUser?.email || '',
          role: mappedRole,
          city: u.city || currentUser?.city,
          phone: u.phone || currentUser?.phone,
          avatar: finalAvatar,
          onboarded: u.onboarded ?? currentUser?.onboarded ?? true,
          supplierApproved: isApproved,
          businessName: businessName || currentUser?.businessName,
          is_active: u.is_active ?? true,
          isActive: u.is_active ?? true,
          isSuspended: isUserSuspended,
          verification_status: verificationStatus,
          suspensionReason: verificationNotes,
        };

        saveUserLocal(updatedProfile);
        return updatedProfile;
      }
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('suspended') || err?.status === 403) {
        setIsSuspended(true);
      }
    }
    return currentUser || null;
  }, [user, saveUserLocal]);

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
            const cachedAvatar = typeof window !== 'undefined'
              ? (localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${existingLocal.id}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current'))
              : null;
            if (cachedAvatar && !existingLocal.avatar) {
              existingLocal.avatar = cachedAvatar;
            }
            setUser(existingLocal as UserProfile);
            if (existingLocal.isSuspended || existingLocal.is_active === false) {
              setIsSuspended(true);
            }
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // Real-time sync for suppliers
        if (existingLocal.role === 'supplier' || token) {
          try {
            if (existingLocal.role === 'supplier') {
              try {
                const suppRes = await api.get('/suppliers/me/profile');
                const suppData = suppRes.data?.data || suppRes.data || suppRes;
                if (suppData && suppData.verification_status) {
                  const isApproved = suppData.verification_status === 'verified';
                  const isBlocked = suppData.profile?.is_active === false || suppData.verification_status === 'suspended';

                  const cachedAvatar = typeof window !== 'undefined'
                    ? (localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${suppData.id || existingLocal.id}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current'))
                    : null;
                  const finalAvatar = suppData.profile?.avatar_url || existingLocal.avatar || cachedAvatar || undefined;

                  setIsSuspended(isBlocked);
                  const mappedUser: UserProfile = {
                    id: suppData.id || existingLocal.id || '',
                    name: suppData.profile?.full_name || suppData.business_name || existingLocal.name || 'Valued Member',
                    email: suppData.profile?.email || existingLocal.email || '',
                    role: 'supplier',
                    city: suppData.city || existingLocal.city,
                    phone: suppData.profile?.phone || existingLocal.phone,
                    avatar: finalAvatar,
                    onboarded: true,
                    supplierApproved: isApproved,
                    businessName: suppData.business_name || existingLocal.businessName,
                    is_active: !isBlocked,
                    isActive: !isBlocked,
                    isSuspended: isBlocked,
                    verification_status: suppData.verification_status,
                    suspensionReason: suppData.verification_notes || undefined,
                  };
                  saveUserLocal(mappedUser);
                  return;
                }
              } catch {}
            }

            if (token) {
              const res = await api.get<{ user: any }>('/auth/me');
              const u = res.data?.user || (res as any)?.user;
              if (u) {
                const userRole = normalizeRole(u.role || existingLocal.role);
                let verificationStatus = u.verification_status || existingLocal.verification_status;
                let businessName = u.business_name || existingLocal.businessName;
                let verificationNotes = u.verification_notes || existingLocal.suspensionReason;

                if (userRole === 'supplier') {
                  try {
                    const suppRes = await api.get('/suppliers/me/profile');
                    const suppData = suppRes.data?.data || suppRes.data || suppRes;
                    if (suppData && suppData.verification_status) {
                      verificationStatus = suppData.verification_status;
                      businessName = suppData.business_name || businessName;
                      verificationNotes = suppData.verification_notes || verificationNotes;
                    }
                  } catch {}
                }

                const userIsBlocked =
                  u.is_active === false ||
                  u.isActive === false ||
                  verificationStatus === 'suspended';

                const isApproved =
                  userRole === 'supplier'
                    ? verificationStatus === 'verified'
                    : true;

                if (userIsBlocked) {
                  setIsSuspended(true);
                  setSuspensionReason(verificationNotes || 'Account suspended by administrator');
                } else {
                  setIsSuspended(false);
                }

                const cachedAvatar = typeof window !== 'undefined'
                  ? (localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${u.id || existingLocal.id}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current'))
                  : null;
                const finalAvatar = existingLocal.avatar || cachedAvatar || u.avatar_url || undefined;

                const mappedUser: UserProfile = {
                  id: u.id || u.auth_user_id || existingLocal.id || '',
                  name: existingLocal.name || u.full_name || u.name || 'Valued Member',
                  email: existingLocal.email || u.email || '',
                  role: userRole,
                  city: existingLocal.city || u.city,
                  phone: existingLocal.phone || u.phone,
                  avatar: finalAvatar,
                  onboarded: u.onboarded ?? existingLocal.onboarded ?? true,
                  supplierApproved: isApproved,
                  businessName: businessName || existingLocal.businessName,
                  is_active: u.is_active ?? true,
                  isActive: u.is_active ?? true,
                  isSuspended: userIsBlocked,
                  verification_status: verificationStatus,
                  suspensionReason: verificationNotes,
                };
                saveUserLocal(mappedUser);
              }
            }
          } catch (apiErr: any) {
            if (apiErr.status === 401) {
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

  // Live polling for suspension check (every 5 seconds & on tab focus)
  useEffect(() => {
    if (!user || user.role === 'admin') return;

    // Check on tab focus
    const handleFocus = () => {
      checkSuspension();
    };
    window.addEventListener('focus', handleFocus);

    // Periodic check every 5 seconds
    const interval = setInterval(() => {
      checkSuspension();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [user, checkSuspension]);

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

      const backendUser = res.data?.user || res.user;

      // Check if user is suspended/blocked
      if (backendUser?.is_active === false || backendUser?.isActive === false) {
        tokenStorage.clear();
        saveUserLocal(null);
        const suspendedError = 'Your account has been suspended by the administrator. Please contact support at support@leemevent.com.';
        setError(suspendedError);
        throw new Error(suspendedError);
      }

      const token = res.data?.token || res.token;
      if (token) {
        tokenStorage.set(token);
      }

      const userRole = normalizeRole(res.data?.role || backendUser?.role || res.role || role);

      let verificationStatus = backendUser?.verification_status || (userRole === 'supplier' ? 'pending' : 'verified');
      let businessName = backendUser?.business_name;

      if (userRole === 'supplier') {
        try {
          const suppRes = await api.get('/suppliers/me/profile');
          const suppData = suppRes.data?.data || suppRes.data || suppRes;
          if (suppData && suppData.verification_status) {
            verificationStatus = suppData.verification_status;
            businessName = suppData.business_name || businessName;
          }
        } catch {
          // Fallback
        }
      }

      const isApproved = userRole === 'supplier' ? verificationStatus === 'verified' : true;

      const profile: UserProfile = {
        id: backendUser?.id || backendUser?.auth_user_id || '',
        name: backendUser?.full_name || backendUser?.name || displayName || email.split('@')[0],
        email: backendUser?.email || email,
        role: userRole,
        city: backendUser?.city,
        onboarded: true,
        supplierApproved: isApproved,
        businessName: businessName,
        is_active: backendUser?.is_active ?? true,
        isActive: backendUser?.is_active ?? true,
        isSuspended: verificationStatus === 'suspended' || backendUser?.is_active === false,
        verification_status: verificationStatus,
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
        verification_status: userRole === 'supplier' ? 'pending' : 'verified',
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

    if (typeof window !== 'undefined' && updatedData.avatar !== undefined) {
      if (updatedData.avatar) {
        try {
          localStorage.setItem(`LEEMEVENTS_USER_AVATAR_${user.id}`, updatedData.avatar);
          localStorage.setItem('LEEMEVENTS_USER_AVATAR_current', updatedData.avatar);
        } catch (storageErr) {
          console.warn('Avatar localStorage quota note:', storageErr);
        }
      } else {
        localStorage.removeItem(`LEEMEVENTS_USER_AVATAR_${user.id}`);
        localStorage.removeItem('LEEMEVENTS_USER_AVATAR_current');
      }
    }

    try {
      const res = await api.patch('/auth/profile', {
        ...updatedData,
        full_name: updatedData.name || user.name,
        avatar_url: updatedData.avatar !== undefined ? updatedData.avatar : user.avatar,
      });
      if (res.data) {
        const p = res.data;
        const fullyUpdated: UserProfile = {
          ...updated,
          name: p.full_name || updated.name,
          city: p.city || updated.city,
          phone: p.phone || updated.phone,
          avatar: updatedData.avatar || p.avatar_url || updated.avatar,
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
        isSuspended,
        suspensionReason,
        error,
        login,
        signup,
        loginWithGoogle,
        setUserSession,
        logout,
        updateProfile,
        completeOnboarding,
        approveSupplier,
        checkSuspension,
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
