'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { supplierBookingsApi } from '@/lib/services/consumerApi';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  Check,
  ShieldCheck,
  Tag,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function SupplierRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'rejected'>('all');

  // Confirmation Modal
  const [activeModalRequest, setActiveModalRequest] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | 'mark_done'>('accept');
  const [responseNotes, setResponseNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'completed' || s === 'done') return 'completed';
    if (s === 'availability_confirmed' || s === 'accepted' || s === 'deposit_paid' || s === 'confirmed' || s === 'contract_sent' || s === 'active') return 'accepted';
    if (s === 'declined' || s === 'rejected' || s === 'cancelled') return 'rejected';
    return 'pending';
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await supplierBookingsApi.getMyRequests();
      const enhanced = (data || []).map((r: any) => {
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(`LEEMEVENTS_BOOKING_STATUS_${r.id}`);
          if (cached) return { ...r, status: cached };
        }
        return r;
      });
      setRequests(enhanced);
    } catch (err) {
      console.error('Failed to load supplier requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenActionModal = (request: any, action: 'accept' | 'reject' | 'mark_done') => {
    setActiveModalRequest(request);
    setModalAction(action);
    if (action === 'accept') {
      setResponseNotes('Thank you for your booking request! We are thrilled to confirm our availability for your celebration.');
    } else if (action === 'reject') {
      setResponseNotes('Thank you for reaching out. Unfortunately, we are unable to accept this request due to scheduling constraints.');
    } else {
      setResponseNotes('Event has been successfully delivered and completed with luxury standards.');
    }
  };

  // 1-Click Fast Mark Done without modal friction
  const handleDirectMarkDone = async (req: any) => {
    const targetId = req.id;
    setActionLoadingId(targetId);

    // Optimistically update local state immediately
    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetId ? { ...r, status: 'completed' } : r
      )
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${targetId}`, 'completed');
    }

    showToast('✨ Event successfully marked as Completed! Host can now submit their verified review.');

    try {
      await supplierBookingsApi.updateBookingStatus(
        targetId,
        'completed',
        'Event services completed by supplier.'
      );
    } catch (err) {
      console.warn('Backend mark-done sync notice:', err);
    } finally {
      setActionLoadingId(null);
      loadRequests();
    }
  };

  // 1-Click Fast Accept
  const handleDirectAccept = async (req: any) => {
    const targetId = req.id;
    setActionLoadingId(targetId);

    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetId ? { ...r, status: 'accepted' } : r
      )
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${targetId}`, 'accepted');
    }

    showToast('✓ Booking Accepted! You can now click "Mark as Done" once event services are delivered.');

    try {
      await supplierBookingsApi.updateBookingStatus(
        targetId,
        'accepted',
        'Booking confirmed by supplier.'
      );
    } catch (err) {
      console.warn('Backend accept sync notice:', err);
    } finally {
      setActionLoadingId(null);
      loadRequests();
    }
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalRequest) return;

    const targetId = activeModalRequest.id;
    let targetStatus = 'accepted';
    if (modalAction === 'reject') targetStatus = 'rejected';
    if (modalAction === 'mark_done') targetStatus = 'completed';

    // Optimistically update
    setRequests((prev) =>
      prev.map((r) =>
        r.id === targetId ? { ...r, status: targetStatus, supplier_response_notes: responseNotes } : r
      )
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${targetId}`, targetStatus);
    }

    try {
      setSubmitting(true);
      await supplierBookingsApi.updateBookingStatus(
        targetId,
        targetStatus,
        responseNotes
      );

      if (targetStatus === 'completed') {
        showToast('✨ Event marked as Completed! Host review unlocked.');
      } else if (targetStatus === 'accepted') {
        showToast('✓ Booking confirmed! "Mark as Done" button is now active.');
      }

      setActiveModalRequest(null);
    } catch (err: any) {
      alert(`Error updating request: ${err?.message || 'Server error'}`);
    } finally {
      setSubmitting(false);
      loadRequests();
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    return getNormalizedStatus(r.status) === filterStatus;
  });

  const pendingCount = requests.filter((r) => getNormalizedStatus(r.status) === 'pending').length;
  const acceptedCount = requests.filter((r) => getNormalizedStatus(r.status) === 'accepted').length;

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Toast Notification Banner */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-charcoal text-sand px-5 py-3 rounded-2xl shadow-2xl border border-taupe/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Inquiries Queue
              </span>
              <span className="text-xs text-stone-500 font-medium">Synced with Supabase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Incoming Booking Requests & Quotes
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Review and manage bespoke requests from event hosts. Accept requests to confirm availability, and click <strong>&quot;Mark as Done&quot;</strong> when finished so hosts can rate and review your service.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadRequests}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {acceptedCount > 0 && (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{acceptedCount} In-Progress (Ready to Complete)</span>
              </div>
            )}

            {pendingCount > 0 && (
              <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2 shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{pendingCount} Pending Decision</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 bg-white border border-stone-200/80 rounded-2xl p-2 shadow-soft-sm overflow-x-auto">
          {(['all', 'pending', 'accepted', 'completed', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-charcoal text-white shadow-soft-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {status === 'all'
                ? `All Inquiries (${requests.length})`
                : status === 'pending'
                ? `Pending (${requests.filter((r) => getNormalizedStatus(r.status) === 'pending').length})`
                : status === 'accepted'
                ? `Accepted / In-Progress (${requests.filter((r) => getNormalizedStatus(r.status) === 'accepted').length})`
                : status === 'completed'
                ? `Completed (${requests.filter((r) => getNormalizedStatus(r.status) === 'completed').length})`
                : `Declined (${requests.filter((r) => getNormalizedStatus(r.status) === 'rejected').length})`}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Syncing booking requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-3 shadow-soft-sm">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-charcoal text-base">No booking requests found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {filterStatus !== 'all'
                ? `No requests match the "${filterStatus}" filter.`
                : 'As event hosts browse your services and send quote requests, they will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const creator = req.event?.creator;
              const eventTitle = req.event?.title || req.event?.name || 'Private Celebration';
              const hostName = creator?.full_name || creator?.email || 'Valued Host';
              const reqDate = req.requested_date || req.event?.event_date || 'Date TBD';
              const normStatus = getNormalizedStatus(req.status);
              const serviceName = req.service?.name || 'Custom Package Inquiry';
              const isActionLoading = actionLoadingId === req.id;

              return (
                <div
                  key={req.id}
                  className={`bg-white border rounded-3xl p-6 transition-all duration-300 shadow-soft-sm hover:shadow-soft-md space-y-5 ${
                    normStatus === 'accepted'
                      ? 'border-emerald-200/90 ring-1 ring-emerald-500/15'
                      : 'border-stone-200/90'
                  }`}
                >
                  {/* Top Bar with Host Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-charcoal text-white font-bold flex items-center justify-center text-sm shadow-soft-sm shrink-0">
                        {hostName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-charcoal text-base">{eventTitle}</h3>
                          <span className="text-xs text-stone-400 font-normal">by {hostName}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium block">
                          Client Email: <strong>{creator?.email || 'Registered Host'}</strong> {creator?.phone ? `• Phone: ${creator.phone}` : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      {normStatus === 'pending' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Supplier Review</span>
                        </span>
                      ) : normStatus === 'accepted' ? (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-soft-sm animate-pulse">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Accepted & Confirmed</span>
                        </span>
                      ) : normStatus === 'completed' ? (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          <span>Event Completed ✓ (Host Review Active)</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Request Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Event Date</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {reqDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Location</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {req.event?.city || 'Madrid'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Guest Count</span>
                      <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-taupe shrink-0" />
                        {req.guest_count || req.event?.guest_count || 'Flexible'} guests
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Quote / Budget</span>
                      <span className="text-sm font-bold text-charcoal flex items-center gap-1 mt-0.5 font-mono">
                        €{Number(req.quote_amount || req.service?.base_price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Service & Requirements */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Tag className="w-3.5 h-3.5 text-taupe" />
                      <span className="font-semibold text-charcoal">Requested Service:</span>
                      <span className="text-stone-700">{serviceName}</span>
                    </div>

                    {req.requirements && (
                      <div className="p-3 rounded-xl bg-sand-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                        <strong className="text-charcoal block mb-0.5">Host Requirements & Notes:</strong>
                        {req.requirements}
                      </div>
                    )}

                    {req.supplier_response_notes && (
                      <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                        <strong className="text-charcoal block mb-0.5">Supplier Response:</strong>
                        {req.supplier_response_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar (With Mark as Done & Accept Controls) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {normStatus === 'pending'
                        ? `Accept to reserve ${reqDate}. Or click "Accept & Mark Done" if event already took place.`
                        : normStatus === 'accepted'
                        ? 'Confirmed booking. Click "Mark as Done" once event services are delivered.'
                        : normStatus === 'completed'
                        ? 'Event completed. Host has been invited to submit a verified review.'
                        : `Status: ${normStatus.toUpperCase()}`}
                    </span>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap justify-end">
                      <Link
                        href={`/dashboard/supplier/messages?hostId=${creator?.id || creator?.auth_user_id || req.consumer_id || ''}&hostEmail=${encodeURIComponent(creator?.email || req.consumer_email || '')}&hostName=${encodeURIComponent(creator?.full_name || hostName || 'Valued Host')}&bookingId=${req.id}`}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-taupe" />
                        <span>Chat with Host</span>
                      </Link>

                      {normStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOpenActionModal(req, 'reject')}
                            disabled={isActionLoading}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleDirectAccept(req)}
                            disabled={isActionLoading}
                            className="px-4 py-2 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-soft-sm"
                          >
                            {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>Accept Request</span>
                          </button>
                          <button
                            onClick={() => handleDirectMarkDone(req)}
                            disabled={isActionLoading}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                            title="Accept and mark event as completed in one click"
                          >
                            {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>✓ Accept & Mark Done</span>
                          </button>
                        </>
                      )}

                      {normStatus === 'accepted' && (
                        <button
                          onClick={() => handleDirectMarkDone(req)}
                          disabled={isActionLoading}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] ring-4 ring-emerald-500/20"
                          title="Click to mark event delivered. Unlocks host review."
                        >
                          {isActionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-amber-200" />
                          )}
                          <span>✓ Mark as Done (Event Completed)</span>
                        </button>
                      )}

                      {normStatus === 'completed' && (
                        <span className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5 shadow-soft-sm">
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          <span>Completed • Host Review Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACCEPT / REJECT / MARK DONE CONFIRMATION MODAL */}
        {activeModalRequest && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModalRequest(null);
            }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  {modalAction === 'accept' ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : modalAction === 'mark_done' ? (
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-charcoal text-base">
                      {modalAction === 'accept'
                        ? 'Confirm & Accept Booking'
                        : modalAction === 'mark_done'
                        ? 'Mark Event as Completed'
                        : 'Decline Booking Request'}
                    </h3>
                    <span className="text-[11px] text-stone-500 block">
                      {activeModalRequest.event?.title || 'Celebration Event'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalRequest(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmAction} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">
                    {modalAction === 'accept'
                      ? 'Confirmation Message to Host'
                      : modalAction === 'mark_done'
                      ? 'Event Delivery / Completion Notes'
                      : 'Reason for Declining'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-2xl p-3.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalRequest(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-soft-sm flex items-center gap-2 ${
                      modalAction === 'accept'
                        ? 'bg-charcoal hover:bg-taupe'
                        : modalAction === 'mark_done'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>
                      {modalAction === 'accept'
                        ? 'Confirm Acceptance'
                        : modalAction === 'mark_done'
                        ? 'Confirm Event Completed ✓'
                        : 'Confirm Decline'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
