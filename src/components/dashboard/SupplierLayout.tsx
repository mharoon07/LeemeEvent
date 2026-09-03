'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  AlertTriangle,
} from 'lucide-react';

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, approveSupplier } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isApproved = user?.supplierApproved ?? true;

  const navItems = [
    { name: 'Overview', href: '/dashboard/supplier', icon: LayoutDashboard },
    { name: 'Account & Profile', href: '/dashboard/supplier/profile', icon: Store },
    { name: 'Portfolio', href: '/dashboard/supplier/portfolio', icon: ImageIcon },
    { name: 'Services & Pricing', href: '/dashboard/supplier/services', icon: DollarSign },
    { name: 'Calendar & Availability', href: '/dashboard/supplier/calendar', icon: Calendar, badge: 'Sync' },
    { name: 'Requests Queue', href: '/dashboard/supplier/requests', icon: Inbox, badge: '3 New' },
    { name: 'My Customers', href: '/dashboard/supplier/customers', icon: Users },
    { name: 'Messages', href: '/dashboard/supplier/messages', icon: MessageSquare, badge: '1' },
    { name: 'Reviews', href: '/dashboard/supplier/reviews', icon: Star, isPhase2: true },
    { name: 'Earnings & Bookings', href: '/dashboard/supplier/earnings', icon: TrendingUp },
    { name: 'Subscription Plan', href: '/dashboard/supplier/subscription', icon: CreditCard, isPhase2: true },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-sand text-charcoal flex flex-col lg:flex-row font-sans selection:bg-taupe selection:text-sand">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-sand-50 border-r border-taupe/20 flex-col justify-between p-6 fixed top-0 bottom-0 left-0 z-40 shadow-soft-sm">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link href="/dashboard/supplier" className="group block space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-taupe/15 text-taupe flex items-center justify-center">
                <Compass className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="font-classico text-xl font-normal tracking-[0.2em] uppercase text-charcoal">
                LEEMEVENT
              </span>
            </div>
            <span className="text-[10px] font-classico tracking-[0.25em] uppercase text-taupe block pl-11">
              Supplier Partner Hub
            </span>
          </Link>

          {/* Verification Badge Header */}
          <div className="bg-sand border border-taupe/20 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${isApproved ? 'text-emerald-700' : 'text-amber-600'}`} />
              <div>
                <span className="text-[10px] font-classico tracking-wider uppercase font-bold text-charcoal block">
                  {isApproved ? 'Verified Supplier' : 'Pending Approval'}
                </span>
                <span className="text-[9px] text-charcoal/60 block">
                  {isApproved ? 'Active in Directory' : 'Review in Progress'}
                </span>
              </div>
            </div>

            {!isApproved && (
              <button
                type="button"
                onClick={approveSupplier}
                className="text-[9px] font-classico uppercase bg-emerald-700 text-sand px-2 py-1 rounded font-bold hover:bg-emerald-800"
                title="Demo: Click to simulate instant admin approval"
              >
                Approve
              </button>
            )}
          </div>

          <div className="w-full h-[1px] bg-taupe/15" />

          {/* Navigation Items */}
          <nav className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-classico tracking-wider uppercase transition-all group ${
                    isActive
                      ? 'bg-charcoal text-sand font-semibold shadow-soft-sm'
                      : 'text-charcoal/80 hover:bg-taupe/10 hover:text-taupe'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sand' : 'text-taupe'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-sans font-bold ${
                        isActive
                          ? 'bg-taupe text-sand'
                          : 'bg-taupe/15 text-taupe group-hover:bg-taupe group-hover:text-sand'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.isPhase2 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-sans tracking-normal">
                      Phase 2
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-4 border-t border-taupe/15 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-charcoal text-sand font-classico text-sm font-bold flex items-center justify-center">
              {user?.businessName ? user.businessName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-charcoal block truncate">
                {user?.businessName || user?.name || 'Aura Floral & Styling'}
              </span>
              <span className="text-[10px] text-charcoal/60 block truncate">
                {user?.email || 'vendor@example.com'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-taupe/20 text-xs font-classico tracking-wider uppercase text-charcoal/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="lg:hidden bg-sand-50 border-b border-taupe/20 p-4 sticky top-0 z-50 flex items-center justify-between">
        <Link href="/dashboard/supplier" className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-taupe" />
          <span className="font-classico text-lg font-normal tracking-[0.18em] uppercase text-charcoal">
            LEEMEVENT Partner
          </span>
        </Link>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-charcoal hover:bg-taupe/10"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sand/95 backdrop-blur-xl p-6 overflow-y-auto space-y-6 pt-20">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-classico tracking-wider uppercase ${
                    isActive ? 'bg-charcoal text-sand font-bold' : 'text-charcoal hover:bg-taupe/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary py-3 text-xs flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:pl-72 min-h-screen p-4 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
