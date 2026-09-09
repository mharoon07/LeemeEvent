'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  LayoutDashboard,
  Store,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Inbox,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  CreditCard,
  LogOut,
  ShieldCheck,
  Compass,
  Menu,
  X,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import SuspendedAccountModal from '@/components/dashboard/SuspendedAccountModal';

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isSuspended, suspensionReason, checkSuspension } = useAuth();
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isApproved = user?.verification_status === 'verified';
  const isRejected = user?.verification_status === 'rejected';
  const isSuspendedUser = isSuspended || user?.is_active === false || user?.isSuspended || user?.verification_status === 'suspended';
  const isPending = !isApproved && !isRejected && !isSuspendedUser;

  const modalMode = isSuspendedUser ? 'suspended' : isRejected ? 'rejected' : isPending ? 'pending' : undefined;
  const isModalOpen = Boolean(!isApproved || isSuspendedUser || isRejected || isPending);

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      if (checkSuspension) {
        const latest: any = await checkSuspension();
        if (latest?.verification_status === 'verified' || latest?.supplierApproved === true) {
          window.location.reload();
          return;
        }
      }
    } catch {}
    setTimeout(() => setIsCheckingStatus(false), 500);
  };

  const navItems = [
    { name: t.dashboard.supplierNav.overview, href: '/dashboard/supplier', icon: LayoutDashboard },
    { name: t.dashboard.supplierNav.profile, href: '/dashboard/supplier/profile', icon: Store },
    { name: t.dashboard.supplierNav.portfolio, href: '/dashboard/supplier/portfolio', icon: ImageIcon },
    { name: t.dashboard.supplierNav.services, href: '/dashboard/supplier/services', icon: DollarSign },
    { name: t.dashboard.supplierNav.calendar, href: '/dashboard/supplier/calendar', icon: Calendar, badge: 'Sync' },
    { name: t.dashboard.supplierNav.requests, href: '/dashboard/supplier/requests', icon: Inbox, badge: isApproved ? '3 New' : 'Locked' },
    { name: t.dashboard.supplierNav.customers, href: '/dashboard/supplier/customers', icon: Users },
    { name: t.dashboard.supplierNav.messages, href: '/dashboard/supplier/messages', icon: MessageSquare, badge: isApproved ? '1' : undefined },
    { name: t.dashboard.supplierNav.reviews, href: '/dashboard/supplier/reviews', icon: Star, isPhase2: true },
    { name: t.dashboard.supplierNav.earnings, href: '/dashboard/supplier/earnings', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const currentNav = navItems.find((n) => n.href === pathname) || {
    name: t.dashboard.supplierNav.overview,
  };

  const businessDisplayName = user?.businessName || user?.name || 'Aura Floral & Styling';
  const displayInitial = businessDisplayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-charcoal flex font-sans selection:bg-taupe selection:text-sand w-full overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-stone-200/90 flex-col justify-between p-5 fixed top-0 bottom-0 left-0 z-40 shadow-[1px_0_12px_rgba(0,0,0,0.03)]">
        <div className="space-y-4">
          {/* Brand Header */}
          <Link href="/dashboard/supplier" className="group block">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm shrink-0 group-hover:bg-taupe transition-colors">
                <Compass className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-lg font-bold text-charcoal tracking-tight block leading-none">
                  LEEMEVENTS
                </span>
                <span className="text-[11px] text-taupe font-semibold tracking-wide uppercase block mt-1">
                  {t.dashboard.supplierHub}
                </span>
              </div>
            </div>
          </Link>

          {/* Verification Badge Header (Real Status) */}
          <div
            className={`border rounded-2xl p-3 shadow-soft-sm transition-all ${
              isApproved
                ? 'bg-emerald-50/50 border-emerald-200/80'
                : isRejected
                ? 'bg-rose-50/50 border-rose-200/80'
                : 'bg-amber-50/50 border-amber-200/80'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <ShieldCheck
                  className={`w-4 h-4 shrink-0 ${
                    isApproved
                      ? 'text-emerald-700'
                      : isRejected
                      ? 'text-rose-600'
                      : 'text-amber-600 animate-pulse'
                  }`}
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-charcoal block truncate">
                    {isApproved
                      ? 'Verified Partner'
                      : isRejected
                      ? 'Application Declined'
                      : 'Pending Review'}
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {isApproved
                      ? 'Active in Directory'
                      : isRejected
                      ? 'Contact Support'
                      : 'Est. 24–48h window'}
                  </span>
                </div>
              </div>

              {!isApproved && (
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  className="text-[10px] text-stone-600 hover:text-charcoal bg-white border border-stone-200 px-2 py-1 rounded-lg font-bold hover:bg-stone-50 shrink-0 shadow-sm flex items-center gap-1 transition-all"
                  title="Check if Admin has approved your application"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isCheckingStatus ? 'animate-spin text-taupe' : ''}`} />
                  <span>Sync</span>
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-[1px] bg-stone-200/80" />

          {/* Navigation Items */}
          <nav className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-charcoal text-white font-semibold shadow-soft-sm'
                      : 'text-stone-700 hover:bg-stone-100/80 hover:text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-amber-200' : 'text-taupe group-hover:text-charcoal'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-sans font-bold shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-taupe/15 text-taupe group-hover:bg-taupe group-hover:text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.isPhase2 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-sans tracking-normal shrink-0 ml-1.5 font-semibold">
                      Phase 2
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-3 border-t border-stone-200/80 space-y-2.5">
          <Link
            href="/dashboard/supplier/profile"
            className="flex items-center gap-3 px-1 py-1 rounded-xl hover:bg-stone-50 transition-colors group"
          >
            {user?.avatar ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-soft-sm ring-2 ring-taupe/30">
                <Image
                  src={user.avatar}
                  alt={businessDisplayName}
                  fill
                  className="object-cover"
                  unoptimized={Boolean(user.avatar?.startsWith('data:') || user.avatar?.startsWith('http'))}
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-charcoal text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-soft-sm">
                {displayInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-charcoal block truncate group-hover:text-taupe transition-colors">
                {businessDisplayName}
              </span>
              <span className="text-[11px] text-stone-500 block truncate">
                {user?.email || 'vendor@example.com'}
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.dashboard.signOut}</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/dashboard/supplier"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-charcoal text-white flex items-center justify-center">
                    <Compass className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-charcoal block leading-none">
                      LEEMEVENTS
                    </span>
                    <span className="text-[10px] text-taupe font-bold uppercase block mt-1">
                      {t.dashboard.supplierHub}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="pt-2">
                <LanguageSwitcher variant="mobile" />
              </div>

              <nav className="space-y-1 overflow-y-auto max-h-[50vh]">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-charcoal text-white font-semibold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-taupe/15 text-taupe font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                {user?.avatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-soft-sm">
                    <Image
                      src={user.avatar}
                      alt={businessDisplayName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-charcoal text-white text-xs font-bold flex items-center justify-center">
                    {displayInitial}
                  </div>
                )}
                <span className="text-xs font-semibold text-charcoal truncate">{businessDisplayName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.dashboard.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 w-full">
        {/* UNIFIED RESPONSIVE STICKY HEADER */}
        <header className="sticky top-0 z-30 h-16 w-full bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium min-w-0">
              <span className="text-stone-400 hidden sm:inline">{t.dashboard.supplierHub}</span>
              <span className="text-stone-300 hidden sm:inline">/</span>
              <span className="text-charcoal font-bold tracking-tight truncate">
                {currentNav.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <LanguageSwitcher variant="navbar" />

            {isApproved ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Live in Directory</span>
                <span className="sm:hidden">Live</span>
              </div>
            ) : isRejected ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="hidden sm:inline">Application Declined</span>
                <span className="sm:hidden">Declined</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="hidden sm:inline">In Review (Est. 24-48h)</span>
                <span className="sm:hidden">In Review</span>
              </div>
            )}

            <Link
              href="/dashboard/supplier/profile"
              className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-stone-200 hover:opacity-85 transition-opacity"
            >
              {user?.avatar ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-soft-sm ring-1 ring-taupe/30 shrink-0">
                  <Image
                    src={user.avatar}
                    alt={businessDisplayName}
                    fill
                    className="object-cover"
                    unoptimized={Boolean(user.avatar?.startsWith('data:') || user.avatar?.startsWith('http'))}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-charcoal text-white text-xs font-bold flex items-center justify-center shadow-soft-sm shrink-0">
                  {displayInitial}
                </div>
              )}
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-charcoal block leading-tight truncate max-w-[120px]">
                  {businessDisplayName}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight">
                  {t.dashboard.verifiedVendor}
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
          {children}
        </main>
      </div>

      {/* Real-time Supplier Studio Verification & Suspension Gate Lock */}
      <SuspendedAccountModal
        isOpen={isModalOpen}
        mode={modalMode}
        role="supplier"
        reason={suspensionReason || user?.suspensionReason}
      />
    </div>
  );
}
