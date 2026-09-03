'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Sparkles, Eye, EyeOff, Compass, ArrowLeft, Calendar, Briefcase, Heart, Store, Check, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [userRole, setUserRole] = useState<UserRole>('host');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      const newUser = signup(formData.email, userRole, formData.name);
      if (newUser.role === 'host') {
        router.push('/dashboard/host/onboarding');
      } else {
        router.push('/dashboard/supplier/onboarding');
      }
    } else {
      const loggedUser = login(formData.email, userRole, formData.name);
      if (loggedUser.role === 'host') {
        router.push(loggedUser.onboarded ? '/dashboard/host' : '/dashboard/host/onboarding');
      } else {
        router.push(loggedUser.onboarded ? '/dashboard/supplier' : '/dashboard/supplier/onboarding');
      }
    }
  };

  return (
    <main className="min-h-screen bg-sand-50 text-charcoal font-sans selection:bg-taupe selection:text-sand">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">

        {/* Left Decorative Image & Brand Story Column */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 lg:p-14 bg-charcoal text-sand min-h-screen sticky top-0">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Event Celebration"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-classico tracking-[0.2em] uppercase text-sand/80 hover:text-sand mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>

              <div className="w-12 h-12 rounded-2xl bg-sand/10 backdrop-blur-md text-sand flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>

              <h2 className="font-classico text-3xl sm:text-4xl font-normal uppercase tracking-wide text-sand leading-tight">
                Plan your celebration <span className="font-serif-display lowercase italic font-normal text-taupe-200">with calm.</span>
              </h2>

              <p className="mt-4 text-sm text-sand/80 leading-relaxed max-w-sm">
                Join thousands of event hosts and curated luxury suppliers using LEEMEVENTS for combined request planning and unified contracts.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-sand/15 flex items-center justify-between text-xs text-sand/60">
              <span>Wabi Sabi Marketplace</span>
              <span>© 2026 LEEMEVENTS</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-sand-50 min-h-screen overflow-y-auto">
            <div className="max-w-md mx-auto w-full py-8 sm:py-12">

              {/* Header Logo */}
              <div className="text-center lg:text-left mb-6">
                <Link
                  href="/"
                  className="inline-flex lg:hidden items-center gap-2 text-xs text-charcoal/60 hover:text-charcoal mb-4 transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </Link>

                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/15 border border-taupe/25 text-taupe text-xs font-semibold mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-taupe animate-pulse" />
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  </div>
                </div>

                <Link href="/" className="text-2xl font-bold text-charcoal block hover:text-taupe transition-colors tracking-normal">
                  LEEMEVENTS
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-2 tracking-tight">
                  {mode === 'signup' ? 'Start Your Event' : 'Welcome Back'}
                </h1>
                <p className="text-xs text-charcoal/70 mt-1">
                  {mode === 'signup'
                    ? 'What brings you to LEEMEVENTS? Choose your account role below.'
                    : 'Sign in to access your saved suppliers, events, or booking proposals.'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-stone/70 p-1.5 rounded-2xl mb-6 border border-taupe/25 shadow-inner relative">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`relative flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${mode === 'signup'
                      ? 'bg-charcoal text-sand shadow-md ring-1 ring-charcoal/20'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-sand/40'
                    }`}
                >
                  <UserPlus className={`w-3.5 h-3.5 transition-colors ${mode === 'signup' ? 'text-taupe-200' : 'text-charcoal/40'}`} />
                  <span>Create Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`relative flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${mode === 'signin'
                      ? 'bg-charcoal text-sand shadow-md ring-1 ring-charcoal/20'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-sand/40'
                    }`}
                >
                  <LogIn className={`w-3.5 h-3.5 transition-colors ${mode === 'signin' ? 'text-taupe-200' : 'text-charcoal/40'}`} />
                  <span>Sign In</span>
                </button>
              </div>

              {/* Role Selection (Required by Specification) */}
              <div className="mb-6 space-y-2">
                <label className="text-xs font-semibold text-charcoal/80 block mb-2">
                  What brings you to LEEMEVENTS?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('host')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${userRole === 'host'
                        ? 'border-taupe bg-taupe/15 text-charcoal ring-1 ring-taupe shadow-soft-sm font-semibold'
                        : 'border-taupe/20 bg-sand text-charcoal/75 hover:border-taupe/40'
                      }`}
                  >
                    {userRole === 'host' && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-taupe text-sand flex items-center justify-center text-[10px] shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <div className="flex items-center gap-2.5 mb-1">
                      <Heart className="w-4 h-4 text-taupe shrink-0 fill-taupe/20" />
                      <span className="text-sm font-bold text-charcoal">
                        Event Host
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-snug pr-4">
                      Planning a celebration (wedding, birthday, corporate)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole('supplier')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${userRole === 'supplier'
                        ? 'border-taupe bg-taupe/15 text-charcoal ring-1 ring-taupe shadow-soft-sm font-semibold'
                        : 'border-taupe/20 bg-sand text-charcoal/75 hover:border-taupe/40'
                      }`}
                  >
                    {userRole === 'supplier' && (
                      <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-taupe text-sand flex items-center justify-center text-[10px] shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <div className="flex items-center gap-2.5 mb-1">
                      <Store className="w-4 h-4 text-taupe shrink-0" />
                      <span className="text-sm font-bold text-charcoal">
                        Supplier Partner
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-snug pr-4">
                      Venue, Chef, DJ, Photo, Stylist...
                    </p>
                  </button>
                </div>
              </div>

              {/* Social Auth Buttons */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-sand hover:bg-sand-200/50 border border-taupe/25 rounded-xl py-3 px-4 text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-all shadow-soft-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-taupe/20" />
                </div>
                <span className="relative bg-sand-50 px-3 text-xs text-charcoal/50">
                  Or continue with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                      Full Name / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={userRole === 'host' ? 'Eleanor Vance' : 'Aura Floral & Styling'}
                      className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eleanor@example.com"
                    className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-sand border border-taupe/20 rounded-xl pl-4 pr-11 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal/40 hover:text-charcoal"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
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
                  className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4 text-sand" />
                  <span>
                    {mode === 'signup'
                      ? userRole === 'host'
                      ? 'Continue to Host Onboarding'
                      : 'Continue to Supplier Onboarding'
                      : `Sign In as ${userRole === 'host' ? 'Event Host' : 'Supplier'}`}
                  </span>
                </button>
              </form>

              <div className="text-center pt-6 border-t border-taupe/15 mt-6 space-y-2">
                <p className="text-[11px] text-charcoal/60 leading-relaxed">
                  By continuing, you agree to LEEMEVENTS&apos;s{' '}
                  <a href="#" className="text-taupe underline font-semibold">Terms of Service</a> and{' '}
                  <a href="#" className="text-taupe underline font-semibold">Privacy Policy</a>.
                </p>
                <p className="text-[10px] font-classico tracking-widest text-charcoal/40 uppercase">
                  © 2026 LEEMEVENTS • All Rights Reserved
                </p>
              </div>
            </div>
          </div>

        </div>
    </main>
  );
}
