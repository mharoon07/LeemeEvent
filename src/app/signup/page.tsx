'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Sparkles, Eye, EyeOff, Compass, ArrowLeft, Heart, Store } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
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
    const newUser = signup(formData.email, userRole, formData.name);
    if (newUser.role === 'host') {
      router.push('/dashboard/host/onboarding');
    } else {
      router.push('/dashboard/supplier/onboarding');
    }
  };

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans flex flex-col justify-between selection:bg-taupe selection:text-sand">
      <Navbar onOpenModal={() => {}} />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full bg-sand-50 border border-taupe/20 rounded-3xl shadow-soft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* Left Decorative Image & Brand Story Column */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-charcoal text-sand overflow-hidden">
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
                Join thousands of event hosts and curated luxury suppliers using LEEMEVENT for combined request planning and unified contracts.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-sand/15 flex items-center justify-between text-[11px] font-classico tracking-widest text-sand/60 uppercase">
              <span>Wabi Sabi Marketplace</span>
              <span>© 2026 LEEMEVENT</span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-sand-50">
            <div className="max-w-md mx-auto w-full">
              
              {/* Header Logo */}
              <div className="text-center lg:text-left mb-6">
                <span className="font-classico text-2xl font-normal tracking-[0.2em] uppercase text-charcoal block">
                  LEEMEVENT
                </span>
                <h1 className="font-classico text-2xl sm:text-3xl font-normal uppercase tracking-wide text-charcoal mt-2">
                  Create Your Account
                </h1>
                <p className="text-xs text-charcoal/70 mt-1">
                  What brings you to LEEMEVENT? Select your role to get started.
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-6 space-y-2">
                <label className="text-xs font-classico tracking-wider uppercase font-semibold text-charcoal/80 block mb-2">
                  What brings you to LEEMEVENT?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('host')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      userRole === 'host'
                        ? 'border-taupe bg-taupe/15 text-taupe font-semibold shadow-soft-sm'
                        : 'border-taupe/20 bg-sand text-charcoal/75 hover:border-taupe/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Heart className="w-4 h-4 text-taupe shrink-0 fill-taupe/20" />
                      <span className="font-classico text-xs tracking-wider uppercase font-bold text-charcoal">
                        Event Host
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-snug">
                      Planning a celebration (wedding, birthday, corporate)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole('supplier')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      userRole === 'supplier'
                        ? 'border-taupe bg-taupe/15 text-taupe font-semibold shadow-soft-sm'
                        : 'border-taupe/20 bg-sand text-charcoal/75 hover:border-taupe/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <Store className="w-4 h-4 text-taupe shrink-0" />
                      <span className="font-classico text-xs tracking-wider uppercase font-bold text-charcoal">
                        Supplier Partner
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-snug">
                      Venue, Chef, DJ, Photo, Stylist...
                    </p>
                  </button>
                </div>
              </div>

              {/* Social Auth Buttons */}
              <div className="space-y-3 mb-6">
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
                  <span>Sign Up with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-charcoal text-sand hover:bg-charcoal/90 rounded-xl py-3 px-4 text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-soft-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1 2.97 1.08.08 2.17-.56 2.83-1.37z" />
                  </svg>
                  <span>Sign Up with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-taupe/20" />
                </div>
                <span className="relative bg-sand-50 px-3 text-[11px] font-classico uppercase tracking-wider text-charcoal/50">
                  Or sign up with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 text-xs font-classico tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4 text-sand" />
                  <span>
                    {userRole === 'host'
                      ? 'Continue to Host Onboarding'
                      : 'Continue to Supplier Onboarding'}
                  </span>
                </button>
              </form>

              <div className="text-center pt-6 border-t border-taupe/15 mt-6">
                <p className="text-[11px] text-charcoal/60 leading-relaxed">
                  Already have an account?{' '}
                  <Link href="/login" className="text-taupe underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
