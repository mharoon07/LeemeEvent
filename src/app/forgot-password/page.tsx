'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Edit3,
  ShieldCheck,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Step state: 'request_otp' | 'verify_reset' | 'success'
  const [step, setStep] = useState<'request_otp' | 'verify_reset' | 'success'>('request_otp');

  // Form states
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Resend Timer (60s countdown)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Refs for 6 OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify_reset' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    if (!sanitized && value !== '') return;

    const newOtp = [...otpValues];

    if (sanitized.length > 1) {
      // User pasted full OTP
      const pastedDigits = sanitized.slice(0, 6).split('');
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtpValues(newOtp);
      const nextFocus = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = sanitized;
    setOtpValues(newOtp);

    // Auto move to next input if filled
    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Request OTP handler
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res: any = await api.post(
        '/auth/forgot-password',
        { email: email.trim().toLowerCase() }
      );

      const receivedOtp = res?.dev_otp || res?.data?.dev_otp || res?.otp || res?.data?.otp || '630690';
      setDevOtp(receivedOtp);

      setSuccessMessage(res.message || 'Verification code sent to your email!');
      setStep('verify_reset');
      setCountdown(60);
      setCanResend(false);

      // Auto-focus first OTP input after step switch
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP code. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res: any = await api.post(
        '/auth/forgot-password',
        { email: email.trim().toLowerCase() }
      );

      const receivedOtp = res?.dev_otp || res?.data?.dev_otp || res?.otp || res?.data?.otp || '630690';
      setDevOtp(receivedOtp);

      setSuccessMessage('A new verification code has been sent.');
      setCountdown(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill Dev OTP (helper button)
  const handleQuickFillDevOtp = () => {
    const code = devOtp || '630690';
    if (code && code.length >= 6) {
      setOtpValues(code.slice(0, 6).split(''));
    }
  };

  // Step 2: Verify OTP & Reset Password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t.auth.passwordsMismatch || 'Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp,
        new_password: newPassword,
      });

      setSuccessMessage(res.message || 'Password has been reset successfully!');
      setStep('success');

      // Auto-redirect to /login after 2.5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: '' };
    if (pass.length < 6) return { score: 1, text: t.auth.strengthTooShort || 'Too short', color: 'bg-red-500' };
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, text: t.auth.strengthFair || 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: t.auth.strengthGood || 'Good', color: 'bg-blue-500' };
    return { score: 4, text: t.auth.strengthStrong || 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <main className="min-h-screen bg-sand-50 text-charcoal font-sans selection:bg-taupe selection:text-sand">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">

        {/* Left Decorative Column */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 sm:p-10 lg:p-14 bg-charcoal text-sand min-h-screen sticky top-0">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <Image
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Grand Event"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-classico tracking-[0.2em] uppercase text-sand/80 hover:text-sand transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.auth.backToHome || 'Back to Login'}</span>
              </Link>
              <LanguageSwitcher variant="navbar" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-sand/10 backdrop-blur-md text-sand flex items-center justify-center mb-6">
              <KeyRound className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-classico text-3xl sm:text-4xl font-normal uppercase tracking-wide text-sand leading-tight">
              {t.auth.brandTagline || 'Security & Account Recovery'}
            </h2>

            <p className="mt-4 text-sm text-sand/80 leading-relaxed max-w-sm">
              {t.auth.brandSubtext || 'Safeguard your event plans with fast, verified 6-digit OTP password reset backed by Supabase encryption.'}
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-sand/15 flex items-center justify-between text-xs text-sand/60">
            <span>LEEMEVENT 2026</span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-4 sm:p-8 lg:p-16 flex flex-col justify-center bg-sand-50 min-h-screen overflow-y-auto">
          <div className="max-w-md mx-auto w-full py-6 sm:py-10">

            {/* Mobile Header Link & Language Switcher */}
            <div className="flex items-center justify-between lg:justify-end mb-6">
              <Link
                href="/login"
                className="inline-flex lg:hidden items-center gap-2 text-xs text-charcoal/60 hover:text-charcoal transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.auth.backToHome || 'Back to Login'}</span>
              </Link>
              <div className="lg:hidden">
                <LanguageSwitcher variant="navbar" />
              </div>
            </div>

            {/* Brand Header */}
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <Link href="/" className="text-2xl font-bold text-charcoal block hover:text-taupe transition-colors tracking-normal">
                LEEMEVENTS
              </Link>

              {step === 'request_otp' && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-2">
                    {t.auth.forgotPasswordTitle}
                  </h1>
                  <p className="text-xs text-charcoal/70 mt-1">
                    {t.auth.forgotPasswordSubtext}
                  </p>
                </>
              )}

              {step === 'verify_reset' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold mb-2 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.auth.otpActive}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
                    {t.auth.resetTitle}
                  </h1>
                  <p className="text-xs text-charcoal/70 mt-1">
                    {t.auth.resetSubtext}
                  </p>
                </>
              )}

              {step === 'success' && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-2">
                    {t.auth.successTitle}
                  </h1>
                  <p className="text-xs text-charcoal/70 mt-1">
                    {t.auth.successSubtext}
                  </p>
                </>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200">
                <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: REQUEST OTP FORM */}
            {step === 'request_otp' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                    {t.auth.emailLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.auth.emailPlaceholder}
                      className="w-full bg-sand border border-taupe/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                    />
                    <Mail className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-sand border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4 text-sand" />
                  )}
                  <span>{isLoading ? t.auth.sendingOtp : t.auth.sendOtpButton}</span>
                </button>

                <div className="text-center pt-6 border-t border-taupe/15 mt-6">
                  <p className="text-xs text-charcoal/60">
                    {t.auth.rememberPassword}{' '}
                    <Link href="/login" className="text-taupe underline font-semibold hover:text-charcoal transition-colors">
                      {t.auth.signInHere}
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* STEP 2: VERIFY OTP & RESET PASSWORD FORM */}
            {step === 'verify_reset' && (
              <form onSubmit={handleResetPassword} className="space-y-5">

                {/* Email Chip & Change Email Option */}
                <div className="p-3 bg-stone/50 border border-taupe/20 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate text-charcoal/80">
                    <Mail className="w-3.5 h-3.5 text-taupe shrink-0" />
                    <span className="truncate font-medium">{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('request_otp');
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-1 text-taupe font-semibold hover:underline shrink-0 ml-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {/* PROMINENT OTP CODE DISPLAY RIGHT ON TOP OF INPUT BOXES */}
                <div className="p-4 rounded-2xl bg-sand border-2 border-taupe/30 text-charcoal shadow-soft-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-taupe animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        {t.auth.otpCardTitle}
                      </span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-taupe/20 text-charcoal font-semibold">
                      {t.auth.expiryNotice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {(devOtp || '630690').slice(0, 6).split('').map((ch, idx) => (
                        <span
                          key={idx}
                          className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center bg-sand-50 rounded-xl border border-taupe/35 font-mono font-bold text-lg sm:text-xl text-charcoal shadow-inner"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickFillDevOtp}
                      className="px-3 py-2.5 bg-charcoal hover:bg-black text-sand rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0 ml-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-taupe-200" />
                      <span>{t.auth.autoFillBtn}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-charcoal/70">
                    {t.auth.otpPromptHint}
                  </p>
                </div>

                {/* 6-Digit Interactive OTP Inputs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-charcoal/80">
                      {t.auth.enterOtpLabel}
                    </label>
                  </div>

                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {otpValues.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-full aspect-square text-center text-lg sm:text-xl font-bold font-mono bg-sand border border-taupe/25 rounded-xl text-charcoal focus:outline-none focus:border-taupe focus:ring-2 focus:ring-taupe/20 transition-all shadow-soft-sm"
                      />
                    ))}
                  </div>

                  {/* Resend Timer */}
                  <div className="flex items-center justify-between mt-2.5 text-xs text-charcoal/60">
                    <span>{t.auth.resendPrompt}</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-taupe font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{t.auth.resendBtn}</span>
                      </button>
                    ) : (
                      <span className="font-mono text-charcoal/50">{t.auth.resendIn} {countdown}s</span>
                    )}
                  </div>
                </div>

                {/* New Password Input */}
                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                    {t.auth.newPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t.auth.newPasswordPlaceholder}
                      className="w-full bg-sand border border-taupe/20 rounded-xl pl-11 pr-11 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                    />
                    <Lock className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal/40 hover:text-charcoal"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-charcoal/60">
                        <span>{t.auth.strengthLabel}</span>
                        <span className="font-semibold">{strength.text}</span>
                      </div>
                      <div className="w-full bg-taupe/15 h-1.5 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-full flex-1 transition-all duration-300 ${
                              level <= strength.score ? strength.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="text-xs font-semibold text-charcoal/80 mb-1.5 block">
                    {t.auth.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.auth.confirmPasswordPlaceholder}
                      className="w-full bg-sand border border-taupe/20 rounded-xl pl-11 pr-11 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe transition-colors"
                    />
                    <Lock className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal/40 hover:text-charcoal"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && (
                    <p className={`text-[11px] mt-1.5 font-medium flex items-center gap-1 ${
                      newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {newPassword === confirmPassword ? t.auth.passwordsMatch : t.auth.passwordsMismatch}
                    </p>
                  )}
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpValues.join('').length !== 6 || !newPassword || newPassword !== confirmPassword}
                  className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-sand border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-sand" />
                  )}
                  <span>{isLoading ? t.auth.resettingBtn : t.auth.resetSaveBtn}</span>
                </button>
              </form>
            )}

            {/* STEP 3: SUCCESS CELEBRATION */}
            {step === 'success' && (
              <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 mx-auto flex items-center justify-center shadow-soft-sm">
                  <CheckCircle2 className="w-8 h-8 stroke-[2]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-charcoal">
                    {t.auth.successTitle}
                  </h3>
                  <p className="text-xs text-charcoal/70 max-w-xs mx-auto">
                    {t.auth.successSubtext}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold"
                  >
                    <span>{t.auth.goToLoginBtn}</span>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}
