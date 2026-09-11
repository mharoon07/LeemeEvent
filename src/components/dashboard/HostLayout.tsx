'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  ShoppingBag,
  FileText,
  MessageSquare,
  FileCode,
  Settings,
  LogOut,
  Menu,
  X,
  Compass,
  Bell,
  ChevronRight,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import SuspendedAccountModal from '@/components/dashboard/SuspendedAccountModal';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';

interface HostLayoutProps {
  children: React.ReactNode;
}

export default function HostLayout({ children }: HostLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isSuspended, suspensionReason } = useAuth();
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Nav items (Cleaned: Team & Planning removed as requested)
  const navItems = [
    { name: t.dashboard.hostNav.overview, href: '/dashboard/host', icon: LayoutDashboard },
    { name: t.dashboard.hostNav.myEvents, href: '/dashboard/host/events', icon: CalendarDays },
    { name: t.dashboard.hostNav.browse, href: '/dashboard/host/browse', icon: Search },
    { name: t.dashboard.hostNav.requests, href: '/dashboard/host/requests', icon: FileText, badge: 'Active' },
    { name: t.dashboard.hostNav.documents, href: '/dashboard/host/documents', icon: FileCode },
    { name: t.dashboard.hostNav.cart, href: '/dashboard/host/cart', icon: ShoppingBag, badge: '3' },
    { name: t.dashboard.hostNav.messages, href: '/dashboard/host/messages', icon: MessageSquare, badge: '2' },
    { name: t.dashboard.hostNav.settings, href: '/dashboard/host/settings', icon: Settings },
  ];

  const currentNav = navItems.find((item) => item.href === pathname) || {
    name: pathname.includes('/events') ? t.dashboard.hostNav.myEvents : t.dashboard.hostPortal,
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Valued Host';
  const displayEmail = user?.email || 'host@leemevents.com';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-charcoal flex font-sans selection:bg-taupe selection:text-sand w-full overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-stone-200/90 flex-col justify-between p-5 fixed top-0 bottom-0 left-0 z-40 shadow-[1px_0_16px_rgba(0,0,0,0.02)]">
        <div className="space-y-5">
          {/* Brand Header */}
          <Link href="/dashboard/host" className="group block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm shrink-0 group-hover:bg-taupe transition-colors">
                <Compass className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <span className="text-lg font-bold text-charcoal tracking-tight block leading-none">
                  LEEMEVENTS
                </span>
                <span className="text-[10px] text-taupe font-bold tracking-widest uppercase block mt-1">
                  {t.dashboard.hostSuite}
                </span>
              </div>
            </div>
          </Link>

          <div className="w-full h-[1px] bg-stone-200/70" />

          {/* Navigation Items */}
          <nav className="space-y-1">
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
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-amber-200' : 'text-stone-400 group-hover:text-charcoal'
                      }`}
                    />
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
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-3 border-t border-stone-200/80 space-y-2.5">
          <Link
            href="/dashboard/host/settings"
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-stone-50 transition-colors group"
          >
            {user?.avatar ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-soft-sm ring-2 ring-taupe/30">
                <Image
                  src={user.avatar}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized={Boolean(user.avatar?.startsWith('data:') || user.avatar?.startsWith('http'))}
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-taupe text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-soft-sm ring-2 ring-taupe/20">
                {displayInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-charcoal block truncate group-hover:text-taupe transition-colors">
                {displayName}
              </span>
              <span className="text-[11px] text-stone-500 block truncate">
                {displayEmail}
              </span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
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
                  href="/dashboard/host"
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
                      {t.dashboard.hostSuite}
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

            <div className="pt-4 border-t border-stone-200">
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
        <header className="sticky top-0 z-30 h-16 w-full bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-stone-400 hidden sm:inline">{t.dashboard.hostPortal}</span>
              <ChevronRight className="w-3 h-3 text-stone-300 hidden sm:inline" />
              <span className="text-charcoal font-bold tracking-tight">
                {currentNav.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageSwitcher variant="navbar" />

            <Link
              href="/dashboard/host/browse"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200/80 text-xs font-semibold text-stone-700 transition-all shadow-soft-sm"
            >
              <Search className="w-3.5 h-3.5 text-taupe" />
              <span>{t.dashboard.browseSuppliers}</span>
            </Link>

            <Link
              href="/dashboard/host/cart"
              className="relative p-2 rounded-xl border border-stone-200/80 bg-white hover:bg-[#FAF8F5] text-stone-700 hover:text-charcoal transition-all shadow-soft-sm group"
              title={t.dashboard.selectionCart}
            >
              <ShoppingBag className="w-4 h-4 text-taupe group-hover:text-charcoal transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </Link>

            {/* REAL INTERACTIVE NOTIFICATIONS POPOVER */}
            <NotificationDropdown role="host" />

            {/* User Profile Quick Chip */}
            <Link
              href="/dashboard/host/settings"
              className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-stone-200 hover:opacity-85 transition-opacity"
            >
              {user?.avatar ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-soft-sm ring-1 ring-taupe/30 shrink-0">
                  <Image
                    src={user.avatar}
                    alt={displayName}
                    fill
                    className="object-cover"
                    unoptimized={Boolean(user.avatar?.startsWith('data:') || user.avatar?.startsWith('http'))}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-taupe text-white text-xs font-bold flex items-center justify-center shadow-soft-sm ring-1 ring-taupe/20 shrink-0">
                  {displayInitial}
                </div>
              )}
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-charcoal block leading-tight truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block leading-tight">
                  {t.dashboard.eventHost}
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
          {children}
        </main>
      </div>

      {/* Real-time Account Suspension Modal Lock */}
      <SuspendedAccountModal
        isOpen={isSuspended || Boolean(user?.isSuspended) || user?.is_active === false}
        role="host"
        reason={suspensionReason || user?.suspensionReason}
      />
    </div>
  );
}
