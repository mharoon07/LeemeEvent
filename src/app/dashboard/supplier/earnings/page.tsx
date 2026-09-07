'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { supplierBookingsApi } from '@/lib/services/consumerApi';
import { TrendingUp, DollarSign, Download, CheckCircle2, RefreshCw, Calendar, Package } from 'lucide-react';

export default function SupplierEarningsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const data = await supplierBookingsApi.getMyRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load supplier earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const totalPipeline = requests.reduce((sum, r) => sum + Number(r.quote_amount || r.service?.base_price || 0), 0);
  const totalDeposits = requests.reduce((sum, r) => sum + Number(r.deposit_amount || (Number(r.quote_amount || r.service?.base_price || 0) * 0.2)), 0);

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'availability_confirmed' || s === 'accepted') return 'Accepted';
    if (s === 'declined' || s === 'rejected') return 'Declined';
    if (s === 'deposit_paid' || s === 'confirmed') return 'Deposit Secured';
    return 'Pending Inquiry';
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs tracking-wider uppercase text-taupe block font-semibold">
              Revenue Ledger • Synced with Database
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
              Earnings & Bookings Summary
            </h1>
          </div>

          <button
            onClick={loadEarnings}
            className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors self-start sm:self-auto"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs tracking-wider uppercase text-taupe font-semibold block">Total Pipeline Value</span>
            <span className="text-3xl font-bold text-charcoal font-mono">€{totalPipeline.toLocaleString()}</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs tracking-wider uppercase text-taupe font-semibold block">20% Escrow Deposits</span>
            <span className="text-3xl font-bold text-emerald-800 font-mono">€{Math.round(totalDeposits).toLocaleString()}</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs tracking-wider uppercase text-taupe font-semibold block">Payout Method</span>
            <span className="text-xs font-semibold text-charcoal block pt-2">Direct Bank Transfer / Digital Escrow</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-charcoal tracking-tight">Booking Inquiries & Secured Revenue</h3>
          {loading ? (
            <div className="py-12 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
              <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Loading ledger from Supabase...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-10 text-center space-y-2 shadow-soft-sm">
              <Package className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">No booking transactions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => {
                const creator = r.event?.creator;
                const hostName = creator?.full_name || creator?.email || 'Verified Host';
                const serviceName = r.service?.name || 'Custom Package';
                const date = r.requested_date || r.event?.event_date || 'Date TBD';
                const price = Number(r.quote_amount || r.service?.base_price || 0);
                const deposit = Number(r.deposit_amount || (price * 0.2));
                const status = getNormalizedStatus(r.status);

                return (
                  <div key={r.id} className="bg-white border border-stone-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-sm hover:border-taupe/40 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-charcoal">{serviceName}</h4>
                        <span className="text-xs text-stone-500">for {hostName}</span>
                      </div>
                      <span className="text-xs text-stone-500 block mt-0.5 font-mono">Event Date: {date}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-mono text-base font-bold text-charcoal block">€{price.toLocaleString()}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        Deposit: €{deposit.toLocaleString()} • {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
