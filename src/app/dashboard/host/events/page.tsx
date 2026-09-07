'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { eventsApi, suppliersApi, normalizeEventType } from '@/lib/services/consumerApi';
import { EventItem, EventType } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export default function MyEventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type_id: '',
    event_type: 'Wedding',
    event_date: '2026-10-15',
    city: 'Amsterdam',
    venue_name: '',
    guest_count: 100,
    estimated_budget: 25000,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [evList, etList] = await Promise.all([
        eventsApi.getEvents(),
        suppliersApi.getEventTypes(),
      ]);
      setEvents(evList);
      setEventTypes(etList);

      if (etList.length > 0 && !newEvent.event_type_id) {
        setNewEvent((prev) => ({
          ...prev,
          event_type_id: etList[0].id,
          event_type: etList[0].name,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [user?.id, user?.email, authLoading]);

  const handleDeleteEvent = async (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to remove this event?')) return;
    setDeletingId(eventId);
    try {
      await eventsApi.deleteEvent(eventId);
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err) {
      console.error('Failed to delete celebration', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllEvents = async () => {
    if (!confirm('Are you sure you want to remove all events?')) return;
    try {
      await eventsApi.clearAllEvents();
      for (const ev of events) {
        await eventsApi.deleteEvent(ev.id);
      }
      setEvents([]);
    } catch (err) {
      console.error('Failed to clear events', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        title: newEvent.title.trim(),
        name: newEvent.title.trim(),
        event_type_id: newEvent.event_type_id || undefined,
        event_type: newEvent.event_type,
        event_date: newEvent.event_date,
        date: newEvent.event_date,
        city: newEvent.city.trim(),
        venue_name: newEvent.venue_name?.trim() || undefined,
        guest_count: Number(newEvent.guest_count),
        estimated_budget: Number(newEvent.estimated_budget),
        status: 'planning',
      };

      const created = await eventsApi.createEvent(payload);

      // Add to list and close modal
      setEvents((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNewEvent({
        title: '',
        event_type_id: eventTypes[0]?.id || '',
        event_type: eventTypes[0]?.name || 'Wedding',
        event_date: '2026-10-15',
        city: 'Amsterdam',
        venue_name: '',
        guest_count: 100,
        estimated_budget: 25000,
      });

      // Refetch fresh from backend
      await fetchEvents();
    } catch (err: any) {
      console.error('Failed to create event in Supabase', err);
      setErrorMessage(
        err?.message ||
        err?.data?.message ||
        err?.data?.error ||
        'Failed to save event to database. Please make sure you are logged in and backend is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculation
  const totalEvents = events.length;
  const totalGuests = events.reduce((acc, ev) => acc + (ev.guest_count || 0), 0);
  const totalConfirmed = events.reduce((acc, ev) => acc + (ev.confirmed_count || 0), 0);

  return (
    <HostLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <span>Consumer Suite</span>
              <span>•</span>
              <span>Live Celebrations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Events Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage all your booked and planning celebrations directly with real Supabase database persistence.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {events.length > 0 && (
              <button
                onClick={handleClearAllEvents}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all flex items-center gap-1.5"
                title="Remove all events"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-[#FAF8F5] text-stone-600 shadow-soft-sm transition-all"
              title="Refresh from Backend"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-taupe' : ''}`} />
            </button>
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsModalOpen(true);
              }}
              className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Total Celebrations</span>
            <div className="text-2xl font-bold text-charcoal mt-1">{totalEvents} Events</div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">Live Database Synced</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Confirmed Suppliers</span>
            <div className="text-2xl font-bold text-taupe mt-1">{totalConfirmed} Booked</div>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5">Across all celebrations</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Total Guest Count</span>
            <div className="text-2xl font-bold text-charcoal mt-1">{totalGuests} Guests</div>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5">Total capacity</span>
          </div>
          <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-soft-sm">
            <span className="text-xs font-semibold text-stone-500 block">Platform Verification</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">100%</div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">Escrow protected</span>
          </div>
        </div>

        {/* EVENTS GRID */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-taupe mx-auto mb-3" />
            <p className="text-xs text-stone-500">Loading events from database...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-stone-200/90 rounded-3xl p-10 sm:p-14 text-center shadow-soft-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto shadow-soft-sm">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">No Celebrations Yet</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
              You haven&apos;t added any events yet. Create your celebration to begin tracking bookings, suppliers, and milestone schedules.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setIsModalOpen(true);
                }}
                className="btn-primary px-6 py-3 text-xs font-bold rounded-xl shadow-soft-sm hover:shadow-soft-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>+ Create Your First Event</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((ev) => {
              const confirmedCount = ev.confirmed_count ?? 0;
              const totalNeeded = ev.total_suppliers_needed ?? 6;
              const progressPercent = totalNeeded > 0 ? Math.min(100, Math.round((confirmedCount / totalNeeded) * 100)) : 0;
              const isDeleting = deletingId === ev.id;

              return (
                <div
                  key={ev.id}
                  className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-taupe/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all shadow-soft-sm relative flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Badges & Delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                        {normalizeEventType(ev.type || ev.event_type)}
                      </span>
                      <div className="flex items-center gap-2">
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
                        <button
                          onClick={(e) => handleDeleteEvent(ev.id, e)}
                          disabled={isDeleting}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove event"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title & Budget */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight group-hover:text-taupe transition-colors">
                        {ev.title}
                      </h2>
                      <span className="text-xs text-stone-500 block mt-1">
                        Estimated Budget:{' '}
                        <strong className="text-charcoal font-semibold">
                          €{ev.estimated_budget ? Number(ev.estimated_budget).toLocaleString() : '0'}
                        </strong>
                      </span>
                    </div>

                    {/* Metadata Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                        <CalendarDays className="w-4 h-4 text-taupe shrink-0" />
                        <span className="truncate">{ev.event_date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                        <MapPin className="w-4 h-4 text-taupe shrink-0" />
                        <span className="truncate">{ev.venue_name || ev.city || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3 py-2 text-xs text-stone-700">
                        <Users className="w-4 h-4 text-taupe shrink-0" />
                        <span>{ev.guest_count || 0} Guests</span>
                      </div>
                    </div>

                    {/* Supplier Progress Bar */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-charcoal flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {confirmedCount} of {totalNeeded} Suppliers Booked
                          </span>
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
                      <span>Browse Suppliers</span>
                    </Link>
                    <Link
                      href="/dashboard/host"
                      className="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 rounded-xl"
                    >
                      <span>Overview Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* New Event Card Trigger */}
            <button
              onClick={() => {
                setErrorMessage(null);
                setIsModalOpen(true);
              }}
              className="border-2 border-dashed border-stone-300 hover:border-taupe bg-white/70 hover:bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[300px] group shadow-soft-sm hover:shadow-soft-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-taupe/10 text-taupe group-hover:bg-charcoal group-hover:text-white flex items-center justify-center transition-all mb-3 shadow-soft-sm">
                <Plus className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-charcoal group-hover:text-taupe transition-colors">
                Plan Another Celebration
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mt-1.5 leading-relaxed">
                Add an anniversary, gala, wedding, or corporate event with real-time database tracking.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe mt-4 group-hover:underline">
                <span>Start Event Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        )}

        {/* CREATE EVENT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>POST /api/events</span>
                </div>
                <h2 className="text-2xl font-bold text-charcoal">Create New Celebration</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Persists your event directly into the Supabase database.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-bold">Database Error</p>
                    <p className="mt-0.5 leading-snug">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam's 30th Birthday Gala"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Event Type
                    </label>
                    <select
                      value={newEvent.event_type_id}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const matched = eventTypes.find((et) => et.id === selectedId);
                        setNewEvent({
                          ...newEvent,
                          event_type_id: selectedId,
                          event_type: matched?.name || 'Custom Celebration',
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
                    >
                      {eventTypes.length > 0 ? (
                        eventTypes.map((et) => (
                          <option key={et.id} value={et.id}>
                            {et.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="wedding">Wedding Celebration</option>
                          <option value="corporate">Corporate Gala</option>
                          <option value="birthday">Birthday / Anniversary</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amsterdam / London"
                      value={newEvent.city}
                      onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grand Estate (Optional)"
                      value={newEvent.venue_name}
                      onChange={(e) => setNewEvent({ ...newEvent, venue_name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newEvent.guest_count}
                      onChange={(e) => setNewEvent({ ...newEvent, guest_count: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Estimated Budget (€)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={newEvent.estimated_budget}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, estimated_budget: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <span>Save & Launch Event</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HostLayout>
  );
}
