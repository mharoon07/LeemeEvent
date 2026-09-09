'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, Eye, EyeOff, Check, Compass, ArrowRight, UserPlus, LogIn, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signup',
}: AuthModalProps) {
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [userRole, setUserRole] = useState<'host' | 'supplier'>('host');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const newUser = await signup({
          email: formData.email,
          password: formData.password,
          role: userRole,
          name: formData.name || (userRole === 'host' ? 'Event Host' : 'Supplier Partner'),
        });
        onClose();
        if (newUser.role === 'supplier') {
          router.push('/dashboard/supplier');
        } else {
          router.push('/dashboard/host');
        }
      } else {
        const loggedUser = await login({
          email: formData.email,
          password: formData.password,
          role: userRole,
        });
        onClose();
        if (loggedUser.role === 'supplier') {
          router.push('/dashboard/supplier');
        } else if (loggedUser.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/host');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle(userRole);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect with Google.');
      setGoogleLoading(false);
    }
  };

  const resetAndClose = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-sand-50 border border-taupe/30 rounded-3xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-taupe/10 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Header Logo */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center mx-auto mb-3">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>
              <span className="text-2xl font-bold tracking-normal text-charcoal block">
                LEEMEVENTS
              </span>
              <p className="text-xs text-charcoal/70 mt-1 font-sans">
                {mode === 'signup'
                  ? 'Create your free account to start planning your event'
                  : 'Welcome back! Sign in to manage your bookings and requests'}
              </p>
            </div>

            {/* Sign In / Sign Up Mode Toggle */}
            <div className="flex bg-stone/70 p-1.5 rounded-2xl mb-6 border border-taupe/25 shadow-inner relative">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`relative flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                  mode === 'signup'
                    ? 'bg-charcoal text-sand shadow-md ring-1 ring-charcoal/20'
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-sand/40'
                }`}
              >
                <UserPlus className={`w-3.5 h-3.5 transition-colors ${mode === 'signup' ? 'text-taupe-200' : 'text-charcoal/40'}`} />
                <span>Create Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`relative flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                  mode === 'signin'
                    ? 'bg-charcoal text-sand shadow-md ring-1 ring-charcoal/20'
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-sand/40'
                }`}
              >
                <LogIn className={`w-3.5 h-3.5 transition-colors ${mode === 'signin' ? 'text-taupe-200' : 'text-charcoal/40'}`} />
                <span>Sign In</span>
              </button>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setUserRole('host')}
                className={`p-3 rounded-2xl border text-left transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                  userRole === 'host'
                    ? 'border-taupe bg-taupe/15 text-charcoal ring-1 ring-taupe shadow-soft-sm font-semibold'
                    : 'border-taupe/20 bg-sand/50 text-charcoal/70 hover:border-taupe/40'
                }`}
              >
                {userRole === 'host' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-taupe text-sand flex items-center justify-center text-[10px] shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <span className="block text-sm font-bold text-charcoal">Event Host</span>
                <span className="block text-[10px] text-charcoal/60 font-sans mt-0.5">Planning a celebration</span>
              </button>

              <button
                type="button"
                onClick={() => setUserRole('supplier')}
                className={`p-3 rounded-2xl border text-left transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                  userRole === 'supplier'
                    ? 'border-taupe bg-taupe/15 text-charcoal ring-1 ring-taupe shadow-soft-sm font-semibold'
                    : 'border-taupe/20 bg-sand/50 text-charcoal/70 hover:border-taupe/40'
                }`}
              >
                {userRole === 'supplier' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-taupe text-sand flex items-center justify-center text-[10px] shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <span className="block text-sm font-bold text-charcoal">Supplier Partner</span>
                <span className="block text-[10px] text-charcoal/60 font-sans mt-0.5">Venue, Chef, DJ, Photo</span>
              </button>
            </div>

            {/* Social Logins */}
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading || loading}
                className="w-full bg-sand hover:bg-sand-200/50 border border-taupe/25 rounded-xl py-2.5 px-4 text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-all shadow-soft-sm disabled:opacity-50"
              >
                {googleLoading ? (
                  <span className="text-xs text-taupe font-medium flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting Google...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-taupe/20" />
              </div>
              <span className="relative bg-sand-50 px-3 text-xs text-charcoal/50">
                Or continue with email
              </span>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Eleanor Vance"
                    className="w-full bg-sand border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="eleanor@example.com"
                  className="w-full bg-sand border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-sand border border-taupe/20 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal/40 hover:text-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-charcoal/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded accent-taupe"
                  />
                  <span>Remember me</span>
                </label>
                {mode === 'signin' && (
                  <a href="/forgot-password" className="text-xs font-semibold text-taupe hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sand" />
                    <span>
                      {mode === 'signup'
                        ? 'Create Free Account & Start Event'
                        : 'Sign In to LEEMEVENTS'}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-taupe/15 mt-4">
              <p className="text-[10px] text-charcoal/60 leading-relaxed">
                By continuing, you agree to LEEMEVENTS&apos;s{' '}
                <a href="#" className="text-taupe underline">Terms of Service</a> and{' '}
                <a href="#" className="text-taupe underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
