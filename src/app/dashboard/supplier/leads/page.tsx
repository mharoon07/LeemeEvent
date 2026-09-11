'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import {
  eventsApi,
  supplierPortalApi,
  normalizeCategory,
  decodeServiceDescription
} from '@/lib/services/consumerApi';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Coins,
  Send,
  Search,
  Filter,
  CheckCircle2,
  X,
  Loader2,
  Building2,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Tag,
  Check,
  Briefcase,
  Layers,
  ChevronRight,
  Clock,
  Sparkle
} from 'lucide-react';

const PITCH_PRESET_TAGS = [
  '⚡ 100% Available On Your Date',
  '🏆 Luxury & VIP Service Standards',
  '✨ Fully Customizable Package',
  '🍽️ Free Tasting & Menu Consultation',
  '📸 Full Day + Drone Coverage Included',
  '🎵 High-End Acoustic & Sound Setup',
];

export default function SupplierLeadsMarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Proposal Modal State
  const [selectedEventForProposal, setSelectedEventForProposal] = useState<any | null>(null);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    service_id: '',
    service_name: 'Bespoke Celebration Package',
    quote_amount: 2400,
    requirements: 'Tailored luxury service package matching all host event requirements.',
    supplier_pitch_notes: 'Hello! We saw your celebration details and our team would love to make this unforgettable for you and your guests.',
  });

  const [submittedEventIds, setSubmittedEventIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsList, servicesList] = await Promise.all([
        eventsApi.getMarketplaceEvents(),
        supplierPortalApi.getServices().catch(() => []),
      ]);

      setLeads(eventsList || []);
      setMyServices(servicesList || []);

      // Check submitted proposals
      if (typeof window !== 'undefined') {
        const submittedMap: string[] = [];
        (eventsList || []).forEach((ev: any) => {
          if (localStorage.getItem(`LEEMEVENTS_PROPOSAL_SUBMITTED_${ev.id}`)) {
            submittedMap.push(ev.id);
          }
        });
        setSubmittedEventIds(submittedMap);
      }
    } catch (err) {
      console.error('Failed to load marketplace leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Prevent background scroll when proposal modal is open
  const isModalOpen = Boolean(selectedEventForProposal);
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (originalPaddingRight > 0) {
        document.body.style.paddingRight = `${originalPaddingRight}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedEventForProposal(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModalOpen]);

  const handleOpenProposalModal = (lead: any) => {
    setSelectedEventForProposal(lead);
    setProposalSuccess(false);

    const defaultService = myServices[0];
    const initialPrice = defaultService ? Number(defaultService.base_price) : Math.min(lead.estimated_budget ? Math.round(lead.estimated_budget * 0.15) : 2500, 3500);

    setProposalForm({
      service_id: defaultService?.id || '',
      service_name: defaultService?.name || 'Bespoke Celebration Package',
      quote_amount: initialPrice || 2400,
      requirements: defaultService ? defaultService.name : 'Tailored luxury service package matching all host event requirements.',
      supplier_pitch_notes: `Hello! We saw your ${lead.title || lead.type || 'celebration'} in ${lead.city || 'your area'} and would love to deliver a seamless, 5-star experience for your ${lead.guest_count || 100} guests.`,
    });
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForProposal) return;
    setProposalSubmitting(true);

    try {
      const deposit = Math.round((Number(proposalForm.quote_amount) * 20) / 100);
      const supplierBusinessName = user?.businessName || user?.name || 'Verified Supplier';

      await eventsApi.sendProposal(selectedEventForProposal.id, {
        quote_amount: Number(proposalForm.quote_amount),
        deposit_amount: deposit,
        service_id: proposalForm.service_id || undefined,
        service_name: proposalForm.service_name,
        requirements: proposalForm.requirements,
        supplier_pitch_notes: proposalForm.supplier_pitch_notes,
        supplier_id: user?.id,
        supplier_name: supplierBusinessName,
        supplier_category: (user as any)?.category || (user as any)?.businessCategory || 'Event Specialist',
        event_title: selectedEventForProposal.title,
        event_date: selectedEventForProposal.event_date || selectedEventForProposal.date,
        city: selectedEventForProposal.city,
        guest_count: selectedEventForProposal.guest_count,
        host_email: selectedEventForProposal.creator?.email || 'host@leemevents.com',
        host_name: selectedEventForProposal.creator?.full_name || 'Event Host',
      });

      setSubmittedEventIds((prev) => [...prev, selectedEventForProposal.id]);
      setProposalSuccess(true);
    } catch (err: any) {
      alert(`Could not send proposal: ${err?.message || 'Server error'}`);
    } finally {
      setProposalSubmitting(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchQuery ||
      lead.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'All' || lead.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchesType = selectedType === 'All' || lead.type?.toLowerCase() === selectedType.toLowerCase() || lead.event_type?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearch && matchesCity && matchesType;
  });

  const citiesList = Array.from(new Set(leads.map((l) => l.city).filter(Boolean)));
  const typesList = Array.from(new Set(leads.map((l) => l.type || l.event_type).filter(Boolean)));

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
        {/* Hero Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-charcoal via-stone-900 to-charcoal text-sand rounded-3xl p-6 sm:p-10 shadow-soft-xl border border-stone-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-taupe/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/25 text-amber-300 border border-taupe/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Host Celebrations Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Host Events & Booking Opportunities
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Discover active weddings, corporate galas, and private celebrations created by verified hosts. Submit personalized proposals, quote your packages, and get booked directly.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-taupe/30 flex items-center justify-center text-amber-300">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white block leading-none">
                  {leads.length}
                </span>
                <span className="text-[11px] text-stone-300 uppercase tracking-wider font-semibold mt-1 block">
                  Active Host Leads
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-soft-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search celebrations by title, theme, city, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-charcoal placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
              />
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <div className="relative shrink-0">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-taupe bg-white shadow-soft-xs"
                >
                  <option value="All">📍 All Cities</option>
                  {citiesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Type Filter */}
              <div className="relative shrink-0">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-taupe bg-white shadow-soft-xs"
                >
                  <option value="All">🎉 All Event Types</option>
                  {typesList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-9 h-9 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Scanning open host celebrations in database...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-3 shadow-soft-sm">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-charcoal text-base">No matching celebrations found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your city or search criteria. As hosts create new celebrations across Europe, they will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => {
              const isSubmitted = submittedEventIds.includes(lead.id);
              const hostName = lead.creator?.full_name || 'Event Host';
              const hostAvatar = lead.creator?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(hostName)}`;

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-soft-md flex flex-col justify-between overflow-hidden group ${
                    isSubmitted ? 'border-emerald-200/90 ring-1 ring-emerald-400/20' : 'border-stone-200/90'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={hostAvatar}
                          alt={hostName}
                          className="w-10 h-10 rounded-2xl object-cover border border-stone-200/80 shadow-soft-xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-charcoal block leading-snug">
                            {hostName}
                          </span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            Host Client
                          </span>
                        </div>
                      </div>

                      {isSubmitted ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Proposal Sent</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sand-100 text-taupe border border-sand-200">
                          {lead.type || lead.event_type || 'Celebration'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-charcoal group-hover:text-taupe transition-colors leading-tight line-clamp-1">
                        {lead.title || 'Untitled Celebration'}
                      </h3>
                      {lead.description && (
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {lead.description}
                        </p>
                      )}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Calendar className="w-3.5 h-3.5 text-taupe shrink-0" />
                        <span className="truncate font-medium">{lead.event_date || lead.date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-taupe shrink-0" />
                        <span className="truncate font-medium">{lead.city || 'City TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Users className="w-3.5 h-3.5 text-taupe shrink-0" />
                        <span className="truncate font-medium">{lead.guest_count || 100} guests</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-bold text-emerald-800">
                          Budget €{Number(lead.estimated_budget || 20000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-3">
                    {isSubmitted ? (
                      <div className="w-full flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pitch Delivered to Host</span>
                        </span>
                        <Link
                          href={`/dashboard/supplier/messages?recipient_email=${encodeURIComponent(lead.creator?.email || 'host@leemevents.com')}&recipient_name=${encodeURIComponent(hostName)}&service_name=${encodeURIComponent(lead.title || 'Celebration Proposal')}`}
                          className="px-3 py-1.5 rounded-xl bg-charcoal text-white text-[11px] font-bold hover:bg-taupe transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenProposalModal(lead)}
                        className="w-full py-2.5 rounded-2xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-all shadow-soft-xs hover:shadow-soft-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Proposal to Host</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FULL 100VH SUPPLIER PROPOSAL REACT PORTAL MODAL */}
        {mounted &&
          selectedEventForProposal &&
          createPortal(
            <div
              className="fixed inset-0 z-[999999] w-screen h-[100dvh] min-h-screen bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain"
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
                if (e.target === e.currentTarget) setSelectedEventForProposal(null);
              }}
            >
              <div
                className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-stone-200/90 flex items-start justify-between bg-gradient-to-r from-stone-50 to-stone-100/60 shrink-0">
                  <div className="space-y-1 pr-6">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-taupe uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Direct Proposal & Pitch Engine</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-charcoal leading-tight">
                      Pitch to &quot;{selectedEventForProposal.title}&quot;
                    </h2>
                    <p className="text-xs text-stone-500">
                      Host: <strong>{selectedEventForProposal.creator?.full_name || 'Event Host'}</strong> • {selectedEventForProposal.city} • {selectedEventForProposal.guest_count || 100} Guests
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEventForProposal(null)}
                    className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors shrink-0"
                    title="Close proposal modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                  {proposalSuccess ? (
                    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-6 bg-gradient-to-br from-emerald-50 to-sand-50 border border-emerald-200/90 rounded-3xl text-center space-y-3 shadow-soft-sm">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Proposal Live in Host Portal
                          </span>
                          <h3 className="text-xl font-bold text-emerald-950 mt-2">
                            Proposal Delivered Successfully!
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mt-1">
                            Your bespoke quote of <strong>€{Number(proposalForm.quote_amount).toLocaleString()}</strong> has been submitted to <strong>{selectedEventForProposal.creator?.full_name || 'the host'}</strong>. The host can now accept your quote or message you to coordinate details.
                          </p>
                        </div>

                        {/* Proposal Receipt */}
                        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-left space-y-2.5 text-xs shadow-sm">
                          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                            <span className="text-stone-500 font-medium">Target Event:</span>
                            <span className="font-bold text-charcoal">{selectedEventForProposal.title}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                            <span className="text-stone-500 font-medium">Offered Package:</span>
                            <span className="font-bold text-charcoal">{proposalForm.service_name}</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                            <span className="text-stone-500 font-medium">Proposed Quote:</span>
                            <span className="font-bold text-taupe font-mono text-sm">
                              €{Number(proposalForm.quote_amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500 font-medium">20% Escrow Deposit:</span>
                            <span className="font-bold text-emerald-700 font-mono text-sm">
                              €{Math.round((Number(proposalForm.quote_amount) * 20) / 100).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProposalSuccess(false);
                            setSelectedEventForProposal(null);
                          }}
                          className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          Browse More Celebrations
                        </button>
                        <Link
                          href={`/dashboard/supplier/messages?recipient_email=${encodeURIComponent(selectedEventForProposal.creator?.email || 'host@leemevents.com')}&recipient_name=${encodeURIComponent(selectedEventForProposal.creator?.full_name || 'Event Host')}&service_name=${encodeURIComponent(selectedEventForProposal.title || 'Celebration Proposal')}`}
                          className="flex-1 py-3 rounded-2xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-soft-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message Host Now</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSendProposal} className="space-y-4">
                      {/* Service Package Selection */}
                      {myServices.length > 0 && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Select Matching Service Package
                          </label>
                          <select
                            value={proposalForm.service_id}
                            onChange={(e) => {
                              const found = myServices.find((s) => s.id === e.target.value);
                              if (found) {
                                setProposalForm({
                                  ...proposalForm,
                                  service_id: found.id,
                                  service_name: found.name,
                                  quote_amount: Number(found.base_price) || proposalForm.quote_amount,
                                });
                              }
                            }}
                            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50"
                          >
                            {myServices.map((srv) => (
                              <option key={srv.id} value={srv.id}>
                                📦 {srv.name} (Base: €{Number(srv.base_price).toLocaleString()})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Proposed Quote Amount */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            Proposed Quote (€) *
                          </label>
                          <input
                            type="number"
                            required
                            min={100}
                            value={proposalForm.quote_amount}
                            onChange={(e) =>
                              setProposalForm({ ...proposalForm, quote_amount: Number(e.target.value) })
                            }
                            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                            20% Escrow Deposit
                          </label>
                          <div className="px-3.5 py-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 font-mono font-bold text-xs sm:text-sm flex items-center justify-between">
                            <span>€{Math.round((Number(proposalForm.quote_amount || 0) * 20) / 100).toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-700 font-sans font-semibold">Auto-calculated</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Pitch Tags */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                            Pitch Highlights / Tags
                          </label>
                          <span className="text-[11px] text-stone-400">Click to append:</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {PITCH_PRESET_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setProposalForm({
                                  ...proposalForm,
                                  supplier_pitch_notes: `${proposalForm.supplier_pitch_notes} | ${tag}`,
                                });
                              }}
                              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors border border-stone-200/80"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                          Personalized Pitch & Cover Note *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={proposalForm.supplier_pitch_notes}
                          onChange={(e) =>
                            setProposalForm({ ...proposalForm, supplier_pitch_notes: e.target.value })
                          }
                          placeholder="Introduce your team, confirm equipment/timing, and explain why your package is perfect for their celebration..."
                          className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-taupe bg-stone-50/50 resize-none"
                        />
                      </div>

                      {/* Modal Footer */}
                      <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setSelectedEventForProposal(null)}
                          className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={proposalSubmitting}
                          className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-soft-sm disabled:opacity-50"
                        >
                          {proposalSubmitting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending Proposal to Host...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Official Proposal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </SupplierLayout>
  );
}
