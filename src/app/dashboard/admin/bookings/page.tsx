'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import adminApi from '@/lib/services/adminApi';
import { AdminBookingItem } from '@/types/api';
import {
  CalendarDays,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  DollarSign,
  ArrowUpRight,
  Filter,
  Sparkles,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getBookings({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 20,
      });
      setBookings(res.bookings || []);
      setTotalCount(res.total || res.bookings.length);
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter, page]);

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (b.consumer_name || '').toLowerCase().includes(term) ||
      (b.supplier_name || '').toLowerCase().includes(term) ||
      (b.supplier_business || '').toLowerCase().includes(term) ||
      (b.service_name || '').toLowerCase().includes(term) ||
      (b.event_title || '').toLowerCase().includes(term)
    );
  });

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('en-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (d?: string) => {
    if (!d) return 'Upcoming';
    try {
      return new Date(d).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-taupe" />
              <h1 className="font-classico text-2xl font-bold uppercase tracking-tight text-charcoal">
                Events & Bookings Monitor
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Live tracking of all event requests, confirmations, contracts, and platform payments.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-charcoal hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-2 shadow-soft-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-taupe' : ''}`} />
            <span>Refresh Bookings</span>
          </button>
        </div>

        {/* SEARCH & STATUS FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-soft-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by host name, supplier name, service or event title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
            {(
              [
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed / Accepted' },
                { key: 'completed', label: 'Completed' },
                { key: 'declined', label: 'Declined' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-white text-charcoal shadow-soft-sm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-50/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Event Host</th>
                  <th className="py-3.5 px-6">Supplier Partner</th>
                  <th className="py-3.5 px-6">Service / Event Date</th>
                  <th className="py-3.5 px-6">Amount / Deposit</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-taupe" />
                        <span>Loading bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((item, idx) => {
                    const hostName = item.consumer_name || 'Event Host';
                    const hostEmail = item.consumer_email || '';
                    const supplierName = item.supplier_business || item.supplier_name || 'Supplier Studio';
                    const serviceName = item.service_name || item.category || 'Event Service';
                    const eventDate = item.event_date || item.requested_date;
                    const quoteAmount = item.quote_amount || 0;
                    const depositAmount = item.deposit_amount || 0;
                    const status = (item.status || 'pending').toLowerCase();

                    return (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-stone-50/70 transition-colors group"
                      >
                        {/* Host */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-charcoal block truncate text-xs">
                            {hostName}
                          </span>
                          {hostEmail && (
                            <span className="text-[11px] text-stone-400 block truncate">
                              {hostEmail}
                            </span>
                          )}
                        </td>

                        {/* Supplier */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-charcoal block truncate text-xs">
                            {supplierName}
                          </span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {serviceName}
                          </span>
                        </td>

                        {/* Service / Event Date */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-charcoal flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-taupe" />
                            <span>{formatDate(eventDate)}</span>
                          </div>
                          {item.event_title && (
                            <span className="text-[11px] text-stone-400 block truncate mt-0.5">
                              {item.event_title}
                            </span>
                          )}
                        </td>

                        {/* Pricing */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-charcoal">
                            {quoteAmount > 0 ? formatCurrency(quoteAmount) : 'Quote Pending'}
                          </div>
                          {depositAmount > 0 && (
                            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                              Deposit: {formatCurrency(depositAmount)} (25%)
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'confirmed' || status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'declined' || status === 'rejected' || status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status === 'confirmed' || status === 'accepted' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : status === 'declined' || status === 'rejected' ? (
                              <XCircle className="w-3 h-3 text-rose-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-600" />
                            )}
                            <span>{status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
