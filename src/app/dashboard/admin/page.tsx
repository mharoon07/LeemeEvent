'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/dashboard/AdminLayout';
import adminApi from '@/lib/services/adminApi';
import { AdminStatsData, AdminSupplierItem } from '@/types/api';
import {
  Users,
  Store,
  CalendarDays,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Layers,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [pendingSuppliers, setPendingSuppliers] = useState<AdminSupplierItem[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, pendingData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getSuppliers({ status: 'pending' }),
      ]);
      setStats(statsData);
      setPendingSuppliers(pendingData || []);
    } catch (err: any) {
      console.error('Failed to fetch admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleVerify = async (id: string, status: 'verified' | 'rejected', name: string) => {
    setActionLoadingId(id);
    setFeedbackMessage(null);
    try {
      await adminApi.verifySupplier(id, status);

      // Find the supplier to synchronize user account status
      const sup = pendingSuppliers.find((s) => s.id === id);
      const userId = sup?.user_id || sup?.user?.id || (sup?.profile as any)?.id;
      if (userId) {
        try {
          await adminApi.updateUserStatus(userId, status === 'verified');
        } catch {}
      }

      setFeedbackMessage({
        text: `Supplier "${name}" has been successfully ${status === 'verified' ? 'approved and unlocked' : 'rejected'}.`,
        type: 'success',
      });
      // Remove from pending list locally
      setPendingSuppliers((prev) => prev.filter((s) => s.id !== id));
      // Update stats count locally
      if (stats) {
        setStats({
          ...stats,
          pendingSuppliers: Math.max(0, (stats.pendingSuppliers || 1) - 1),
          totalSuppliers: status === 'verified' ? stats.totalSuppliers + 1 : stats.totalSuppliers,
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        text: err?.message || 'Failed to update supplier verification status.',
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* TOP WELCOME BANNER */}
        <div className="bg-charcoal text-sand rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-soft-lg">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-taupe/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/10 border border-sand/15 text-xs font-semibold uppercase tracking-wider text-sand/90 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-taupe-200" />
                <span>LeemeEvent Command Center</span>
              </div>
              <h1 className="font-classico text-2xl sm:text-3xl font-bold uppercase tracking-tight text-sand">
                Admin Overview Dashboard
              </h1>
              <p className="mt-1 text-sm text-sand/75 max-w-xl">
                Real-time operational health, automated supplier verification queue, and marketplace metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/admin/suppliers"
                className="px-4 py-2.5 rounded-xl bg-sand text-charcoal text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-taupe" />
                <span>Review Suppliers</span>
              </Link>
              <Link
                href="/dashboard/admin/categories"
                className="px-4 py-2.5 rounded-xl bg-sand/15 border border-sand/20 text-sand text-xs font-bold hover:bg-sand/25 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </Link>
            </div>
          </div>
        </div>

        {/* FEEDBACK TOAST */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-stone-400 hover:text-stone-700 underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 CORE KPI STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Total Hosts */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-soft-sm hover:shadow-soft transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Hosts
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? (
                <div className="h-8 w-16 bg-stone-200 animate-pulse rounded-lg" />
              ) : (
                stats?.totalHosts ?? 0
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <span>Registered event planners</span>
            </p>
          </div>

          {/* 2. Total Suppliers & Pending Badge */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-soft-sm hover:shadow-soft transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Suppliers
              </span>
              <div className="w-9 h-9 rounded-xl bg-taupe/15 text-taupe flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-charcoal">
                {loading ? (
                  <div className="h-8 w-16 bg-stone-200 animate-pulse rounded-lg" />
                ) : (
                  stats?.totalSuppliers ?? 0
                )}
              </span>
              {(stats?.pendingSuppliers ?? 0) > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {stats?.pendingSuppliers} Pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Active verified vendors
            </p>
          </div>

          {/* 3. Total Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-soft-sm hover:shadow-soft transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? (
                <div className="h-8 w-16 bg-stone-200 animate-pulse rounded-lg" />
              ) : (
                stats?.totalBookings ?? 0
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Platform event requests
            </p>
          </div>

          {/* 4. Total Gross Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-soft-sm hover:shadow-soft transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Gross Volume
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-charcoal">
              {loading ? (
                <div className="h-8 w-24 bg-stone-200 animate-pulse rounded-lg" />
              ) : (
                formatCurrency(stats?.totalRevenue)
              )}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Marketplace transaction value
            </p>
          </div>
        </div>

        {/* PENDING APPROVALS QUEUE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200/80">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h2 className="text-base sm:text-lg font-bold text-charcoal">
                  Supplier Verification Queue
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {pendingSuppliers.length} Awaiting Review
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Approve or reject newly registered supplier profiles to allow them to accept bookings.
              </p>
            </div>

            <Link
              href="/dashboard/admin/suppliers"
              className="text-xs font-bold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>View All Suppliers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-stone-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : pendingSuppliers.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-charcoal">All caught up!</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                There are no pending supplier verification requests. All active vendors have been vetted.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {pendingSuppliers.map((supplier) => {
                const isProcessing = actionLoadingId === supplier.id;
                const business = supplier.business_name || 'Unnamed Studio';
                const ownerName = supplier.user?.full_name || supplier.full_name || supplier.profile?.full_name || 'Vendor Partner';
                const ownerEmail = supplier.user?.email || supplier.email || supplier.profile?.email || 'N/A';
                const category = supplier.category_name || supplier.category?.name || 'General Event Services';
                const city = supplier.city || 'Den Haag';

                return (
                  <div
                    key={supplier.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 p-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {business.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-charcoal truncate">
                            {business}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {category}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            📍 {city}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>Owner: <strong>{ownerName}</strong></span>
                          <span>•</span>
                          <span className="text-stone-400">{ownerEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleVerify(supplier.id, 'verified', business)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleVerify(supplier.id, 'rejected', business)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RECENT BOOKINGS & PLATFORM MONITOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings Activity */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-200/80">
              <div>
                <h3 className="text-base font-bold text-charcoal">Recent Bookings & Activity</h3>
                <p className="text-xs text-stone-500">Latest reservations across hosts and suppliers</p>
              </div>
              <Link
                href="/dashboard/admin/bookings"
                className="text-xs font-bold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-stone-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : !stats?.recentBookings || stats.recentBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No recent bookings recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {stats.recentBookings.slice(0, 5).map((booking: any, idx: number) => {
                  const host = booking.consumer_name || booking.consumer?.full_name || 'Event Host';
                  const supplier = booking.supplier_name || booking.supplier?.business_name || 'Supplier Studio';
                  const date = booking.event_date || booking.requested_date || 'Upcoming';
                  const status = booking.status || 'pending';
                  const amount = Number(booking.quote_amount || booking.amount || 0);

                  return (
                    <div key={booking.id || idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="font-bold text-charcoal truncate">
                          {host} ➔ {supplier}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Date: {date} {booking.service_name ? `• ${booking.service_name}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-charcoal">
                          {amount > 0 ? formatCurrency(amount) : 'Quote Requested'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            status === 'confirmed' || status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : status === 'rejected' || status === 'declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Health Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal mb-1">Quick Navigation</h3>
              <p className="text-xs text-stone-500 mb-5">Jump directly to admin management tables</p>

              <div className="space-y-2.5">
                <Link
                  href="/dashboard/admin/suppliers"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-taupe/40 hover:bg-stone-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal block">Suppliers Directory</span>
                      <span className="text-[10px] text-stone-500 block">Manage listings & ratings</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal transition-colors" />
                </Link>

                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-taupe/40 hover:bg-stone-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal block">Host & Users</span>
                      <span className="text-[10px] text-stone-500 block">Review consumers & access</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal transition-colors" />
                </Link>

                <Link
                  href="/dashboard/admin/categories"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-taupe/40 hover:bg-stone-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal block">Categories Manager</span>
                      <span className="text-[10px] text-stone-500 block">Add & edit service types</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal transition-colors" />
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200/80 mt-6">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Backend Live & Secured</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                All admin mutations are authenticated via JWT Bearer tokens with strict role protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
