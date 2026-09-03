'use client';

import React from 'react';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function MyEventsPage() {
  const events = [
    {
      id: 'ev_1',
      name: "Eleanor & Liam's Wedding",
      type: 'Wedding',
      date: 'September 18, 2026',
      location: 'Cotswolds, UK',
      guests: 120,
      status: 'Active',
      confirmedCount: 3,
      totalSuppliersNeeded: 8,
      budget: '$28,500',
    },
    {
      id: 'ev_2',
      name: 'Grand Opening Gala',
      type: 'Corporate',
      date: 'December 05, 2026',
      location: 'Mayfair, London, UK',
      guests: 200,
      status: 'Planning',
      confirmedCount: 1,
      totalSuppliersNeeded: 6,
      budget: '$45,000',
    },
  ];

  return (
    <HostLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <span>Host Portal</span>
              <span>•</span>
              <span>Active Celebrations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Events Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage your celebrations, track confirmed suppliers, and monitor booking milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/host/onboarding"
              className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Total Celebrations</span>
            <div className="text-2xl font-bold text-charcoal mt-1">2 Events</div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">1 Active • 1 Planning</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Confirmed Suppliers</span>
            <div className="text-2xl font-bold text-taupe mt-1">4 Booked</div>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5">Across both celebrations</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Total Guest Count</span>
            <div className="text-2xl font-bold text-charcoal mt-1">320 Guests</div>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5">RSVPs tracked</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Overall Progress</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">40%</div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">On track for 2026</span>
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((ev) => {
            const progressPercent = Math.round((ev.confirmedCount / ev.totalSuppliersNeeded) * 100);
            return (
              <div
                key={ev.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-taupe/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all shadow-soft-sm relative flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                      {ev.type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        ev.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                        }`}
                      />
                      <span>{ev.status}</span>
                    </span>
                  </div>

                  {/* Title & Budget */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight group-hover:text-taupe transition-colors">
                      {ev.name}
                    </h2>
                    <span className="text-xs text-stone-500 block mt-1">
                      Estimated Budget: <strong className="text-charcoal font-semibold">{ev.budget}</strong>
                    </span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                      <CalendarDays className="w-4 h-4 text-taupe shrink-0" />
                      <span className="truncate">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                      <MapPin className="w-4 h-4 text-taupe shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                      <Users className="w-4 h-4 text-taupe shrink-0" />
                      <span>{ev.guests} Guests</span>
                    </div>
                  </div>

                  {/* Supplier Progress Bar */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ev.confirmedCount} of {ev.totalSuppliersNeeded} Suppliers Booked</span>
                      </span>
                      <span className="font-bold text-taupe">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-taupe to-charcoal rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
                  <Link
                    href="/dashboard/host/browse"
                    className="text-xs font-semibold text-taupe hover:text-charcoal transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore Suppliers</span>
                  </Link>
                  <Link
                    href="/dashboard/host"
                    className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 rounded-xl"
                  >
                    <span>Manage Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* New Event Card Callout */}
          <Link
            href="/dashboard/host/onboarding"
            className="border-2 border-dashed border-stone-300 hover:border-taupe bg-white/70 hover:bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[300px] group shadow-soft-sm hover:shadow-soft-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-taupe/10 text-taupe group-hover:bg-charcoal group-hover:text-white flex items-center justify-center transition-all mb-3 shadow-soft-sm">
              <Plus className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-charcoal group-hover:text-taupe transition-colors">
              Plan Another Celebration
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mt-1.5 leading-relaxed">
              Add an anniversary, rehearsal dinner, or corporate retreat to your host portfolio.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe mt-4 group-hover:underline">
              <span>Start Event Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </HostLayout>
  );
}
