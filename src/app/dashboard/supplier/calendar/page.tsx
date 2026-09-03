'use client';

import React, { useState } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Calendar as CalendarIcon, Check, Lock, RefreshCw, AlertCircle } from 'lucide-react';

export default function SupplierCalendarPage() {
  const [blackouts, setBlackouts] = useState(['2026-09-25', '2026-10-15']);
  const [newBlackout, setNewBlackout] = useState('');

  const addBlackout = () => {
    if (newBlackout && !blackouts.includes(newBlackout)) {
      setBlackouts([...blackouts, newBlackout]);
      setNewBlackout('');
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Availability Manager
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Calendar & Blackout Dates
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 space-y-6 shadow-soft-sm">
          <div className="flex items-center justify-between border-b border-taupe/15 pb-4">
            <div>
              <h3 className="font-classico text-lg uppercase font-bold text-charcoal">Google Calendar Sync</h3>
              <p className="text-xs text-charcoal/70">Sync live bookings automatically to prevent double-booking.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-classico uppercase tracking-wider font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Phase 2 Sync</span>
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="font-classico text-base uppercase font-semibold text-charcoal">Blackout Unavailable Dates</h4>
            <div className="flex gap-3 max-w-sm">
              <input
                type="date"
                value={newBlackout}
                onChange={(e) => setNewBlackout(e.target.value)}
                className="flex-1 bg-sand border border-taupe/20 rounded-xl px-3.5 py-2 text-xs text-charcoal"
              />
              <button
                type="button"
                onClick={addBlackout}
                className="btn-primary px-4 py-2 text-xs font-classico uppercase tracking-wider"
              >
                + Block Date
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {blackouts.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-2"
                >
                  <span>Blocked: {d}</span>
                  <button
                    onClick={() => setBlackouts(blackouts.filter((b) => b !== d))}
                    className="hover:text-red-950 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
