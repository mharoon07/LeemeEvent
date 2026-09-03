'use client';

import React from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { TrendingUp, DollarSign, Download, CheckCircle2 } from 'lucide-react';

export default function SupplierEarningsPage() {
  const earnings = [
    { client: 'Eleanor & Liam', date: 'Sept 18, 2026', gross: '$2,200', deposit: '$660 Paid', status: 'Deposit Secured' },
    { client: 'Sophie & James', date: 'Nov 02, 2026', gross: '$1,850', deposit: '$555 Paid', status: 'Deposit Secured' },
    { client: 'Château Corporate Event', date: 'Dec 12, 2026', gross: '$4,200', deposit: '$1,260 Pending', status: 'Invoiced' },
  ];

  return (
    <SupplierLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Revenue Ledger
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Earnings & Bookings Summary
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold block">Total Pipeline Value</span>
            <span className="font-classico text-3xl font-bold text-charcoal">$8,250</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold block">Deposits Secured</span>
            <span className="font-classico text-3xl font-bold text-emerald-800">$1,215</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-6 space-y-1 shadow-soft-sm">
            <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold block">Payout Method</span>
            <span className="text-xs font-semibold text-charcoal block pt-2">Direct Bank Transfer (Stripe Connect)</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-classico text-xl uppercase font-semibold text-charcoal">Confirmed Booking Revenue</h3>
          <div className="space-y-3">
            {earnings.map((e, i) => (
              <div key={i} className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 flex items-center justify-between shadow-soft-sm">
                <div>
                  <h4 className="font-classico text-base uppercase font-bold text-charcoal">{e.client}</h4>
                  <span className="text-xs text-charcoal/70 block">{e.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-taupe block">{e.gross}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">{e.deposit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
