'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles, Eye, EyeOff, Compass, ArrowLeft, Heart, Store, Check } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const [userRole, setUserRole] = useState<UserRole>('host');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle(userRole);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-up could not be initiated.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newUser = await signup({
        email: formData.email,
        password: formData.password,
        role: userRole,
        name: formData.name,
      });

      if (newUser.role === 'host') {
        router.push('/dashboard/host/onboarding');
      } else {
        router.push('/dashboard/supplier/onboarding');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-classico tracking-[0.2em] uppercase text-sand/80 hover:text-sand transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>{t.auth.backToHome}</span>
              </Link>
              <LanguageSwitcher variant="navbar" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-sand/10 backdrop-blur-md text-sand flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-classico text-3xl sm:text-4xl font-normal uppercase tracking-wide text-sand leading-tight">
              {t.auth.brandTagline}
            </h2>

            <p className="mt-4 text-sm text-sand/80 leading-relaxed max-w-sm">
              {t.auth.brandSubtext}
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-sand/15 flex items-center justify-between text-[11px] font-classico tracking-widest text-sand/60 uppercase">
            <span>{t.auth.wabiSabiMarketplace}</span>
            <span>© 2026 LEEMEVENTS</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-sand-50 min-h-screen overflow-y-auto">
          <div className="max-w-md mx-auto w-full py-8 sm:py-12">

            {/* Header Logo */}
            <div className="text-center lg:text-left mb-6">
              <div className="flex items-center justify-between lg:justify-end mb-4">
                <Link
                  href="/"
                  className="inline-flex lg:hidden items-center gap-2 text-xs font-classico tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.auth.backToHome}</span>
                </Link>
                <div className="lg:hidden">
                  <LanguageSwitcher variant="navbar" />
                </div>
              </div>

              <Link href="/" className="text-2xl font-bold tracking-normal text-charcoal block hover:text-taupe transition-colors">
                LEEMEVENTS
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-2">
                {t.auth.startYourEvent}
              </h1>
              <p className="text-xs text-charcoal/70 mt-1">
                {t.auth.signUpSubtext}
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6 space-y-2">
              <label className="text-xs font-semibold text-charcoal/80 block mb-2">
                {t.auth.roleQuestion}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserRole('host')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                    userRole === 'host'
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
                      {t.auth.hostRoleTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal/70 leading-snug pr-4">
                    {t.auth.hostRoleDesc}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserRole('supplier')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe ${
                    userRole === 'supplier'
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
                      {t.auth.supplierRoleTitle}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal/70 leading-snug pr-4">
                    {t.auth.supplierRoleDesc}
                  </p>
                </button>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading || isSubmitting}
                className="w-full bg-sand hover:bg-sand-200/50 border border-taupe/25 rounded-xl py-3 px-4 text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-all shadow-soft-sm disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <span className="text-xs text-taupe font-medium flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-taupe border-t-transparent rounded-full animate-spin" />
                    Connecting to Google...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{t.auth.googleContinue}</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-taupe/20" />
              </div>
              <span className="relative bg-sand-50 px-3 text-xs text-charcoal/50">
                {t.auth.orSignUpEmail}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                  {t.auth.fullNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={userRole === 'host' ? t.auth.fullNamePlaceholderHost : t.auth.fullNamePlaceholderSupplier}
                  className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                  {t.auth.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                  {t.auth.passwordLabel}
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

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-sand border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-sand" />
                )}
                <span>
                  {isSubmitting
                    ? 'Creating Account...'
                    : userRole === 'host'
                    ? t.auth.continueToHostOnboarding
                    : t.auth.continueToSupplierOnboarding}
                </span>
              </button>
            </form>

            <div className="text-center pt-6 border-t border-taupe/15 mt-6 space-y-2">
              <p className="text-[11px] text-charcoal/60 leading-relaxed">
                {t.auth.alreadyHaveAccount}{' '}
                <Link href="/login" className="text-taupe underline font-semibold">
                  {t.auth.signInTab}
                </Link>
              </p>
              <p className="text-xs text-charcoal/40">
                © 2026 LEEMEVENTS • {t.footer.allRightsReserved}
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
