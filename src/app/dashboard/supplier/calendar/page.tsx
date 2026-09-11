'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { supplierPortalApi } from '@/lib/services/consumerApi';
import { SupplierAvailability } from '@/types/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Ban,
  Clock,
  Sparkles,
  Info,
  X,
  RefreshCw,
  AlertCircle,
  Check,
  Filter,
  CalendarCheck,
  Tag,
  Trash2,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const QUICK_TAGS = [
  { label: '💍 Wedding', text: 'Wedding Event' },
  { label: '🎉 Birthday Party', text: 'Birthday Celebration' },
  { label: '🏢 Corporate', text: 'Corporate Function' },
  { label: '🏖️ Day Off', text: 'Personal Day Off / Vacation' },
  { label: '🔧 Maintenance', text: 'Equipment & Venue Maintenance' },
];

export default function SupplierCalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [availabilityList, setAvailabilityList] = useState<SupplierAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'booked' | 'blocked' | 'tentative'>('all');

  // Selected date modal state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<'available' | 'booked' | 'blocked' | 'tentative'>('available');
  const [modalNotes, setModalNotes] = useState('');
  const [modalSaving, setModalSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Client side mounting flag for Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedDate) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (originalPaddingRight > 0) {
        document.body.style.paddingRight = `${originalPaddingRight}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedDate(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedDate]);

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
    setCurrentDate(new Date());
  };

  // Calendar Calculation
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const availabilityMap = new Map<string, SupplierAvailability>();
  availabilityList.forEach((item) => {
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
        notes: modalNotes.trim(),
      });

      // Optimistic update
      const updatedList = availabilityList.filter((a) => a.date !== selectedDate);
      updatedList.push({
        date: selectedDate,
        status: modalStatus,
        notes: modalNotes.trim(),
      });
      setAvailabilityList(updatedList);
      setSelectedDate(null);
      showNotification('success', `Availability for ${selectedDate} updated successfully!`);
    } catch (err: any) {
      showNotification('error', `Failed to update date availability: ${err?.message || 'Server error'}`);
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
      showNotification('success', `Reset ${selectedDate} back to default available status.`);
    } catch (err: any) {
      showNotification('error', `Failed to reset date: ${err?.message || 'Server error'}`);
    } finally {
      setModalSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Stats for current month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = availabilityList.filter((a) => a.date?.startsWith(currentMonthPrefix));
  const bookedCount = monthRecords.filter((a) => a.status === 'booked').length;
  const blockedCount = monthRecords.filter((a) => a.status === 'blocked').length;
  const tentativeCount = monthRecords.filter((a) => a.status === 'tentative').length;
  const availableCount = Math.max(0, daysInMonth - bookedCount - blockedCount - tentativeCount);

  // Today string for highlighting
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const formattedSelectedDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <SupplierLayout>
      <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10">
        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-[9999] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border ${
                notification.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : 'bg-rose-900 text-white border-rose-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
              )}
              <span className="text-xs font-semibold">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Real-Time Availability
              </span>
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Marketplace Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Interactive Availability & Calendar
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Manage your availability, block vacation days, and log booked events. Event hosts browsing your profile see instant updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-950">{availableCount} Available</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-rose-950">{bookedCount} Booked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 border border-stone-300 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <span className="font-semibold text-stone-800">{blockedCount} Blocked</span>
            </div>
            {tentativeCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-amber-950">{tentativeCount} Pending</span>
              </div>
            )}
            <button
              onClick={loadAvailability}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors ml-auto sm:ml-1"
              title="Refresh Calendar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-taupe' : ''}`} />
            </button>
          </div>
        </div>

        {/* Interactive Calendar Body */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-7 shadow-soft-sm space-y-6">
          {/* Navigation Bar & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
                  {MONTH_NAMES[month]} <span className="font-light text-stone-400">{year}</span>
                </h2>
              </div>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-charcoal transition-colors ml-2"
              >
                Today
              </button>
            </div>

            {/* Navigation buttons & Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-stone-100/80 p-1 rounded-2xl border border-stone-200 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    activeFilter === 'all'
                      ? 'bg-white text-charcoal shadow-sm font-bold'
                      : 'text-stone-500 hover:text-charcoal'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('booked')}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    activeFilter === 'booked'
                      ? 'bg-rose-100 text-rose-900 shadow-sm font-bold'
                      : 'text-stone-500 hover:text-charcoal'
                  }`}
                >
                  Booked
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('blocked')}
                  className={`px-2.5 py-1 rounded-xl transition-all ${
                    activeFilter === 'blocked'
                      ? 'bg-stone-200 text-stone-900 shadow-sm font-bold'
                      : 'text-stone-500 hover:text-charcoal'
                  }`}
                >
                  Blocked
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-charcoal transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-charcoal transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-bold text-stone-400 uppercase tracking-wider pb-2 border-b border-stone-100">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {/* Prev month days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayIndex + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="min-h-[75px] sm:min-h-[105px] p-1.5 sm:p-2.5 rounded-2xl bg-stone-50/40 border border-stone-100 text-stone-300 opacity-40 cursor-not-allowed select-none flex flex-col justify-between"
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
              const isToday = dateStr === todayStr;

              // Filter Dimming Logic
              const isFilteredOut =
                activeFilter !== 'all' &&
                ((activeFilter === 'booked' && status !== 'booked') ||
                  (activeFilter === 'blocked' && status !== 'blocked') ||
                  (activeFilter === 'available' && status !== 'available') ||
                  (activeFilter === 'tentative' && status !== 'tentative'));

              let statusBg = 'bg-emerald-50/20 hover:bg-emerald-50/50 border-stone-200/80 text-charcoal';
              let badgeColor = 'bg-emerald-100/80 text-emerald-800 border-emerald-200';
              let badgeText = 'Available';

              if (status === 'booked') {
                statusBg = 'bg-rose-50/80 border-rose-200 text-rose-950 hover:bg-rose-100/80';
                badgeColor = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
                badgeText = 'Booked';
              } else if (status === 'blocked') {
                statusBg = 'bg-stone-100 border-stone-300/90 text-stone-700 hover:bg-stone-200/70';
                badgeColor = 'bg-stone-200 text-stone-700 border-stone-300 font-bold';
                badgeText = 'Blocked';
              } else if (status === 'tentative') {
                statusBg = 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100/80';
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
                badgeText = 'Pending';
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateClick(dateStr)}
                  className={`min-h-[75px] sm:min-h-[105px] p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-soft-sm hover:-translate-y-0.5 active:translate-y-0 ${statusBg} ${
                    isToday ? 'ring-2 ring-taupe border-taupe/80 shadow-md' : ''
                  } ${isFilteredOut ? 'opacity-30' : 'opacity-100'}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs sm:text-sm font-bold tracking-tight ${isToday ? 'text-taupe' : ''}`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-taupe text-white font-bold uppercase leading-tight">
                          Today
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-semibold border truncate max-w-[65px] sm:max-w-none ${badgeColor}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {notes ? (
                    <p className="text-[9px] sm:text-[10px] text-stone-600 line-clamp-2 leading-tight font-medium mt-1">
                      {notes}
                    </p>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-stone-400 group-hover:text-charcoal transition-colors">
                      + Edit
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Legend Bar */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-charcoal">Status Key:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available (Open)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Booked (Reserved)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                <span>Blocked (Day Off)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Tentative (Inquiry)</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-400">
              Click any date to edit availability & notes
            </div>
          </div>
        </div>

        {/* FULL 100VH REACT PORTAL POPUP MODAL */}
        {mounted &&
          selectedDate &&
          createPortal(
            <div
              className="fixed inset-0 z-[99999] w-screen h-[100dvh] min-h-screen bg-charcoal/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedDate(null);
              }}
            >
              <div
                className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-stone-200/90 flex items-center justify-between bg-gradient-to-r from-stone-50 to-stone-100/60 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm shrink-0">
                      <CalendarIcon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-charcoal leading-tight">
                        Manage Date Availability
                      </h2>
                      <span className="text-xs text-taupe font-semibold block mt-0.5">
                        {formattedSelectedDate}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="p-2 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-200/80 transition-all"
                    title="Close popup"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSaveDateStatus} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
                  {/* Select Status Cards */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5 block">
                      Select Date Status *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                      {/* Available Card */}
                      <button
                        type="button"
                        onClick={() => setModalStatus('available')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                          modalStatus === 'available'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 font-bold shadow-sm'
                            : 'bg-stone-50/80 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {modalStatus === 'available' && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold">Available</span>
                        <span className="text-[10px] text-stone-400 leading-tight">Open for hosts</span>
                      </button>

                      {/* Booked Card */}
                      <button
                        type="button"
                        onClick={() => setModalStatus('booked')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                          modalStatus === 'booked'
                            ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/20 font-bold shadow-sm'
                            : 'bg-stone-50/80 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {modalStatus === 'booked' && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                        )}
                        <CalendarCheck className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold">Booked</span>
                        <span className="text-[10px] text-stone-400 leading-tight">Reserved event</span>
                      </button>

                      {/* Blocked Card */}
                      <button
                        type="button"
                        onClick={() => setModalStatus('blocked')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                          modalStatus === 'blocked'
                            ? 'bg-stone-200 border-stone-500 text-stone-900 ring-2 ring-stone-400/20 font-bold shadow-sm'
                            : 'bg-stone-50/80 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {modalStatus === 'blocked' && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-stone-500" />
                        )}
                        <Ban className="w-5 h-5 text-stone-600 shrink-0" />
                        <span className="text-xs font-bold">Blocked</span>
                        <span className="text-[10px] text-stone-400 leading-tight">Day off / Closed</span>
                      </button>

                      {/* Tentative Card */}
                      <button
                        type="button"
                        onClick={() => setModalStatus('tentative')}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                          modalStatus === 'tentative'
                            ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 font-bold shadow-sm'
                            : 'bg-stone-50/80 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {modalStatus === 'tentative' && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                        )}
                        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="text-xs font-bold">Tentative</span>
                        <span className="text-[10px] text-stone-400 leading-tight">Hold / Inquiry</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Schedule Notes & Event Details
                      </label>
                      <span className="text-[11px] text-stone-400">Quick fill:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {QUICK_TAGS.map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => {
                            if (modalNotes) {
                              setModalNotes(`${modalNotes} | ${tag.text}`);
                            } else {
                              setModalNotes(tag.text);
                            }
                          }}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors border border-stone-200/80"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={modalNotes}
                      onChange={(e) => setModalNotes(e.target.value)}
                      placeholder="e.g. Wedding Catering 150 guests at Villa Rosa, or Personal Vacation Day..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-taupe/20 focus:border-taupe resize-none transition-all"
                    />
                  </div>

                  {/* Marketplace Sync Notice */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      When marked as <strong>Booked</strong> or <strong>Blocked</strong>, consumers browsing this date in the marketplace will be notified that you are unavailable.
                    </span>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
                    {availabilityMap.has(selectedDate) ? (
                      <button
                        type="button"
                        onClick={handleClearDateStatus}
                        disabled={modalSaving}
                        className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset Date</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(null)}
                        disabled={modalSaving}
                        className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={modalSaving}
                        className="px-6 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors flex items-center gap-2 disabled:opacity-50 shadow-soft-sm"
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
            </div>,
            document.body
          )}
      </div>
    </SupplierLayout>
  );
}
