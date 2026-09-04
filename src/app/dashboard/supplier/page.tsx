'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronRight,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';

export default function SupplierDashboardHome() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([
    {
      id: 'sreq_1',
      hostName: 'Eleanor & Liam',
      eventType: 'Wedding Ceremony & Reception',
      eventDate: 'September 18, 2026',
      location: 'Cotswolds, UK',
      guestCount: 120,
      requestedService: 'Full Floral & Backdrop Package',
      budget: '€2.200',
      status: 'pending',
    },
    {
      id: 'sreq_2',
      hostName: 'Marcus Vance',
      eventType: '30th Birthday Dinner Gala',
      eventDate: 'October 10, 2026',
      location: 'London, UK',
      guestCount: 65,
      requestedService: 'Tablescape & Entrance Arch',
      budget: '€1.400',
      status: 'pending',
    },
    {
      id: 'sreq_3',
      hostName: 'Sophie & James',
      eventType: 'Anniversary Celebration',
      eventDate: 'November 02, 2026',
      location: 'Bath, UK',
      guestCount: 80,
      requestedService: 'Bridal Bouquet & Dining Florals',
      budget: '€1.850',
      status: 'pending',
    },
  ]);

  const handleAction = (id: string, action: 'accepted' | 'declined') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <SupplierLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-taupe block">
                {t.dashboard.supplierHome.dashboardBadge}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>{t.dashboard.supplierHome.verifiedPartner}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
              Aura Floral & Styling
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/supplier/calendar"
              className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.dashboard.supplierHome.updateAvailability}</span>
            </Link>
            <Link
              href="/dashboard/supplier/services"
              className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-sand" />
              <span>{t.dashboard.supplierHome.manageServices}</span>
            </Link>
          </div>
        </div>

        {/* METRICS STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold">
                {t.dashboard.supplierHome.newRequests}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">3 Pending</div>
            <span className="text-xs text-charcoal/60 block">{t.dashboard.supplierHome.requiresResponse}</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold">
                {t.dashboard.supplierHome.confirmedBookings}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                4
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">4 Confirmed</div>
            <span className="text-xs text-emerald-700 font-semibold block">{t.dashboard.supplierHome.synced}</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold">
                {t.dashboard.supplierHome.estRevenue}
              </span>
              <div className="w-8 h-8 rounded-xl bg-taupe/15 text-taupe flex items-center justify-center font-bold text-xs">
                €
              </div>
            </div>
            <div className="text-3xl font-bold text-taupe font-mono">€12.400</div>
            <span className="text-xs text-charcoal/60 block">{t.dashboard.supplierHome.revenueSub}</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold">
                {t.dashboard.supplierHome.overallRating}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                ★ 4.9
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">4.9 / 5.0</div>
            <span className="text-xs text-charcoal/60 block">{t.dashboard.supplierHome.reviewsCount}</span>
          </div>
        </div>

        {/* INCOMING REQUESTS (ACCEPT / DECLINE QUEUE) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal">
              {t.dashboard.supplierHome.pendingQueue}
            </h2>
            <Link
              href="/dashboard/supplier/requests"
              className="text-xs text-taupe hover:underline font-semibold flex items-center gap-1"
            >
              <span>{t.dashboard.hostHome.viewAll}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-soft-sm hover:border-taupe/40 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-classico text-xl uppercase font-semibold text-charcoal">
                      {req.hostName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {req.eventType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/80">
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-taupe" />
                      <span>{req.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-taupe" />
                      <span>{req.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-taupe" />
                      <span>{req.guestCount} {t.dashboard.supplierHome.guestCountLabel}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-xs text-charcoal/70">
                    {t.dashboard.supplierHome.serviceLabel}: <strong className="text-charcoal">{req.requestedService}</strong> • Budget: <span className="font-mono font-bold text-taupe">{req.budget}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 border-t lg:border-t-0 border-taupe/15 pt-4 lg:pt-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'declined')}
                        className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 text-xs font-classico tracking-wider uppercase font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.dashboard.supplierHome.declineBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'accepted')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 text-sand text-xs font-classico tracking-wider uppercase font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-soft-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.dashboard.supplierHome.acceptBtn}</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-classico uppercase tracking-wider font-bold ${
                        req.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {req.status === 'accepted' ? t.dashboard.supplierHome.acceptedStatus : t.dashboard.supplierHome.declinedStatus}
                    </span>
                  )}

                  <Link
                    href="/dashboard/supplier/messages"
                    className="btn-secondary px-3.5 py-2.5 text-xs flex items-center gap-1"
                    title="Send Message to Host"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SupplierLayout>
  );
}
