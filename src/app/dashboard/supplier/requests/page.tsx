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
} from 'lucide-react';

export default function SupplierRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Confirmation Modal
  const [activeModalRequest, setActiveModalRequest] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<'accept' | 'reject'>('accept');
  const [responseNotes, setResponseNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await supplierBookingsApi.getMyRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load supplier requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenActionModal = (request: any, action: 'accept' | 'reject') => {
    setActiveModalRequest(request);
    setModalAction(action);
    setResponseNotes(
      action === 'accept'
        ? 'Thank you for your booking request! We are thrilled to confirm our availability for your celebration.'
        : 'Thank you for reaching out. Unfortunately, we are unable to accept this request due to scheduling constraints.'
    );
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalRequest) return;

    try {
      setSubmitting(true);
      const targetStatus = modalAction === 'accept' ? 'accepted' : 'rejected';

      await supplierBookingsApi.updateBookingStatus(
        activeModalRequest.id,
        targetStatus,
        responseNotes
      );

      setActiveModalRequest(null);
      await loadRequests();
    } catch (err: any) {
      alert(`Error updating request: ${err?.message || 'Server error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'availability_confirmed' || s === 'accepted') return 'accepted';
    if (s === 'declined' || s === 'rejected') return 'rejected';
    if (s === 'deposit_paid' || s === 'confirmed') return 'accepted';
    return 'pending';
  };

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    return getNormalizedStatus(r.status) === filterStatus;
  });

  const pendingCount = requests.filter((r) => getNormalizedStatus(r.status) === 'pending').length;

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
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
              Review and manage bespoke requests from event hosts. When you accept an inquiry, the calendar auto-reserves the date and gracefully resolves conflicting requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadRequests}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{pendingCount} Pending Decision</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 bg-white border border-stone-200/80 rounded-2xl p-2 shadow-soft-sm overflow-x-auto">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
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
                ? `Accepted (${requests.filter((r) => getNormalizedStatus(r.status) === 'accepted').length})`
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

              return (
                <div
                  key={req.id}
                  className="bg-white border border-stone-200/90 rounded-3xl p-6 transition-all duration-300 shadow-soft-sm hover:shadow-soft-md space-y-5"
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
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accepted & Confirmed</span>
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

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {normStatus === 'pending'
                        ? `Accepting will reserve ${reqDate} and confirm booking.`
                        : `Status: ${normStatus.toUpperCase()}`}
                    </span>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <Link
                        href={`/dashboard/supplier/messages?hostId=${creator?.id || creator?.auth_user_id || req.consumer_id || ''}&hostEmail=${encodeURIComponent(creator?.email || req.consumer_email || '')}&hostName=${encodeURIComponent(creator?.full_name || hostName || 'Valued Host')}`}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-taupe" />
                        <span>Chat with Host</span>
                      </Link>

                      {normStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOpenActionModal(req, 'reject')}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleOpenActionModal(req, 'accept')}
                            className="flex-1 sm:flex-initial px-6 py-2 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-soft-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Request</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ACCEPT / REJECT CONFIRMATION MODAL */}
        {activeModalRequest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                    modalAction === 'accept' ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}>
                    {modalAction === 'accept' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-charcoal">
                      {modalAction === 'accept' ? 'Confirm Booking Acceptance' : 'Decline Booking Request'}
                    </h2>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Event Date: {activeModalRequest.requested_date || 'N/A'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalRequest(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmAction} className="p-6 space-y-4">
                {modalAction === 'accept' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Timing Conflict Auto-Resolution</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-amber-900/90">
                      Accepting this inquiry will automatically reserve your calendar for <strong>{activeModalRequest.requested_date}</strong>. Any other pending requests for the same date will be gracefully auto-declined.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-charcoal mb-1.5 block">
                    Message to Host / Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={responseNotes}
                    onChange={(e) => setResponseNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-taupe resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalRequest(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${
                      modalAction === 'accept'
                        ? 'bg-charcoal hover:bg-taupe'
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>{modalAction === 'accept' ? 'Confirm & Accept' : 'Decline Request'}</span>
                    )}
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
