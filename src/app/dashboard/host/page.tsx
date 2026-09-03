'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HostLayout from '@/components/dashboard/HostLayout';
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
  ShoppingBag,
  DollarSign,
  FileText,
  MessageSquare,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

export default function HostDashboardHome() {
  const currentEvent = {
    name: "Eleanor & Liam's Country Estate Wedding",
    type: 'Country Estate Wedding',
    date: 'Friday, September 18, 2026',
    daysRemaining: 16,
    location: 'Cotswolds, Oxfordshire, UK',
    guestCount: 120,
    confirmedSuppliers: 3,
    totalSuppliersNeeded: 8,
    committedBudget: '$13,400',
    totalBudget: '$28,500',
  };

  const bookingRequests = [
    {
      id: 'req_1',
      supplierName: 'Château de Bellevue Venue',
      category: 'Venue & Location',
      price: '$4,500',
      status: 'Accepted',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_2',
      supplierName: 'Maison Gourmet Catering',
      category: 'Catering & Food',
      price: '$3,800',
      status: 'Contract Sent',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_3',
      supplierName: 'Aura Floral & Styling',
      category: 'Floral & Decor',
      price: '$2,200',
      status: 'Pending',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_4',
      supplierName: 'Lumière Wedding Photography',
      category: 'Photography',
      price: '$2,900',
      status: 'Accepted',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const milestones = [
    {
      title: 'Review Catering Menu & Wine Pairings',
      partner: 'Maison Gourmet Catering',
      status: 'Action Required',
      dueDate: 'In 2 days',
      urgent: true,
    },
    {
      title: 'Confirm Ceremony Floral Arch & Color Palette',
      partner: 'Aura Floral & Styling',
      status: 'Pending Proposal',
      dueDate: 'Sept 5, 2026',
      urgent: false,
    },
    {
      title: 'Submit Preferred Photography Shot List',
      partner: 'Lumière Wedding Photography',
      status: 'In Progress',
      dueDate: 'Sept 9, 2026',
      urgent: false,
    },
  ];

  const progressPercent = Math.round(
    (currentEvent.confirmedSuppliers / currentEvent.totalSuppliersNeeded) * 100
  );

  return (
    <HostLayout>
      <div className="space-y-8 sm:space-y-10">
        {/* ========================================================================= */}
        {/* PAGE HEADER: ELEGANT GREETING & CONTEXT                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 border border-sand-200 text-taupe-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-taupe" />
              <span>Autumn 2026 Celebration Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
              Welcome back, Eleanor
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Track vendor contracts, monitor milestone schedules, and manage your unified celebration deposit.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/host/browse"
              className="px-4 py-2.5 rounded-xl border border-stone-200/90 bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-charcoal flex items-center gap-2 shadow-soft-sm transition-all"
            >
              <Search className="w-3.5 h-3.5 text-taupe" />
              <span>Browse Suppliers</span>
            </Link>
            <Link
              href="/dashboard/host/cart"
              className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-sand" />
              <span>View Cart (3 items)</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EXECUTIVE KPI STATS STRIP                                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Booked Vendors
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              3 <span className="text-sm font-normal text-stone-400">/ 8</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              Venue, Catering & Photo locked
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Committed Budget
              </span>
              <DollarSign className="w-4 h-4 text-taupe" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              {currentEvent.committedBudget}
            </div>
            <span className="text-[11px] text-stone-500 font-medium block mt-1">
              Target total: {currentEvent.totalBudget}
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Action Items
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              2 Pending
            </div>
            <span className="text-[11px] text-amber-700 font-semibold block mt-1">
              1 contract ready for review
            </span>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm hover:border-taupe/40 transition-all">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Countdown
              </span>
              <CalendarDays className="w-4 h-4 text-taupe" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-charcoal">
              {currentEvent.daysRemaining} Days
            </div>
            <span className="text-[11px] text-stone-500 font-medium block mt-1">
              September 18, 2026
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO CELEBRATION CARD                                                     */}
        {/* ========================================================================= */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-soft-sm relative overflow-hidden">
          {/* Subtle warm decorative gradient corner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sand-100/60 via-sand-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-taupe/10 text-taupe text-xs font-bold uppercase tracking-wider">
                  Active Celebration
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-stone-200/80 text-stone-600 text-xs font-medium">
                  {currentEvent.type}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                  {currentEvent.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Coordinated via LEEMEVENTS Private Host Suite
                </p>
              </div>

              {/* Event Metadata Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                  <CalendarDays className="w-4 h-4 text-taupe shrink-0" />
                  <span className="font-semibold truncate">{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                  <MapPin className="w-4 h-4 text-taupe shrink-0" />
                  <span className="font-semibold truncate">{currentEvent.location}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-200/70 rounded-xl px-3.5 py-2.5 text-xs text-charcoal">
                  <Users className="w-4 h-4 text-taupe shrink-0" />
                  <span className="font-semibold">{currentEvent.guestCount} Confirmed Guests</span>
                </div>
              </div>

              {/* Supplier Confirmation Progress */}
              <div className="pt-2 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal flex items-center gap-2">
                    <span>Supplier Confirmation Progress</span>
                    <span className="text-stone-400 font-normal">
                      • {currentEvent.confirmedSuppliers} of {currentEvent.totalSuppliersNeeded} Vendors Confirmed
                    </span>
                  </span>
                  <span className="font-bold text-taupe">{progressPercent}%</span>
                </div>

                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-taupe-500 via-taupe to-charcoal rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                  <span>Locked: Venue, Catering, Photography</span>
                  <span className="text-taupe font-semibold">Remaining: DJ, Floral, Cake, Styling</span>
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
                  {currentEvent.daysRemaining}
                </div>
                <div className="text-xs font-bold text-taupe uppercase tracking-widest mt-1">
                  Days Until &ldquo;I Do&rdquo;
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Friday • Cotswolds Country Estate
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/host/events"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-charcoal transition-colors"
                >
                  <span>View Timeline & Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUPPLIER BOOKING REQUESTS: BALANCED 4-COL GRID                             */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-charcoal tracking-tight">
                Curated Vendor Team
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Review contracts, deposit requests, and direct supplier communication
              </p>
            </div>
            <Link
              href="/dashboard/host/requests"
              className="text-xs font-semibold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
            >
              <span>View All Requests</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {bookingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 space-y-3.5 hover:border-taupe/40 hover:shadow-soft-md transition-all shadow-soft-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3">
                    <Image
                      src={req.image}
                      alt={req.supplierName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    <span
                      className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm backdrop-blur-sm ${req.badgeBg}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">
                    {req.category}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal mt-0.5 truncate group-hover:text-taupe transition-colors">
                    {req.supplierName}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-bold text-charcoal">
                      {req.price}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      / package agreement
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

                  <Link
                    href="/dashboard/host/requests"
                    className="font-bold text-taupe hover:text-charcoal flex items-center gap-1 group/btn"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SPLIT SECTION: MILESTONES & CONCIERGE HUB                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Milestones / To-Do List */}
          <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-charcoal tracking-tight">
                  Upcoming Host Action Items
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Key planning checkpoints for this week
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                Phase 2
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:border-taupe/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        m.urgent
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-charcoal truncate">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {m.partner} • Due {m.dueDate}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/host/requests"
                    className="text-xs font-bold text-taupe hover:underline shrink-0 pt-0.5"
                  >
                    Resolve
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Concierge Support & Unified Deposit Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* Unified Deposit Card */}
            <div className="bg-gradient-to-br from-charcoal to-[#3B332B] text-white rounded-3xl p-6 sm:p-7 shadow-soft-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Unified Deposit
                </span>
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>

              <div>
                <h4 className="text-xl font-bold tracking-tight">
                  1 Single Checkout Payment
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  Lock in Château de Bellevue, Maison Gourmet, and Lumière Photography in 1 unified escrow transaction.
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-[11px] text-stone-400 block">Total Combined Deposit</span>
                  <span className="text-lg font-bold text-amber-200">$3,400.00</span>
                </div>

                <Link
                  href="/dashboard/host/cart"
                  className="px-4 py-2 rounded-xl bg-sand text-charcoal hover:bg-white text-xs font-bold transition-all shadow-soft-sm"
                >
                  Checkout
                </Link>
              </div>
            </div>

            {/* Need Help Concierge Card */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-soft-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-charcoal">
                  Need recommendations for DJ or Cake?
                </h5>
                <p className="text-[11px] text-stone-500">
                  Your LEEMEVENTS event specialist is available for custom matchmaking.
                </p>
              </div>
              <Link
                href="/dashboard/host/messages"
                className="shrink-0 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-taupe hover:bg-stone-50 transition-colors"
              >
                Ask Specialist
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUICK ACTION TILES                                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 space-y-3 shadow-soft-sm hover:shadow-soft-md hover:border-taupe/40 transition-all">
            <h4 className="text-sm font-bold text-charcoal">
              Browse 13 Supplier Categories
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explore curated wedding vendors including Acoustic Artists, Luxury Transport, Fireworks, and Stationery.
            </p>
            <Link
              href="/dashboard/host/browse"
              className="btn-primary inline-flex px-3.5 py-2 text-xs font-semibold items-center gap-1.5"
            >
              <span>Explore Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 space-y-3 shadow-soft-sm hover:shadow-soft-md hover:border-taupe/40 transition-all">
            <h4 className="text-sm font-bold text-charcoal">
              Contracts & Signed Documents
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Access digital vendor agreements, liability insurance certificates, and payment invoices in one secure vault.
            </p>
            <Link
              href="/dashboard/host/documents"
              className="btn-secondary inline-flex px-3.5 py-2 text-xs font-semibold items-center gap-1.5"
            >
              <span>Open Document Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 space-y-3 shadow-soft-sm hover:shadow-soft-md hover:border-taupe/40 transition-all">
            <h4 className="text-sm font-bold text-charcoal">
              Collaborative Planning & Team
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Invite your partner, wedding coordinator, or family members to view supplier selections and budget allocations.
            </p>
            <Link
              href="/dashboard/host/team"
              className="btn-secondary inline-flex px-3.5 py-2 text-xs font-semibold items-center gap-1.5"
            >
              <span>Manage Collaborators</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </HostLayout>
  );
}
