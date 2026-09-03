'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Eye, EyeOff, Check, Compass, ArrowRight } from 'lucide-react';

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
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [userRole, setUserRole] = useState<'host' | 'supplier'>('host');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/70 backdrop-blur-md"
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

          {!submitted ? (
            <div>
              {/* Header Logo */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="font-classico text-2xl font-normal tracking-[0.2em] uppercase text-charcoal block">
                  LEEMEVENT
                </span>
                <p className="text-xs text-charcoal/70 mt-1 font-sans">
                  {mode === 'signup'
                    ? 'Create your free account to start planning your event'
                    : 'Welcome back! Sign in to manage your combined requests'}
                </p>
              </div>

              {/* Sign In / Sign Up Mode Toggle */}
              <div className="flex bg-sand-200/60 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 text-xs font-classico tracking-wider uppercase font-semibold rounded-xl transition-all ${
                    mode === 'signup'
                      ? 'bg-sand text-charcoal shadow-soft-sm'
                      : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 text-xs font-classico tracking-wider uppercase font-semibold rounded-xl transition-all ${
                    mode === 'signin'
                      ? 'bg-sand text-charcoal shadow-soft-sm'
                      : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setUserRole('host')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    userRole === 'host'
                      ? 'border-taupe bg-taupe/10 text-taupe font-semibold'
                      : 'border-taupe/20 bg-transparent text-charcoal/70 hover:border-taupe/40'
                  }`}
                >
                  <span className="block text-xs font-classico tracking-wider uppercase">Event Host</span>
                  <span className="block text-[10px] text-charcoal/60 font-sans mt-0.5">Planning a celebration</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserRole('supplier')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    userRole === 'supplier'
                      ? 'border-taupe bg-taupe/10 text-taupe font-semibold'
                      : 'border-taupe/20 bg-transparent text-charcoal/70 hover:border-taupe/40'
                  }`}
                >
                  <span className="block text-xs font-classico tracking-wider uppercase">Supplier Partner</span>
                  <span className="block text-[10px] text-charcoal/60 font-sans mt-0.5">Venue, Chef, DJ, Photo</span>
                </button>
              </div>

              {/* Social Logins */}
              <div className="space-y-2.5 mb-5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-sand hover:bg-sand-200/50 border border-taupe/25 rounded-xl py-2.5 px-4 text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-all shadow-soft-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-charcoal text-sand hover:bg-charcoal/90 rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-soft-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1 2.97 1.08.08 2.17-.56 2.83-1.37z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-taupe/20" />
                </div>
                <span className="relative bg-sand-50 px-3 text-[11px] font-classico uppercase tracking-wider text-charcoal/50">
                  Or continue with email
                </span>
              </div>

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
                    <a href="#" className="text-xs font-semibold text-taupe hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-xs font-classico tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-sand" />
                  <span>
                    {mode === 'signup'
                      ? 'Create Free Account & Start Event'
                      : 'Sign In to LEEMEVENT'}
                  </span>
                </button>
              </form>

              <div className="text-center pt-4 border-t border-taupe/15 mt-4">
                <p className="text-[10px] text-charcoal/60 leading-relaxed">
                  By continuing, you agree to LEEMEVENT&apos;s{' '}
                  <a href="#" className="text-taupe underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-taupe underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          ) : (
            /* Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-taupe/15 text-taupe mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-classico text-2xl uppercase tracking-wider font-bold text-charcoal">
                {mode === 'signup' ? 'Account Created Successfully!' : 'Welcome Back!'}
              </h3>
              <p className="text-sm text-charcoal/80 max-w-sm mx-auto font-sans">
                You are now logged in as <strong className="text-taupe">{formData.email || 'Event Organizer'}</strong>. You can now submit 1 combined request and manage all your event suppliers.
              </p>
              <div className="pt-4">
                <button onClick={resetAndClose} className="btn-primary px-8 py-3 text-xs tracking-widest">
                  Continue to Event Marketplace
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
