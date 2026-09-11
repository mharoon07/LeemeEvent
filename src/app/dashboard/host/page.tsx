


'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import HostLayout from '@/components/dashboard/HostLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  eventsApi,
  contractsApi,
  paymentsApi,
  suppliersApi,
  bookingsApi,
  decodeServiceDescription,
  normalizeCategory,
  normalizeEventType,
  notificationsApi,
} from '@/lib/services/consumerApi';
import { EventItem, ContractItem, PaymentItem, EventType } from '@/types/api';
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Search,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  FileCode,
  CreditCard,
  Activity,
  ArrowRight,
  PenTool,
  Loader2,
  Calendar,
  X,
  AlertCircle,
  Building,
  Utensils,
  Camera,
  Music,
  Palette,
  Cake,
  Trash2,
  Package,
  Building2,
  Tag,
  Info,
  Check,
} from 'lucide-react';

export default function HostDashboardHome() {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Create Event Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type_id: '',
    event_type: 'Wedding Celebration',
    event_date: '2026-10-15',
    city: 'Amsterdam',
    venue_name: '',
    description: '',
    guest_count: 100,
    estimated_budget: 25000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isCreateModalOpen]);

  const loadData = async () => {
    if (authLoading) return;
    if (!user?.id && !user?.email) {
      setEvents([]);
      setContracts([]);
      setPayments([]);
      setBookings([]);
      setSelectedEventId('');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [evList, cntList, payList, etList, bookList] = await Promise.all([
        eventsApi.getEvents(),
        contractsApi.getContracts(),
        paymentsApi.getPayments(),
        suppliersApi.getEventTypes(),
        bookingsApi.getMyBookings(),
      ]);

      setEvents(evList || []);
      if (evList && evList.length > 0) {
        if (!selectedEventId || !evList.some((e: any) => e.id === selectedEventId)) {
          setSelectedEventId(evList[0].id);
        }
      } else {
        setSelectedEventId('');
      }

      setContracts(cntList || []);
      setPayments(payList || []);
      setEventTypes(etList || []);
      setBookings(bookList || []);

      if (etList && etList.length > 0 && !newEvent.event_type_id) {
        setNewEvent((prev) => ({
          ...prev,
          event_type_id: etList[0].id,
          event_type: etList[0].name,
        }));
      }
    } catch (e) {
      console.error('Failed to load overview data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [user?.id, user?.email, authLoading]);

  // Determine active event
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0] || null;

  // Real countdown calculation
  const calculateDaysRemaining = (dateStr?: string): number => {
    if (!dateStr) return 0;
    try {
      const target = new Date(dateStr).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  const daysRemaining = calculateDaysRemaining(activeEvent?.event_date);

  // Real calculations
  const signedContracts = contracts.filter((c) => c.status === 'signed');
  const pendingContracts = contracts.filter((c) => c.status !== 'signed');

  const committedBudgetNum = signedContracts.reduce((acc, c) => acc + (c.total_amount || 0), 0);
  const totalBudgetNum = activeEvent?.estimated_budget ? Number(activeEvent.estimated_budget) : 0;
  const remainingBudgetNum = Math.max(0, totalBudgetNum - committedBudgetNum);
  const escrowLockedNum = payments.reduce((acc, p) => acc + (p.amount || 0), 0) || Math.round(committedBudgetNum * 0.25);

  const confirmedCount = signedContracts.length > 0 ? signedContracts.length : (activeEvent?.confirmed_count ?? 0);
  const totalNeeded = activeEvent?.total_suppliers_needed ?? (signedContracts.length > 0 ? signedContracts.length : 6);
  const progressPercent = totalNeeded > 0 ? Math.min(100, Math.round((confirmedCount / totalNeeded) * 100)) : 0;

  const hostName = user?.name || user?.email?.split('@')[0] || 'Valued Host';

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Category coverage check
  const hasCategoryContract = (categoryKeywords: string[]) => {
    return signedContracts.some((c) => {
      const cat = normalizeCategory(c.category).toLowerCase();
      return categoryKeywords.some((k) => cat.includes(k.toLowerCase()));
    });
  };

  const coreServices = [
    { name: 'Venue & Location', icon: Building, booked: hasCategoryContract(['venue', 'location', 'estate']) },
    { name: 'Catering & Dining', icon: Utensils, booked: hasCategoryContract(['cater', 'food', 'dining']) },
    { name: 'Photo & Cinema', icon: Camera, booked: hasCategoryContract(['photo', 'cinema', 'media']) },
    { name: 'Music & DJ', icon: Music, booked: hasCategoryContract(['music', 'dj', 'band', 'sound']) },
    { name: 'Floral & Decor', icon: Palette, booked: hasCategoryContract(['floral', 'decor', 'flower']) },
    { name: 'Patisserie & Cake', icon: Cake, booked: hasCategoryContract(['cake', 'patisserie', 'dessert']) },
  ];

  // Dynamic real activity log derived from user state
  const realActivities: Array<{ id: string; title: string; desc: string; time: string; type: string }> = [];

  if (activeEvent) {
    realActivities.push({
      id: `act_ev_${activeEvent.id}`,
      title: `Celebration Active: ${activeEvent.title}`,
      desc: `${normalizeEventType(activeEvent.type || activeEvent.event_type)} scheduled for ${activeEvent.event_date || 'Date TBD'} with ${activeEvent.guest_count || 0} guests in ${activeEvent.city || 'TBD'}.`,
      time: 'Active Planning',
      type: 'event',
    });
  }

  signedContracts.forEach((c) => {
    realActivities.push({
      id: `act_cnt_${c.id}`,
      title: `Agreement Signed: ${c.supplier_name}`,
      desc: `${c.title} (€${c.total_amount.toLocaleString()}) confirmed with 25% Escrow Protection guarantee.`,
      time: c.signed_at ? new Date(c.signed_at).toLocaleDateString() : 'Confirmed',
      type: 'contract',
    });
  });

  payments.forEach((p) => {
    realActivities.push({
      id: `act_pay_${p.id}`,
      title: `Escrow Deposit Placed (€${p.amount.toLocaleString()})`,
      desc: `Ref: ${p.transaction_ref} securely held under LEEMEVENTS Escrow Guarantee.`,
      time: p.created_at || 'Recent',
      type: 'payment',
    });
  });

  // Handle Event Delete from Overview
  const handleDeleteSelectedEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to remove this event?')) return;
    try {
      await eventsApi.deleteEvent(eventId);
      const updated = events.filter((e) => e.id !== eventId);
      setEvents(updated);
      if (selectedEventId === eventId) {
        setSelectedEventId(updated[0]?.id || '');
      }
      await loadData();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  // Handle Event Creation from Overview Modal
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    setCreatingEvent(true);
    setCreateError(null);

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
        description: newEvent.description?.trim() || undefined,
        guest_count: Number(newEvent.guest_count),
        estimated_budget: Number(newEvent.estimated_budget),
        status: 'planning',
      };

      const created = await eventsApi.createEvent(payload);

      // Trigger notification for verified suppliers in the marketplace
      try {
        notificationsApi.addNotification('supplier', {
          title: `🎉 New Host Celebration in ${created.city || 'your area'}`,
          desc: `${user?.name || 'A host client'} created "${created.title}" with €${Number(created.estimated_budget || 25000).toLocaleString()} budget (${created.guest_count || 100} guests).`,
          type: 'event',
          link: '/dashboard/supplier/leads',
          metadata: { event_id: created.id },
        });

        notificationsApi.addNotification('host', {
          title: `🎉 Celebration "${created.title}" Published`,
          desc: `Your celebration in ${created.city || 'your area'} is live in the vendor marketplace.`,
          type: 'event',
          link: '/dashboard/host/events',
          metadata: { event_id: created.id },
        });
      } catch {}

      setEvents((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      setSelectedEventId(created.id);
      setIsCreateModalOpen(false);

      setNewEvent({
        title: '',
        event_type_id: eventTypes[0]?.id || '',
        event_type: eventTypes[0]?.name || 'Wedding Celebration',
        event_date: '2026-10-15',
        city: 'Amsterdam',
        venue_name: '',
        description: '',
        guest_count: 100,
        estimated_budget: 25000,
      });

      await loadData();
    } catch (err: any) {
      console.error('Failed to create celebration', err);
      setCreateError(err?.message || 'Could not save event. Please check your backend connection.');
    } finally {
      setCreatingEvent(false);
    }
  };

  return (
    <HostLayout>
      <div className="space-y-8 sm:space-y-10 pb-16">
        {/* PAGE HEADER & DYNAMIC CELEBRATION SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 border border-sand-200 text-taupe-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-taupe" />
              <span>Host Control Center • Live Data Synced</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight font-sans">
              {getGreeting()}, {hostName}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time celebration management, confirmed specialist agreements, and protected Escrow funds.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {events.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-soft-sm">
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-2.5 py-1.5 bg-transparent text-xs font-bold text-charcoal focus:outline-none cursor-pointer border-none"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      🎉 {ev.title}
                    </option>
                  ))}
                </select>
                {selectedEventId && (
                  <button
                    onClick={() => handleDeleteSelectedEvent(selectedEventId)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove selected celebration"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-[#FAF8F5] text-stone-600 shadow-soft-sm transition-all"
              title="Refresh Real Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-taupe' : ''}`} />
            </button>

            <button
              onClick={() => {
                setCreateError(null);
                setIsCreateModalOpen(true);
              }}
              className="btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sand" />
              <span>+ New Event</span>
            </button>

            <Link
              href="/dashboard/host/browse"
              className="btn-secondary px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all rounded-xl"
            >
              <Search className="w-3.5 h-3.5 text-taupe" />
              <span>Browse Specialists</span>
            </Link>
          </div>
        </div>

        {/* EXECUTIVE REAL KPI STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Countdown */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all group">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Celebration Countdown
              </span>
              <Clock className="w-4 h-4 text-taupe group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              {daysRemaining} <span className="text-sm font-normal text-stone-400">Days</span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium block mt-1 truncate">
              {activeEvent?.event_date ? `Date: ${activeEvent.event_date}` : 'No celebration active'}
            </span>
          </div>

          {/* Metric 2: Confirmed Specialists */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all group">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Confirmed Suppliers
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              {confirmedCount} <span className="text-sm font-normal text-stone-400">/ {totalNeeded}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-emerald-700">{progressPercent}%</span>
            </div>
          </div>

          {/* Metric 3: Committed Budget vs Target */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all group">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Committed Budget
              </span>
              <DollarSign className="w-4 h-4 text-taupe group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              €{committedBudgetNum.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500 font-medium block mt-1 truncate">
              Target: €{totalBudgetNum.toLocaleString()} • Free: €{remainingBudgetNum.toLocaleString()}
            </span>
          </div>

          {/* Metric 4: Pending Actions */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all group">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Pending Actions
              </span>
              <PenTool className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              {pendingContracts.length} <span className="text-sm font-normal text-stone-400">Agreements</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold block mt-1 truncate">
              {pendingContracts.length > 0 ? 'Digital signature required' : 'All agreements up to date'}
            </span>
          </div>
        </div>

        {/* HERO ACTIVE CELEBRATION SHOWCASE */}
        {activeEvent ? (
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-soft-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sand-100/60 via-sand-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-taupe/10 text-taupe text-xs font-bold uppercase tracking-wider">
                    Active Celebration
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-stone-200/80 text-stone-600 text-xs font-medium">
                    {normalizeEventType(activeEvent.type || activeEvent.event_type)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{activeEvent.status || 'Active Planning'}</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                    {activeEvent.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Managed securely via LEEMEVENTS Escrow & Procurement Infrastructure
                  </p>
                </div>

                {/* Event Key Metadata Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                    <CalendarDays className="w-4 h-4 text-taupe shrink-0" />
                    <span className="font-semibold truncate">{activeEvent.event_date || 'Date TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                    <MapPin className="w-4 h-4 text-taupe shrink-0" />
                    <span className="font-semibold truncate">{activeEvent.venue_name || activeEvent.city || 'Location TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                    <Users className="w-4 h-4 text-taupe shrink-0" />
                    <span className="font-semibold">{activeEvent.guest_count || 0} Invited Guests</span>
                  </div>
                </div>

                {/* Live Category Procurement Strip */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-charcoal flex items-center gap-2">
                      <span>Service Category Coverage</span>
                      <span className="text-stone-400 font-normal">
                        • {confirmedCount} of {totalNeeded} Locked
                      </span>
                    </span>
                    <span className="font-bold text-taupe">{progressPercent}%</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {coreServices.map((srv) => {
                      const Icon = srv.icon;
                      return (
                        <div
                          key={srv.name}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                            srv.booked
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                              : 'bg-stone-50/70 border-stone-200/70 text-stone-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${srv.booked ? 'text-emerald-700' : 'text-stone-400'}`} />
                            <span className="truncate font-medium">{srv.name}</span>
                          </div>
                          {srv.booked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Link
                              href="/dashboard/host/browse"
                              className="text-[10px] font-bold text-taupe hover:underline shrink-0"
                            >
                              + Find
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Countdown Showcase Box */}
              <div className="lg:col-span-4 bg-gradient-to-b from-[#FAF8F5] to-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-soft-sm">
                <div className="w-12 h-12 rounded-2xl bg-sand-100 border border-sand-200 text-taupe flex items-center justify-center mx-auto shadow-soft-sm">
                  <Clock className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <div className="text-5xl font-extrabold text-charcoal tracking-tight font-sans">
                    {daysRemaining}
                  </div>
                  <div className="text-xs font-bold text-taupe uppercase tracking-widest mt-1">
                    Days Remaining
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/dashboard/host/events"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-charcoal transition-colors shadow-soft-sm"
                  >
                    <span>Manage All Celebrations</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/dashboard/host/browse"
                    className="w-full btn-primary inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold shadow-soft-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-sand" />
                    <span>Browse Partners</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-10 text-center space-y-4 shadow-soft-sm">
            <div className="w-16 h-16 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center mx-auto shadow-soft-sm">
              <Calendar className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-charcoal">No Active Celebration Yet</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Create your celebration (Wedding, Gala, or Birthday) to start locking in verified specialists and tracking budgets in real-time.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCreateError(null);
                  setIsCreateModalOpen(true);
                }}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-soft-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Event</span>
              </button>
            </div>
          </div>
        )}

        {/* REAL SPECIALIST BOOKING INQUIRIES & PROPOSALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                  Live Inquiry Pipeline
                </span>
                <span className="text-xs text-stone-500 font-medium">Synced with Supabase</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal tracking-tight font-sans mt-1">
                Active Booking Inquiries & Supplier Responses
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Track custom package inquiries, dates confirmation, and direct specialist responses.
              </p>
            </div>
            <Link
              href="/dashboard/host/requests"
              className="text-xs font-semibold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
            >
              <span>View All Requests ({bookings.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings.slice(0, 3).map((b) => {
                const srv = b.service;
                const { text: cleanDesc, image_url: srvImg } = decodeServiceDescription(srv?.description);
                const sup = b.supplier || srv?.supplier;
                const supName = sup?.business_name || sup?.name || 'Verified Partner';
                const st = (b.status || 'pending').toLowerCase();
                const isAccepted = st === 'accepted' || st === 'availability_confirmed';
                const isDeclined = st === 'declined' || st === 'rejected';
                const isPaid = st === 'deposit_paid' || st === 'confirmed';

                const statusLabel = isPaid ? 'Deposit Paid' : isAccepted ? 'Accepted & Confirmed' : isDeclined ? 'Declined' : 'Pending Supplier Review';
                const statusBadge = isPaid
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : isAccepted
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isDeclined
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300';

                const thumb =
                  srvImg ||
                  srv?.image ||
                  sup?.avatar_url ||
                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop';

                return (
                  <div
                    key={b.id}
                    className="bg-white border border-stone-200/90 rounded-3xl p-5 space-y-4 hover:border-taupe/40 hover:shadow-soft-md transition-all shadow-soft-sm flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-taupe uppercase tracking-wider">
                          {normalizeCategory(sup?.category || 'Specialist')}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-16 rounded-xl overflow-hidden shrink-0 bg-stone-100 shadow-sm">
                          <Image src={thumb} alt={srv?.name || supName} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-charcoal text-sm truncate">
                            {srv?.name || 'Custom Package Inquiry'}
                          </h4>
                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            by <strong>{supName}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs space-y-1.5 font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Target Date:</span>
                          <span className="font-bold text-charcoal font-mono">{b.requested_date || 'Date TBD'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Package Rate:</span>
                          <span className="font-bold text-taupe font-mono">€{Number(b.quote_amount || srv?.base_price || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {b.supplier_response_notes && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-950 leading-snug">
                          <strong>Supplier Note:</strong> {b.supplier_response_notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <Link
                        href="/dashboard/host/requests"
                        className="text-xs font-bold text-charcoal hover:text-taupe transition-colors flex items-center gap-1"
                      >
                        <span>Manage Request</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {isAccepted && (
                        <Link
                          href="/dashboard/host/cart"
                          className="px-3 py-1.5 rounded-xl bg-charcoal text-white text-[11px] font-bold shadow-soft-sm hover:bg-taupe transition-colors"
                        >
                          Pay Deposit
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-6 text-center space-y-2 shadow-soft-sm">
              <Package className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500">No active booking inquiries sent yet.</p>
              <Link
                href="/dashboard/host/browse"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-taupe hover:underline pt-1"
              >
                <span>Explore Marketplace Services & Suppliers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* REAL SUPPLIER AGREEMENTS & ACTIVE PROPOSALS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-charcoal tracking-tight font-sans">
                Active Supplier Agreements & Proposals
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real agreements with vetted partners backed by 25% Escrow Protection.
              </p>
            </div>
            <Link
              href="/dashboard/host/documents"
              className="text-xs font-semibold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
            >
              <span>View All Agreements</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {contracts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {contracts.slice(0, 3).map((cnt) => {
                const isSigned = cnt.status === 'signed';

                return (
                  <div
                    key={cnt.id}
                    className="bg-white border border-stone-200/90 rounded-3xl p-5 space-y-4 hover:border-taupe/40 hover:shadow-soft-md transition-all shadow-soft-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-taupe uppercase tracking-wider">
                          {normalizeCategory(cnt.category)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSigned
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isSigned ? 'Signed & Valid' : 'Signature Required'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-charcoal leading-snug">
                        {cnt.supplier_name}
                      </h4>
                      <p className="text-xs text-stone-500 font-medium">
                        {cnt.title}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between border-t border-stone-100 text-xs">
                        <span className="text-stone-500">Agreed Total:</span>
                        <span className="font-bold font-mono text-charcoal text-sm">
                          €{cnt.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <Link
                        href="/dashboard/host/messages"
                        className="text-stone-500 hover:text-charcoal font-medium flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </Link>

                      {!isSigned ? (
                        <Link
                          href="/dashboard/host/documents"
                          className="btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-soft-sm"
                        >
                          <PenTool className="w-3 h-3 text-sand" />
                          <span>Sign Contract</span>
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard/host/cart"
                          className="font-bold text-taupe hover:text-charcoal flex items-center gap-1"
                        >
                          <span>Escrow Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-stone-200/80 rounded-2xl p-6 text-center text-xs text-stone-500">
              No active agreements yet. Browse verified suppliers to request proposals.
            </div>
          )}
        </div>

        {/* SPLIT SECTION: VERIFIED ESCROW LEDGER & LIVE REAL ACTIVITY STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Verified Escrow Protection Strip */}
          <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-soft-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-charcoal tracking-tight">
                    Verified Escrow Ledger
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100% Protected
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                All advance deposits are held safely under LEEMEVENTS Escrow Protection until vendor services are delivered on event day.
              </p>

              {payments.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {payments.slice(0, 2).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-[#FAF8F5] border border-stone-200/60 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-charcoal">{tx.supplier_name || 'Verified Supplier'}</p>
                        <p className="text-[10px] text-stone-400">
                          Ref: {tx.transaction_ref} • {tx.created_at}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-taupe">€{tx.amount.toLocaleString()}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                          Held in Escrow
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#FAF8F5] rounded-2xl text-xs text-stone-500 text-center">
                  No deposits placed yet. Sign an agreement to lock Escrow funds.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">
                Total Locked: <strong className="text-charcoal font-mono">€{escrowLockedNum.toLocaleString()}</strong>
              </span>
              <Link
                href="/dashboard/host/cart"
                className="text-xs font-bold text-taupe hover:text-charcoal flex items-center gap-1"
              >
                <span>Full Ledger & Checkout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Real Live Activity Feed */}
          <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-taupe" />
                <h3 className="text-base font-bold text-charcoal tracking-tight">
                  Real Activity Log
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sand-100 text-taupe-700 border border-sand-200">
                Live Feed
              </span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {realActivities.length > 0 ? (
                realActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:border-taupe/40 transition-colors text-xs"
                  >
                    <div className="w-7 h-7 rounded-xl bg-sand-100 text-taupe flex items-center justify-center shrink-0 mt-0.5 shadow-soft-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-charcoal truncate">{act.title}</p>
                        <span className="text-[10px] text-stone-400 shrink-0">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{act.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-stone-400">
                  No activity recorded yet. Create an event to begin.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUICK OPERATIONS SUITE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setCreateError(null);
              setIsCreateModalOpen(true);
            }}
            className="text-left bg-white border border-stone-200/90 hover:border-taupe/50 p-5 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-charcoal group-hover:text-taupe transition-colors mt-3">
              Plan New Celebration
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Create weddings, galas, or birthdays
            </p>
          </button>

          <Link
            href="/dashboard/host/browse"
            className="block bg-white border border-stone-200/90 hover:border-taupe/50 p-5 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-charcoal group-hover:text-taupe transition-colors mt-3">
              Browse Verified Partners
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Venues, catering, photo, and music
            </p>
          </Link>

          <Link
            href="/dashboard/host/documents"
            className="block bg-white border border-stone-200/90 hover:border-taupe/50 p-5 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors">
                <FileCode className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-charcoal group-hover:translate-x-0.5 transition-all" />
            </div>
            <h4 className="text-sm font-bold text-charcoal group-hover:text-taupe transition-colors mt-3">
              Review Legal Vault
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Sign digital agreements electronically
            </p>
          </Link>

          <Link
            href="/dashboard/host/cart"
            className="block bg-gradient-to-r from-charcoal to-[#3A332C] text-white p-5 rounded-3xl shadow-soft-md hover:shadow-soft-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-200 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h4 className="text-sm font-bold text-white mt-3">
              Escrow Checkout & Ledger
            </h4>
            <p className="text-[11px] text-stone-300 mt-0.5">
              25% deposit lock with refund guarantee
            </p>
          </Link>
        </div>

        {/* 100VH LUXURY CELEBRATION STUDIO PORTAL MODAL */}
        {mounted && isCreateModalOpen && createPortal(
          <div
            className="fixed inset-0 z-[999999] w-screen h-screen min-h-[100dvh] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden overscroll-contain"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              margin: 0,
              zIndex: 999999,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsCreateModalOpen(false);
            }}
          >
            <div className="relative bg-white sm:rounded-3xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[94vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 z-10">
              {/* Modal Clean Luxury Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-stone-200 flex items-center justify-between bg-white text-charcoal shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-taupe bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                        Host Celebration Studio
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight mt-0.5">
                      Create & Publish New Celebration
                    </h2>
                    <p className="text-xs text-stone-500 hidden sm:block">
                      Post your celebration details to the supplier marketplace & receive tailored quotes.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-charcoal flex items-center justify-center transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: 2 Columns */}
              <form onSubmit={handleCreateEvent} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
                  {/* Left Column: Form Inputs (Col 7) */}
                  <div className="lg:col-span-7 p-5 sm:p-7 space-y-4 overflow-y-auto">
                    {createError && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-bold">Notice</p>
                          <p className="mt-0.5 leading-snug">{createError}</p>
                        </div>
                      </div>
                    )}

                    {/* Celebration Title */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1.5">
                        Celebration Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Liam & Sophia's Luxury Wedding Gala"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
                      />
                      {/* Quick Title Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[
                          '💍 Luxury Wedding Gala',
                          '🎂 Milestone Birthday',
                          '🥂 Corporate Gala 2026',
                          '🍾 VIP Yacht Gathering',
                          '✨ Anniversary Soirée',
                        ].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setNewEvent({ ...newEvent, title: chip })}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Type & Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-charcoal mb-1.5">
                          Event Type *
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
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
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
                        <label className="block text-xs font-bold text-charcoal mb-1.5">
                          Celebration Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={newEvent.event_date}
                          onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
                        />
                      </div>
                    </div>

                    {/* City & Venue */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1.5">
                            City / Location *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Amsterdam, Madrid, Paris"
                            value={newEvent.city}
                            onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1.5">
                            Venue Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Grand Canal Estate"
                            value={newEvent.venue_name}
                            onChange={(e) => setNewEvent({ ...newEvent, venue_name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
                          />
                        </div>
                      </div>

                      {/* City Quick Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-stone-400 font-semibold uppercase">Popular:</span>
                        {['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Madrid', 'Barcelona', 'Paris', 'London'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setNewEvent({ ...newEvent, city: c })}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                              newEvent.city.toLowerCase() === c.toLowerCase()
                                ? 'bg-charcoal text-white'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guests & Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                        <label className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                          <span>Guest Count</span>
                          <span className="text-xs font-mono font-bold text-taupe">{newEvent.guest_count} Guests</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={newEvent.guest_count}
                          onChange={(e) => setNewEvent({ ...newEvent, guest_count: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                        <label className="block text-xs font-bold text-charcoal mb-1 flex items-center justify-between">
                          <span>Estimated Budget (€)</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            €{Number(newEvent.estimated_budget).toLocaleString()}
                          </span>
                        </label>
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={newEvent.estimated_budget}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, estimated_budget: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
                        />
                      </div>
                    </div>

                    {/* Metric indicator */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                      <div className="flex items-center gap-2 text-amber-900 font-medium">
                        <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Estimated Allocation per Guest:</span>
                      </div>
                      <span className="font-bold text-amber-950 font-mono">
                        €{newEvent.guest_count > 0 ? Math.round(newEvent.estimated_budget / newEvent.guest_count) : 0} / guest
                      </span>
                    </div>

                    {/* Requirements & Notes */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1.5">
                        Celebration Vibe & Requirements (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tell suppliers about your vision, dietary needs, music vibe, floral aesthetics, or specific service requests..."
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
                      />
                    </div>
                  </div>

                  {/* Right Column: Live Marketplace Preview & Host Guarantees (Col 5) */}
                  <div className="lg:col-span-5 p-5 sm:p-7 bg-stone-50/70 space-y-5 overflow-y-auto">
                    {/* Live Preview Card */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Live Marketplace Preview
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ⚡ Instant Lead
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-soft-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">
                              {newEvent.event_type}
                            </span>
                            <h4 className="text-sm font-bold text-charcoal leading-snug">
                              {newEvent.title || 'Untitled Celebration'}
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            Planning
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-2 border-t border-stone-100">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-taupe" />
                            <span className="truncate">{newEvent.city || 'Location'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-taupe" />
                            <span>{newEvent.event_date || 'Date'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-taupe" />
                            <span>{newEvent.guest_count} Guests</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold text-emerald-700">
                              €{Number(newEvent.estimated_budget).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {newEvent.venue_name && (
                          <p className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-stone-400" />
                            <span className="truncate">Venue: {newEvent.venue_name}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/90 space-y-2.5 text-xs text-stone-600">
                      <p className="font-bold text-charcoal text-xs flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        What happens when you launch?
                      </p>
                      <ul className="space-y-2 text-[11px] leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-taupe/15 text-taupe text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                          <span>Verified luxury suppliers in <strong>{newEvent.city}</strong> get notified about your celebration.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-taupe/15 text-taupe text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                          <span>Suppliers submit customized pitches and quotes directly to your inquiries hub.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-taupe/15 text-taupe text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                          <span>You review proposals, chat in real-time, and accept with 20% escrow protection.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Protection Badge */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>100% Escrow Security:</strong> Deposit is held safely until event delivery.</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 sm:px-8 py-4 border-t border-stone-200 bg-stone-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <p className="text-[11px] text-stone-500 hidden sm:block">
                    Free to publish • No obligation to book • Real-time supplier proposals
                  </p>
                  <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingEvent || !newEvent.title.trim()}
                      className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-soft-sm disabled:opacity-50"
                    >
                      {creatingEvent ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing Celebration...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Launch Celebration & Alert Suppliers</span>
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
    </HostLayout>
  );
}
