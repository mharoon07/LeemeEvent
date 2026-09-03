'use client';

import React from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { CreditCard, Lock, Sparkles } from 'lucide-react';

export default function SupplierSubscriptionPage() {
  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Partner Tiers
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Subscription & Membership Plan
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-12 text-center space-y-6 shadow-soft-sm">
          <div className="w-16 h-16 rounded-full bg-taupe/10 text-taupe flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-classico tracking-wider uppercase font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Phase 2 Feature Roadmap</span>
          </div>

          <h2 className="font-classico text-2xl uppercase font-semibold text-charcoal">
            Current Tier: Verified Founding Partner (Free)
          </h2>

          <p className="text-sm text-charcoal/70 leading-relaxed max-w-md mx-auto font-sans">
            Early verified suppliers receive 100% free lead matching and zero commission fees during the LEEMEVENT launch period.
          </p>
        </div>
      </div>
    </SupplierLayout>
  );
}
