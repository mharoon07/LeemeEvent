'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { api, tokenStorage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUserSession } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const processAuth = async () => {
      try {
        // 1. Get Supabase session from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        let user = session?.user;

        // If not immediately available, listen for auth state change
        if (!user) {
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (newSession?.user && isMounted) {
              await handleSyncUser(newSession.user);
            }
          });

          // Wait a brief moment if needed
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData.session?.user && isMounted) {
              await handleSyncUser(retryData.session.user);
            } else if (isMounted) {
              setStatus('error');
              setErrorMessage('No authenticated Google session found. Please try again.');
            }
          }, 1500);

          return () => {
            authListener.subscription.unsubscribe();
          };
        } else {
          await handleSyncUser(user);
        }
      } catch (err: any) {
        console.error('OAuth Callback processing error:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'Authentication failed. Please try again.');
        }
      }
    };

    const handleSyncUser = async (authUser: any) => {
      try {
        const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('LEEMEVENTS_oauth_role') : null) || 'host';
        const backendRole = storedRole === 'supplier' ? 'supplier' : 'consumer';

        const fullName =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split('@')[0] ||
          'Valued Member';

        const avatarUrl =
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ||
          undefined;

        // 2. Sync with Backend /api/auth/oauth-sync to persist in Supabase profiles & get JWT
        const res: any = await api.post('/auth/oauth-sync', {
          auth_user_id: authUser.id,
          email: authUser.email,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: backendRole,
        });

        const token = res.data?.token || res.token;
        const profile = res.data?.user || res.user || {
          id: authUser.id,
          name: fullName,
          email: authUser.email,
          role: storedRole === 'supplier' ? 'supplier' : 'host',
          avatar: avatarUrl,
          onboarded: true,
          supplierApproved: storedRole === 'supplier' ? false : true,
        };

        if (token) {
          tokenStorage.set(token);
        }

        setUserSession(profile, token);

        if (isMounted) {
          setStatus('success');
          setTimeout(() => {
            if (profile.role === 'supplier') {
              router.replace('/dashboard/supplier');
            } else {
              router.replace('/dashboard/host');
            }
          }, 600);
        }
      } catch (syncErr: any) {
        console.error('OAuth backend sync error:', syncErr);
        // Fallback: create local session even if backend sync had network issue
        const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('LEEMEVENTS_oauth_role') : null) || 'host';
        const fallbackProfile = {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Valued Member',
          email: authUser.email,
          role: (storedRole === 'supplier' ? 'supplier' : 'host') as any,
          avatar: authUser.user_metadata?.avatar_url,
          onboarded: true,
          supplierApproved: storedRole === 'supplier' ? false : true,
        };

        setUserSession(fallbackProfile);

        if (isMounted) {
          setStatus('success');
          setTimeout(() => {
            router.replace(storedRole === 'supplier' ? '/dashboard/supplier' : '/dashboard/host');
          }, 600);
        }
      }
    };

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [router, setUserSession]);

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-200">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin text-taupe" />
            </div>
            <h2 className="text-xl font-bold text-charcoal">Authenticating with Google</h2>
            <p className="text-xs text-stone-500">
              Connecting your Google account with LEEMEVENT secure database...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-charcoal">Login Successful!</h2>
            <p className="text-xs text-stone-500">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-charcoal">Sign In Failed</h2>
            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {errorMessage || 'Unable to complete Google sign-in. Please try again.'}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary w-full py-2.5 text-xs font-bold"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
