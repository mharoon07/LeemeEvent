'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import {
  bookingsApi,
  normalizeCategory,
  decodeServiceDescription,
  notificationsApi
} from '@/lib/services/consumerApi';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  Clock,
  Check,
  XCircle,
  CreditCard,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Building2,
  Package,
  AlertTriangle,
  X,
  Loader2,
  Star,
  Briefcase
} from 'lucide-react';
import { reviewsApi } from '@/lib/services/consumerApi';
import SupplierPortfolioModal from '@/components/SupplierPortfolioModal';

export default function HostRequestsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Supplier Portfolio Modal State
  const [portfolioModalSupplier, setPortfolioModalSupplier] = useState<any | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);

  // Cancel Modal State
  const [cancelModalBooking, setCancelModalBooking] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Review Modal State
  const [reviewModalBooking, setReviewModalBooking] = useState<any | null>(null);
  const [ratingPunctuality, setRatingPunctuality] = useState<number>(5);
  const [ratingQuality, setRatingQuality] = useState<number>(5);
  const [ratingCommunication, setRatingCommunication] = useState<number>(5);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Proposal Actions & Toast
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleAcceptProposal = async (req: any) => {
    setAcceptingId(req.id);
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'accepted' } : r))
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${req.id}`, 'accepted');
    }
    showToast('🎉 Proposal Accepted! Booking is confirmed. You can now pay the 20% escrow deposit or message the supplier.');

    try {
      notificationsApi.addNotification('supplier', {
        title: `🏆 Proposal Accepted by ${user?.name || 'Host'}!`,
        desc: `Congratulations! Your quote for "${req.event?.title || 'Celebration'}" was accepted. Escrow deposit registered.`,
        type: 'booking',
        link: '/dashboard/supplier/requests',
        metadata: { booking_id: req.id },
      });
    } catch {}

    try {
      await bookingsApi.updateStatus(req.id, 'accepted', 'Proposal accepted by Host');
    } catch (err) {
      console.warn('Backend accept notice:', err);
    } finally {
      setAcceptingId(null);
      loadRequests();
    }
  };

  const handleDeclineProposal = async (req: any) => {
    if (!confirm('Are you sure you want to decline this supplier proposal?')) return;
    setAcceptingId(req.id);
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'declined' } : r))
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${req.id}`, 'declined');
    }
    showToast('Proposal declined.');
    try {
      await bookingsApi.updateStatus(req.id, 'declined', 'Proposal declined by Host');
    } catch (err) {
      console.warn('Backend decline notice:', err);
    } finally {
      setAcceptingId(null);
      loadRequests();
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getMyBookings();
      const enhanced = (data || []).map((r: any) => {
        if (typeof window !== 'undefined') {
          const cachedStatus = localStorage.getItem(`LEEMEVENTS_BOOKING_STATUS_${r.id}`);
          const cachedReviewed = localStorage.getItem(`LEEMEVENTS_BOOKING_REVIEWED_${r.id}`);
          return {
            ...r,
            status: cachedStatus || r.status,
            is_reviewed: cachedReviewed ? true : r.is_reviewed,
          };
        }
        return r;
      });
      setRequests(enhanced);
    } catch (err) {
      console.error('Failed to load host booking requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadRequests();
    }
  }, [user?.id, user?.email, authLoading]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(cancelModalBooking || reviewModalBooking || isPortfolioModalOpen);
    if (isAnyModalOpen) {
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
  }, [cancelModalBooking, reviewModalBooking, isPortfolioModalOpen]);

  const handleOpenCancelModal = (booking: any) => {
    setCancelModalBooking(booking);
    setCancelReason('Change in event plans or date.');
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalBooking) return;

    try {
      setCancelling(true);
      await bookingsApi.updateStatus(
        cancelModalBooking.id,
        'cancelled',
        cancelReason ? `Cancelled by Host: ${cancelReason}` : 'Cancelled by Host'
      );
      setCancelModalBooking(null);
      await loadRequests();
    } catch (err: any) {
      alert(`Failed to cancel booking: ${err?.message || 'Server error'}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenReviewModal = (booking: any) => {
    setReviewModalBooking(booking);
    setRatingPunctuality(5);
    setRatingQuality(5);
    setRatingCommunication(5);
    setRatingValue(5);
    setReviewComment('');
    setReviewSuccessMsg(null);
  };

  const handleConfirmReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    if (!reviewComment.trim()) {
      alert('Please provide your review feedback comment.');
      return;
    }

    try {
      setReviewSubmitting(true);
      const supplierId =
        reviewModalBooking.supplier_id ||
        reviewModalBooking.supplier?.id ||
        reviewModalBooking.service?.supplier_id;

      await reviewsApi.submitReview({
        booking_id: reviewModalBooking.id,
        supplier_id: supplierId,
        service_id: reviewModalBooking.service_id || reviewModalBooking.service?.id,
        rating_punctuality: ratingPunctuality,
        rating_quality: ratingQuality,
        rating_communication: ratingCommunication,
        rating_value: ratingValue,
        comment: reviewComment.trim(),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(`LEEMEVENTS_BOOKING_REVIEWED_${reviewModalBooking.id}`, 'true');
        localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${reviewModalBooking.id}`, 'completed');
      }

      // Trigger notification for supplier
      try {
        notificationsApi.addNotification('supplier', {
          title: `★ New ${ratingQuality}.0-Star Verified Review!`,
          desc: `${user?.name || 'A client'} rated your service: "${reviewComment.slice(0, 60)}..."`,
          type: 'review',
          link: '/dashboard/supplier/reviews',
          metadata: { booking_id: reviewModalBooking.id, rating: ratingQuality },
        });
      } catch {}

      setRequests((prev) =>
        prev.map((r) =>
          r.id === reviewModalBooking.id ? { ...r, is_reviewed: true, status: 'completed' } : r
        )
      );

      setReviewSuccessMsg('Your review and rating have been published successfully! Thank you for supporting our verified specialist.');
      setTimeout(() => {
        setReviewModalBooking(null);
        setReviewSuccessMsg(null);
        loadRequests();
      }, 1800);
    } catch (err: any) {
      alert(`Failed to submit review: ${err?.message || 'Server error'}`);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'completed' || s === 'done') return 'Completed';
    if (s === 'availability_confirmed' || s === 'accepted') return 'Accepted';
    if (s === 'declined' || s === 'rejected') return 'Declined';
    if (s === 'deposit_paid' || s === 'confirmed') return 'Deposit Paid';
    if (s === 'contract_sent') return 'Contract Sent';
    if (s === 'cancelled' || s === 'cancel') return 'Cancelled';
    return 'Pending';
  };

  const getStatusBadge = (normalized: string) => {
    switch (normalized) {
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Contract Sent':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Deposit Paid':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Cancelled':
        return 'bg-stone-100 text-stone-600 border-stone-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const filtered = requests.filter((r) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === '⚡ Supplier Proposals') {
      return r.source === 'supplier_pitch' || Boolean(r.supplier_pitch_notes);
    }
    const norm = getNormalizedStatus(r.status);
    return norm.toLowerCase() === filterStatus.toLowerCase();
  });

  const proposalCount = requests.filter(
    (r) => r.source === 'supplier_pitch' || Boolean(r.supplier_pitch_notes)
  ).length;
  const pendingCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Pending').length;
  const acceptedCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Accepted').length;
  const depositCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Deposit Paid').length;
  const completedCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Completed').length;
  const declinedCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Declined').length;
  const cancelledCount = requests.filter((r) => getNormalizedStatus(r.status) === 'Cancelled').length;

  const filterTabs = [
    { id: 'All', label: 'All', count: requests.length },
    { id: '⚡ Supplier Proposals', label: '⚡ Supplier Proposals', count: proposalCount, highlight: true },
    { id: 'Pending', label: 'Pending', count: pendingCount },
    { id: 'Accepted', label: 'Accepted', count: acceptedCount },
    { id: 'Deposit Paid', label: 'Deposit Paid', count: depositCount },
    { id: 'Completed', label: 'Completed', count: completedCount },
    { id: 'Declined', label: 'Declined', count: declinedCount },
    { id: 'Cancelled', label: 'Cancelled', count: cancelledCount },
  ];

  return (
    <HostLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-charcoal text-sand px-5 py-3 rounded-2xl shadow-2xl border border-taupe/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Clean Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/15 text-taupe text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host Inquiries & Proposal Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Booking Requests & Supplier Pitches
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
              Review direct service inquiries and proposals received from verified suppliers for your celebrations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200">
              <Package className="w-4 h-4 text-taupe" />
              <span>{requests.length} Total Requests</span>
            </div>
            <button
              onClick={loadRequests}
              className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors shadow-soft-sm flex items-center gap-2 text-xs font-semibold"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Dedicated Responsive Filter Toolbar */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-2 sm:p-2.5 shadow-soft-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {filterTabs.map((tab) => {
              const isSelected = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-charcoal text-white shadow-soft-sm'
                      : tab.highlight
                      ? 'bg-stone-100 border border-stone-300 text-charcoal hover:bg-stone-200'
                      : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-charcoal'
                  }`}
                >
                  {tab.highlight && <Sparkles className="w-3.5 h-3.5 text-taupe" />}
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : tab.highlight
                        ? 'bg-amber-200/60 text-amber-950'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Syncing your booking requests & supplier proposals...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-4 shadow-soft-sm">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto">
              <Package className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-charcoal text-base">No booking requests or proposals found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {filterStatus !== 'All'
                ? `No items match the "${filterStatus}" filter.`
                : 'You have not received any supplier proposals or submitted inquiries yet.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard/host/browse"
                className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-xs font-bold shadow-soft-sm hover:scale-[1.02] transition-transform"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/host/events"
                className="inline-flex items-center gap-2 btn-secondary px-5 py-2.5 text-xs font-bold hover:bg-stone-100 transition-colors"
              >
                <span>My Celebrations</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((req) => {
              const normStatus = getNormalizedStatus(req.status);
              const badgeClass = getStatusBadge(normStatus);
              const isPitch = req.source === 'supplier_pitch' || Boolean(req.supplier_pitch_notes);
              const isAccepting = acceptingId === req.id;

              // Extract Service details
              const service = req.service;
              const { text: cleanDesc, image_url: serviceImg } = decodeServiceDescription(service?.description);

              const supplier = req.supplier || service?.supplier;
              const supplierName = supplier?.business_name || supplier?.name || 'Verified Supplier Partner';
              const supplierCategory = normalizeCategory(supplier?.category || supplier?.category_id || 'Event Specialist');
              const supplierCity = supplier?.city || req.event?.city || 'Amsterdam';

              const displayImage =
                serviceImg ||
                service?.image ||
                supplier?.avatar_url ||
                supplier?.image ||
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop';

              const priceNum = Number(req.quote_amount || service?.base_price || 1500);
              const depositNum = Number(req.deposit_amount || (priceNum * 0.2));
              const dateSubmitted = req.created_at
                ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent';

              const canCancel = (normStatus === 'Pending' || normStatus === 'Accepted') && !isPitch;

              return (
                <div
                  key={req.id}
                  className={`bg-white border rounded-3xl p-6 transition-all duration-300 shadow-soft-sm hover:shadow-soft-md space-y-5 ${
                    isPitch && normStatus === 'Pending'
                      ? 'border-amber-300/90 ring-1 ring-amber-400/20 bg-amber-50/10'
                      : normStatus === 'Accepted'
                      ? 'border-emerald-200/90 ring-1 ring-emerald-500/15'
                      : 'border-stone-200/90'
                  }`}
                >
                  {/* Pitch Highlight Tag if sent by supplier */}
                  {isPitch && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-amber-100/90 via-amber-50 to-sand-50 px-4 py-2 rounded-2xl border border-amber-200 text-xs font-bold text-amber-950">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>⚡ SUPPLIER PROPOSAL / PITCH RECEIVED FOR YOUR EVENT</span>
                      </div>
                      <span className="text-[10px] text-amber-800 uppercase tracking-wider font-semibold">
                        Direct Supplier Bid
                      </span>
                    </div>
                  )}

                  {/* Top Bar with Service, Supplier & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-24 rounded-2xl overflow-hidden shrink-0 shadow-soft-sm bg-stone-100">
                        <Image src={displayImage} alt={service?.name || supplierName} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-taupe font-semibold">{supplierCategory}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border ${badgeClass}`}>
                            {normStatus}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-charcoal">
                          {service?.name || req.requirements || 'Bespoke Celebration Proposal'}
                        </h3>
                        <span className="text-xs text-charcoal/70 font-sans flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-taupe" />
                          <span>Supplier: <strong>{supplierName}</strong> ({supplierCity})</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-stone-400 uppercase font-bold">Proposed Quote</div>
                      <div className="text-xl font-bold text-charcoal font-mono">€{priceNum.toLocaleString()}</div>
                      <span className="text-[11px] text-emerald-700 font-semibold block">
                        20% Escrow Deposit: €{depositNum.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Target Event Date</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {req.requested_date || req.event?.event_date || 'Date TBD'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Celebration Event</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {req.event?.title || 'Private Celebration'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Guest Count</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {req.guest_count || 50} guests
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Date Submitted</span>
                      <span className="text-xs font-semibold text-stone-600 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {dateSubmitted}
                      </span>
                    </div>
                  </div>

                  {/* Pitch Notes & Requirements */}
                  <div className="space-y-2.5">
                    {req.supplier_pitch_notes && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-sand-50 border border-amber-200/90 text-xs text-charcoal leading-relaxed shadow-soft-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Supplier&apos;s Personalized Pitch Note:</span>
                        </div>
                        <p className="text-stone-700 italic font-medium">&quot;{req.supplier_pitch_notes}&quot;</p>
                      </div>
                    )}

                    {req.requirements && !isPitch && (
                      <div className="p-3.5 rounded-2xl bg-sand-50/80 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                        <strong className="text-charcoal block mb-0.5">Your Requirements & Preferences:</strong>
                        {req.requirements}
                      </div>
                    )}

                    {req.supplier_response_notes && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                        <strong className="text-emerald-900 flex items-center gap-1.5 mb-0.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Supplier Response & Notes:</span>
                        </strong>
                        {req.supplier_response_notes}
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Inquiry ID: <span className="font-mono">{req.id?.slice(0, 8)}</span> • Protected by LEEMEVENT Escrow
                    </span>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Accept / Decline Proposal Action Buttons */}
                      {isPitch && normStatus === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleAcceptProposal(req)}
                            disabled={isAccepting}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-soft-sm hover:scale-[1.02] disabled:opacity-50"
                          >
                            {isAccepting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Accepting...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Proposal</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeclineProposal(req)}
                            disabled={isAccepting}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {canCancel && (
                        <button
                          onClick={() => handleOpenCancelModal(req)}
                          className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}

                      {normStatus === 'Accepted' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href="/dashboard/host/cart"
                            className="px-4 py-2 rounded-xl bg-charcoal hover:bg-taupe text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-soft-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-sand" />
                            <span>Pay 20% Deposit</span>
                          </Link>

                          {!req.is_reviewed && (
                            <button
                              onClick={() => handleOpenReviewModal(req)}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                              <span>Give Review & Rating ★</span>
                            </button>
                          )}
                        </div>
                      )}

                      {normStatus === 'Contract Sent' && (
                        <Link
                          href="/dashboard/host/documents"
                          className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-soft-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-sand" />
                          <span>Review & Sign Contract</span>
                        </Link>
                      )}

                      {normStatus === 'Completed' && (
                        <>
                          {req.is_reviewed ? (
                            <span className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-soft-sm">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>Review Submitted ✓</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenReviewModal(req)}
                              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-[1.02] ring-4 ring-amber-400/20"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" />
                              <span>Give Review & Rating ★</span>
                            </button>
                          )}
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const s = req.supplier || req.service?.supplier;
                          setPortfolioModalSupplier(s || {
                            id: req.supplier_id || req.service?.supplier_id,
                            business_name: supplierName,
                            city: supplierCity,
                            category: supplierCategory,
                          });
                          setIsPortfolioModalOpen(true);
                        }}
                        className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-taupe" />
                        <span>Supplier Portfolio</span>
                      </button>

                      <Link
                        href={`/dashboard/host/messages?supplierId=${req.supplier_id || req.supplier?.id || req.service?.supplier_id || ''}&supplierEmail=${encodeURIComponent(req.supplier?.profile?.email || req.supplier?.email || req.service?.supplier?.profile?.email || req.service?.supplier?.email || req.supplier_email || '')}&supplierName=${encodeURIComponent(req.supplier?.business_name || req.supplier?.profile?.full_name || req.service?.supplier?.business_name || req.service?.supplier?.profile?.full_name || req.supplier?.name || 'Specialist Partner')}&service_name=${encodeURIComponent(req.service?.name || req.requirements || 'Celebration Proposal')}`}
                        className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Supplier</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CANCEL BOOKING MODAL */}
        {mounted && cancelModalBooking && createPortal(
          <div
            className="fixed inset-0 z-[999999] w-screen h-screen min-h-[100dvh] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
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
              if (e.target === e.currentTarget) setCancelModalBooking(null);
            }}
          >
            <div className="relative bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden my-auto z-10">
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-charcoal text-base">Cancel Booking Request</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmCancel} className="p-6 space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are you sure you want to cancel your booking inquiry for{' '}
                  <strong className="text-charcoal">{cancelModalBooking.service?.name || 'this service package'}</strong>? 
                  The supplier will be notified that you withdrew the request.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cancellation Reason (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Provide a brief reason (e.g., date changed, budget adjusted)..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setCancelModalBooking(null)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-soft-sm"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Yes, Cancel Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* GIVE REVIEW & RATING MODAL */}
        {mounted && reviewModalBooking && createPortal(
          <div
            className="fixed inset-0 z-[999999] w-screen h-screen min-h-[100dvh] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
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
              if (e.target === e.currentTarget && !reviewSubmitting) setReviewModalBooking(null);
            }}
          >
            <div className="relative bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 z-10">
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-base">Write Verified Review</h3>
                    <span className="text-[11px] text-stone-500">
                      Rate {reviewModalBooking.supplier?.business_name || reviewModalBooking.service?.name || 'Supplier'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !reviewSubmitting && setReviewModalBooking(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reviewSuccessMsg ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-charcoal">Review Published!</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    {reviewSuccessMsg}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmReview} className="p-6 space-y-5">
                  {/* Overall Average Calculation Preview */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider block">
                        Overall Rating Score
                      </span>
                      <span className="text-xs text-amber-900 font-medium">
                        Calculated across all 4 key service criteria
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-soft-sm">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-charcoal font-mono">
                        {((ratingPunctuality + ratingQuality + ratingCommunication + ratingValue) / 4).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">/ 5.0</span>
                    </div>
                  </div>

                  {/* 4 Criteria Star Sliders/Pickers */}
                  <div className="space-y-3.5">
                    {[
                      { label: 'Punctuality & Timeliness', value: ratingPunctuality, setter: setRatingPunctuality },
                      { label: 'Quality of Service & Presentation', value: ratingQuality, setter: setRatingQuality },
                      { label: 'Communication & Responsiveness', value: ratingCommunication, setter: setRatingCommunication },
                      { label: 'Value for Money & Pricing', value: ratingValue, setter: setRatingValue },
                    ].map((crit) => (
                      <div key={crit.label} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                        <span className="text-xs font-semibold text-charcoal">{crit.label}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => crit.setter(star)}
                              className="p-1 hover:scale-125 transition-transform"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= crit.value
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-stone-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-charcoal font-mono ml-1.5 w-4 text-center">
                            {crit.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mandatory Feedback */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5">
                      Written Feedback & Experience * (Mandatory)
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe your experience with this supplier, quality of delivery, setup, and why you would recommend them..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-taupe resize-none"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                    <button
                      type="button"
                      disabled={reviewSubmitting}
                      onClick={() => setReviewModalBooking(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-all flex items-center gap-2 shadow-soft-sm disabled:opacity-50"
                    >
                      {reviewSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing Review...</span>
                        </>
                      ) : (
                        <>
                          <Star className="w-3.5 h-3.5 fill-sand text-sand" />
                          <span>Submit Verified Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* SUPPLIER PORTFOLIO MODAL */}
        <SupplierPortfolioModal
          isOpen={isPortfolioModalOpen}
          onClose={() => setIsPortfolioModalOpen(false)}
          supplierId={portfolioModalSupplier?.id || portfolioModalSupplier?.supplier_id}
          initialSupplier={portfolioModalSupplier}
        />
      </div>
    </HostLayout>
  );
}
