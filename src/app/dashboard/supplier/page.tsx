'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  supplierPortalApi,
  supplierBookingsApi,
  decodeServiceDescription,
  normalizeCategory
} from '@/lib/services/consumerApi';
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
  RefreshCw,
  Clock,
  ArrowRight,
  Package,
  DollarSign,
  Inbox
} from 'lucide-react';

export default function SupplierDashboardHome() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, reqData, servData] = await Promise.all([
        supplierPortalApi.getProfile(),
        supplierBookingsApi.getMyRequests(),
        supplierPortalApi.getServices(),
      ]);

      setProfile(profData);
      setRequests(reqData || []);
      setServices(servData || []);
    } catch (err) {
      console.error('Failed to load supplier overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'availability_confirmed' || s === 'accepted') return 'accepted';
    if (s === 'declined' || s === 'rejected') return 'rejected';
    if (s === 'deposit_paid' || s === 'confirmed') return 'accepted';
    return 'pending';
  };

  const handleAction = async (id: string, action: 'accepted' | 'declined') => {
    try {
      const targetStatus = action === 'accepted' ? 'accepted' : 'rejected';
      await supplierBookingsApi.updateBookingStatus(
        id,
        targetStatus,
        action === 'accepted'
          ? 'Confirmed availability. Looking forward to providing exceptional service!'
          : 'Scheduling conflict on requested date.'
      );
      await loadData();
    } catch (err: any) {
      alert(`Error updating request: ${err?.message || 'Server error'}`);
    }
  };

  const pendingRequests = requests.filter((r) => getNormalizedStatus(r.status) === 'pending');
  const confirmedBookings = requests.filter((r) => getNormalizedStatus(r.status) === 'accepted');

  const totalPipelineRevenue = requests.reduce((sum, r) => {
    return sum + Number(r.quote_amount || r.service?.base_price || 0);
  }, 0);

  const businessName =
    profile?.business_name ||
    user?.businessName ||
    user?.name ||
    'My Supplier Studio';

  const categoryName = normalizeCategory(profile?.category || 'Event Specialist');

  const isApproved = user?.verification_status === 'verified' || user?.supplierApproved === true || profile?.verification_status === 'verified';
  const isRejected = user?.verification_status === 'rejected' || profile?.verification_status === 'rejected';
  const isPending = !isApproved && !isRejected;

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Verification Status Banner */}
        {isPending ? (
          <div className="bg-amber-50 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-soft-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <span>Admin Review in Progress • Est. 24–48 Hours</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-charcoal">
                    Studio Application Under Review
                  </h2>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                    Your profile and portfolio are being vetted by the LeemeEvent Concierge & Trust team. While pending, you can configure your services, portfolio, and calendar in <strong>Preview Mode</strong>. Client inquiries will unlock as soon as Admin approves your listing in the Admin Panel.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                <Link
                  href="/dashboard/supplier/services"
                  className="px-4 py-2 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sand" />
                  <span>Setup Services</span>
                </Link>
              </div>
            </div>

            {/* Vetting Checklist Steps */}
            <div className="mt-5 pt-4 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1. Account & Profile Created</span>
              </div>
              <div className="flex items-center gap-2 text-amber-900 font-bold bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/80">
                <Clock className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
                <span>2. Admin Reviewing (In Progress)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 bg-stone-100/50 p-2.5 rounded-xl border border-stone-200/60">
                <ShieldCheck className="w-4 h-4 text-stone-300 shrink-0" />
                <span>3. Live Directory Activation</span>
              </div>
            </div>
          </div>
        ) : isRejected ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-7 shadow-soft-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                Application Declined
              </span>
              <h2 className="text-base sm:text-lg font-bold text-charcoal">
                Studio Verification Not Approved
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Your application was not approved by the admin team. Please reach out to <a href="mailto:support@leemevent.com" className="text-rose-700 underline font-semibold">support@leemevent.com</a> to appeal or submit missing business documentation.
              </p>
            </div>
          </div>
        ) : null}

        {/* Page Header */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-taupe block uppercase tracking-wider">
                Supplier Hub • Live Sync
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800'
                    : isRejected
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{isApproved ? 'Verified Specialist' : isRejected ? 'Declined' : 'Pending Review'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
              {businessName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {categoryName} • {profile?.city || user?.city || 'Madrid'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/dashboard/supplier/calendar"
              className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-2 rounded-xl"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Availability Calendar</span>
            </Link>
            <Link
              href="/dashboard/supplier/services"
              className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2 rounded-xl shadow-soft-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sand" />
              <span>Manage Services ({services.length})</span>
            </Link>
          </div>
        </div>

        {/* METRICS STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider">
                New Inquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                {pendingRequests.length}
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">{pendingRequests.length} Pending</div>
            <span className="text-xs text-charcoal/60 block">Awaiting your response</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider">
                Confirmed Bookings
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {confirmedBookings.length}
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">{confirmedBookings.length} Booked</div>
            <span className="text-xs text-emerald-700 font-semibold block">Dates secured on calendar</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider">
                Pipeline Value
              </span>
              <div className="w-8 h-8 rounded-xl bg-taupe/15 text-taupe flex items-center justify-center font-bold text-xs">
                €
              </div>
            </div>
            <div className="text-3xl font-bold text-taupe font-mono">€{totalPipelineRevenue.toLocaleString()}</div>
            <span className="text-xs text-charcoal/60 block">Gross inquiries & bookings</span>
          </div>

          <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 space-y-2 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-taupe font-semibold uppercase tracking-wider">
                Active Catalog
              </span>
              <div className="w-8 h-8 rounded-xl bg-sand-200 text-charcoal flex items-center justify-center font-bold text-xs">
                {services.length}
              </div>
            </div>
            <div className="text-3xl font-bold text-charcoal">{services.length} Services</div>
            <span className="text-xs text-charcoal/60 block">Visible to all marketplace hosts</span>
          </div>
        </div>

        {/* INCOMING BOOKING REQUESTS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-charcoal tracking-tight">
                Incoming Client Booking Inquiries
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Real-time booking inquiries sent by event hosts via the marketplace.
              </p>
            </div>
            <Link
              href="/dashboard/supplier/requests"
              className="text-xs font-semibold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
            >
              <span>View Full Requests Inbox ({requests.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
              <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Loading live inquiries from database...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-10 text-center space-y-3 shadow-soft-sm">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-charcoal">No booking inquiries yet</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                When consumers explore your services in the marketplace and send booking requests, they will appear here instantly.
              </p>
              <Link
                href="/dashboard/supplier/services"
                className="inline-flex items-center gap-1.5 btn-primary px-4 py-2 text-xs font-bold shadow-soft-sm pt-1"
              >
                <span>Add / Manage Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.slice(0, 4).map((r) => {
                const creator = r.event?.creator;
                const hostName = creator?.full_name || creator?.email || 'Verified Host';
                const normStatus = getNormalizedStatus(r.status);
                const srv = r.service;
                const serviceName = srv?.name || 'Bespoke Package Inquiry';
                const eventTitle = r.event?.title || 'Private Celebration';
                const reqDate = r.requested_date || r.event?.event_date || 'Date TBD';
                const price = Number(r.quote_amount || srv?.base_price || 0);

                return (
                  <div
                    key={r.id}
                    className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-soft-sm hover:border-taupe/40 hover:shadow-soft-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-charcoal text-base">{eventTitle}</span>
                        <span className="text-xs text-stone-400 font-normal">by <strong>{hostName}</strong></span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            normStatus === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : normStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {normStatus === 'accepted' ? 'Accepted' : normStatus === 'rejected' ? 'Declined' : 'Pending Review'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                        <span className="flex items-center gap-1.5 font-mono font-medium">
                          <Calendar className="w-3.5 h-3.5 text-taupe" />
                          {reqDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-taupe" />
                          {r.event?.city || 'Madrid'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-taupe" />
                          {r.guest_count || 50} guests
                        </span>
                        <span className="font-bold text-charcoal font-mono">
                          €{price.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                        <strong>Requested Service:</strong> {serviceName}
                        {r.requirements && <p className="mt-0.5 text-stone-600 font-medium">&quot;{r.requirements}&quot;</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                      {normStatus === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleAction(r.id, 'accepted')}
                            className="px-4 py-2 rounded-xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-soft-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'declined')}
                            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/dashboard/supplier/requests"
                          className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
