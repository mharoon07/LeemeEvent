'use client';

import React from 'react';
import HostLayout from '@/components/dashboard/HostLayout';
import { Users, UserPlus, Sparkles, Lock } from 'lucide-react';

export default function HostTeamPage() {
  return (
    <HostLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Co-Planning & Collaboration
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Planning & Team
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-soft-sm">
          <div className="w-16 h-16 rounded-full bg-taupe/10 text-taupe flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-classico tracking-wider uppercase font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Phase 2 Feature Roadmap</span>
          </div>

          <h2 className="font-classico text-2xl uppercase font-semibold text-charcoal">
            Invite Co-Planners & Family
          </h2>

          <p className="text-sm text-charcoal/70 leading-relaxed max-w-md mx-auto font-sans">
            Collaborate on guest counts, supplier selections, and budget approvals with your partner, wedding planner, or family member in real time.
          </p>

          <div className="pt-4">
            <button disabled className="btn-primary px-8 py-3 text-xs opacity-50 cursor-not-allowed inline-flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-sand" />
              <span>Invite Co-Planner (Coming Soon)</span>
            </button>
          </div>
        </div>
      </div>
    </HostLayout>
  );
}
