'use client';

import React from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Star, Lock } from 'lucide-react';

export default function SupplierReviewsPage() {
  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Reputation & Ratings
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Client Reviews & Ratings
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-12 text-center space-y-6 shadow-soft-sm">
          <div className="w-16 h-16 rounded-full bg-taupe/10 text-taupe flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 fill-taupe" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-classico tracking-wider uppercase font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Phase 2 Feature Roadmap</span>
          </div>

          <h2 className="font-classico text-2xl uppercase font-semibold text-charcoal">
            Verified Review Management
          </h2>

          <p className="text-sm text-charcoal/70 leading-relaxed max-w-md mx-auto font-sans">
            Verified client testimonials, star ratings, and response options will unlock after your first completed booking on LEEMEVENT.
          </p>
        </div>
      </div>
    </SupplierLayout>
  );
}
