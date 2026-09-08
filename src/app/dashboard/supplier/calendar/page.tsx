'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { supplierPortalApi } from '@/lib/services/consumerApi';
import { SupplierAvailability } from '@/types/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Ban,
  Clock,
  Sparkles,
  Info,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
  Filter,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SupplierCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sept 2026 default
  const [availabilityList, setAvailabilityList] = useState<SupplierAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected date modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<'available' | 'booked' | 'blocked' | 'tentative'>('available');
  const [modalNotes, setModalNotes] = useState('');
  const [modalSaving, setModalSaving] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await supplierPortalApi.getAvailability();
      setAvailabilityList(data || []);
    } catch (err) {
      console.error('Failed to load availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [currentDate]);

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 1));
  };

  // Calendar Calculation
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const availabilityMap = new Map<string, SupplierAvailability>();
  availabilityList.forEach((item) => {
    // Normalise date string YYYY-MM-DD
    const dStr = item.date ? item.date.split('T')[0] : '';
    if (dStr) availabilityMap.set(dStr, item);
  });

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    const existing = availabilityMap.get(dateStr);
    if (existing) {
      setModalStatus(existing.status || 'available');
      setModalNotes(existing.notes || '');
    } else {
      setModalStatus('available');
      setModalNotes('');
    }
  };

  const handleSaveDateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    try {
      setModalSaving(true);
      await supplierPortalApi.setAvailability({
        date: selectedDate,
        status: modalStatus,
        notes: modalNotes,
      });

      // Optimistic update
      const updatedList = availabilityList.filter((a) => a.date !== selectedDate);
      updatedList.push({
        date: selectedDate,
        status: modalStatus,
        notes: modalNotes,
      });
      setAvailabilityList(updatedList);
      setSelectedDate(null);
    } catch (err: any) {
      alert(`Failed to update date availability: ${err?.message || 'Server error'}`);
    } finally {
      setModalSaving(false);
    }
  };

  const handleClearDateStatus = async () => {
    if (!selectedDate) return;

    try {
      setModalSaving(true);
      await supplierPortalApi.deleteAvailability(selectedDate);
      setAvailabilityList(availabilityList.filter((a) => a.date !== selectedDate));
      setSelectedDate(null);
    } catch (err: any) {
      alert(`Failed to reset date: ${err?.message || 'Server error'}`);
    } finally {
      setModalSaving(false);
    }
  };

  // Stats for current month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = availabilityList.filter((a) => a.date?.startsWith(currentMonthPrefix));
  const bookedCount = monthRecords.filter((a) => a.status === 'booked').length;
  const blockedCount = monthRecords.filter((a) => a.status === 'blocked').length;
  const availableOverrides = monthRecords.filter((a) => a.status === 'available').length;

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Real-Time Availability
              </span>
              <span className="text-xs text-stone-500 font-medium">Supabase Synchronized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Interactive Availability & Calendar
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Click on any date to toggle your status between Available, Booked, or Blocked. Event hosts in the marketplace see real-time availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-charcoal">{daysInMonth - bookedCount - blockedCount} Available</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-charcoal">{bookedCount} Booked</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <span className="font-semibold text-charcoal">{blockedCount} Blocked</span>
            </div>
            <button
              onClick={loadAvailability}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors ml-1"
              title="Refresh Calendar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Calendar Body */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
                {MONTH_NAMES[month]} <span className="font-light text-stone-500">{year}</span>
              </h2>
              <button
                onClick={handleToday}
                className="px-3 py-1 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* Prev month days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="min-h-[85px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-2xl bg-stone-50/50 border border-stone-100 text-stone-300 opacity-40 cursor-not-allowed select-none"
                >
                  <span className="text-xs font-bold">{dayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const record = availabilityMap.get(dateStr);
              const status = record?.status || 'available';
              const notes = record?.notes;

              let statusBg = 'bg-stone-50 hover:bg-stone-100/80 border-stone-200/70 text-charcoal';
              let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              let badgeText = 'Available';

              if (status === 'booked') {
                statusBg = 'bg-rose-50/70 border-rose-200/90 text-rose-950 hover:bg-rose-100/80';
                badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                badgeText = 'Booked';
              } else if (status === 'blocked') {
                statusBg = 'bg-stone-100 border-stone-300/80 text-stone-600 hover:bg-stone-200/70';
                badgeColor = 'bg-stone-200 text-stone-700 border-stone-300';
                badgeText = 'Blocked';
              } else if (status === 'tentative') {
                statusBg = 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100/80';
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                badgeText = 'Pending';
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  className={`min-h-[85px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-soft-sm ${statusBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {dayNum}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-semibold border ${badgeColor}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {notes ? (
                    <p className="text-[10px] text-stone-600 line-clamp-2 leading-tight font-medium mt-1">
                      {notes}
                    </p>
                  ) : (
                    <span className="text-[10px] text-stone-400 group-hover:text-charcoal transition-colors">
                      + Edit status
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DATE AVAILABILITY MODAL POPUP */}
        {selectedDate && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedDate(null);
            }}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-charcoal">
                      Manage Date Availability
                    </h2>
                    <span className="text-[11px] text-stone-500 font-semibold font-mono">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveDateStatus} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-charcoal mb-2 block">
                    Select Date Status *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalStatus('available')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        modalStatus === 'available'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs">Available</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalStatus('booked')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        modalStatus === 'booked'
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Check className="w-5 h-5 text-rose-600" />
                      <span className="text-xs">Booked</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalStatus('blocked')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        modalStatus === 'blocked'
                          ? 'bg-stone-200 border-stone-500 text-stone-900 ring-2 ring-stone-400/20 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Ban className="w-5 h-5 text-stone-600" />
                      <span className="text-xs">Blocked</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal mb-1.5 block">
                    Schedule Notes & Event Details
                  </label>
                  <textarea
                    rows={3}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="e.g. Wedding Catering 150 guests at Villa Rosa, or Personal Vacation Day..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-taupe resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    When marked as <strong>Booked</strong> or <strong>Blocked</strong>, consumers browsing this date will be informed that you are unavailable.
                  </span>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                  {availabilityMap.has(selectedDate) ? (
                    <button
                      type="button"
                      onClick={handleClearDateStatus}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Reset to Default
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalSaving}
                      className="px-6 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {modalSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Save Schedule</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
