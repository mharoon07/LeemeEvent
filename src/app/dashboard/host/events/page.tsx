'use client';

import React from 'react';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { CalendarDays, MapPin, Users, Plus, ChevronRight, Sparkles } from 'lucide-react';

export default function MyEventsPage() {
  const events = [
    {
      id: 'ev_1',
      name: "Eleanor & Liam's Wedding",
      type: "Wedding",
      date: "September 18, 2026",
      location: "Cotswolds, UK",
      guests: 120,
      status: "Active",
      confirmedCount: 3,
    },
    {
      id: 'ev_2',
      name: "Grand Opening Gala",
      type: "Corporate",
      date: "December 05, 2026",
      location: "London, UK",
      guests: 200,
      status: "Planning",
      confirmedCount: 1,
    },
  ];

  return (
    <HostLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
              My Celebrations
            </span>
            <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
              Events Dashboard
            </h1>
          </div>

          <Link
            href="/dashboard/host/onboarding"
            className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-sand" />
            <span>Create New Event</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 space-y-4 hover:border-taupe/40 transition-all shadow-soft-sm relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold bg-taupe/10 px-3 py-1 rounded-full">
                  {ev.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {ev.status}
                </span>
              </div>

              <div>
                <h3 className="font-classico text-2xl uppercase font-semibold text-charcoal">
                  {ev.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-charcoal/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-taupe" />
                  <span>{ev.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-taupe" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-taupe" />
                  <span>{ev.guests} Guests</span>
                </div>
              </div>

              <div className="pt-4 border-t border-taupe/15 flex items-center justify-between">
                <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold">
                  {ev.confirmedCount} Suppliers Confirmed
                </span>
                <Link
                  href="/dashboard/host"
                  className="btn-secondary px-4 py-2 text-xs inline-flex items-center gap-1"
                >
                  <span>Manage Event</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HostLayout>
  );
}
