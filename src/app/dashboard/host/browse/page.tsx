'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import {
  suppliersApi,
  eventsApi,
  bookingsApi,
  normalizeCategory,
  decodeServiceDescription
} from '@/lib/services/consumerApi';
import { Category, EventItem } from '@/types/api';
import {
  Star,
  ShieldCheck,
  Plus,
  Check,
  Search,
  Filter,
  Send,
  Loader2,
  X,
  Sparkles,
  RefreshCw,
  Package,
  Building2,
  Clock,
  Users,
  Coins,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  MapPin,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { api } from '@/lib/api';
import SupplierPortfolioModal from '@/components/SupplierPortfolioModal';

export default function BrowseSuppliersPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'suppliers'>('services');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);

  // Supplier Portfolio Modal State
  const [portfolioModalSupplier, setPortfolioModalSupplier] = useState<any | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);

  const handleOpenPortfolioModal = (supplier: any) => {
    setPortfolioModalSupplier(supplier);
    setIsPortfolioModalOpen(true);
  };

  // Direct Service Booking Modal State
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<any | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    event_id: '',
    requested_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    guest_count: 100,
    requirements: 'Hello, we would like to reserve this service package for our celebration.',
  });

  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    event_date: '2026-09-18',
    city: 'Amsterdam',
    guest_count: 120,
    requirements: 'Interested in reserving package services for our luxury celebration.',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, sups, servs, evList] = await Promise.all([
        suppliersApi.getCategories(),
        suppliersApi.getSuppliers(),
        suppliersApi.getServices(),
        eventsApi.getEvents(),
      ]);
      setCategories(cats || []);
      setSuppliers(sups || []);
      setServices(servs || []);
      setEvents(evList || []);
    } catch (err) {
      console.error('Error loading marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleSelectSupplier = (id: string) => {
    setSelectedSupplierIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenBookingModal = (service: any) => {
    setSelectedServiceForBooking(service);
    setBookingSuccess(false);
  };

  const handleDirectServiceBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceForBooking) return;

    setBookingSubmitting(true);
    try {
      const supplierId = selectedServiceForBooking.supplier_id || selectedServiceForBooking.supplier?.id;
      const payload: any = {
        supplier_id: supplierId,
        service_id: selectedServiceForBooking.id,
        event_name: selectedServiceForBooking.name ? `${selectedServiceForBooking.name} Celebration` : 'Bespoke Celebration Experience',
        requested_date: bookingForm.requested_date,
        guest_count: Number(bookingForm.guest_count) || 50,
        requirements: bookingForm.requirements || 'Requested directly via marketplace',
        quote_amount: Number(selectedServiceForBooking.base_price) || 1500,
        deposit_amount: ((Number(selectedServiceForBooking.base_price) || 1500) * (Number(selectedServiceForBooking.deposit_percentage) || 20)) / 100,
      };

      await bookingsApi.createBooking(payload);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedServiceForBooking(null);
      }, 2500);
    } catch (err: any) {
      console.error('Service direct booking error:', err);
      alert(`Booking request error: ${err?.message || 'Please try again.'}`);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplierIds.length === 0) return;

    setBroadcastSubmitting(true);
    try {
      await eventsApi.broadcastRequest({
        supplier_ids: selectedSupplierIds,
        event_date: broadcastForm.event_date,
        city: broadcastForm.city,
        guest_count: Number(broadcastForm.guest_count),
        requirements: broadcastForm.requirements,
      });
      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setIsBroadcastModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Broadcast request error', err);
    } finally {
      setBroadcastSubmitting(false);
    }
  };

  // Filter Services
  const filteredServices = services.filter((s) => {
    const { text } = decodeServiceDescription(s.description);
    const sCat = s.category || s.supplier?.category || s.supplier?.category_id || '';
    const catName = typeof sCat === 'object' ? sCat.name || sCat.slug : String(sCat);
    const matchesCategory =
      selectedCategory === 'All' ||
      catName.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      s.name.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      text.toLowerCase().includes(query) ||
      (s.supplier?.business_name && s.supplier.business_name.toLowerCase().includes(query)) ||
      (s.supplier?.city && s.supplier.city.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Filter Suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    const sCat = normalizeCategory(s.category || s.categories || s.category_id || '');
    const hasServiceMatch = Array.isArray(s.services) && s.services.some((srv: any) =>
      srv.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesCategory =
      selectedCategory === 'All' || sCat.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      (s.business_name || s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      hasServiceMatch;

    return matchesCategory && matchesSearch;
  });

  return (
    <HostLayout>
      <div className="space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Marketplace & Specialist Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Explore Event Services & Vetted Partners
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Browse newly published bespoke packages, view custom photos and descriptions, and reserve services directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-[#FAF8F5] text-stone-600 shadow-soft-sm transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Marketplace"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-taupe' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {selectedSupplierIds.length > 0 && (
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-soft-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast ({selectedSupplierIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* VIEW TAB SWITCHER & SEARCH BAR */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="inline-flex bg-stone-100/80 p-1 rounded-2xl border border-stone-200/70">
              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'services'
                    ? 'bg-charcoal text-white shadow-soft-sm'
                    : 'text-stone-600 hover:text-charcoal hover:bg-stone-200/50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Service Packages ({filteredServices.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'suppliers'
                    ? 'bg-charcoal text-white shadow-soft-sm'
                    : 'text-stone-600 hover:text-charcoal hover:bg-stone-200/50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Supplier Directory ({filteredSuppliers.length})</span>
              </button>
            </div>

            {/* Direct Total Count Indicator */}
            <div className="text-xs font-medium text-stone-500 flex items-center gap-1.5 self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Database Synced</span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-taupe absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'services' ? "Search services (e.g., mixology, floral, banquet, master class)..." : "Search suppliers by business name, city, or specialty..."}
                className="w-full bg-white border border-stone-200/90 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe shadow-soft-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-taupe text-white shadow-soft-sm'
                    : 'bg-white border border-stone-200/90 text-charcoal hover:bg-stone-100/80'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const catName = normalizeCategory(cat);
                return (
                  <button
                    key={cat.id || catName}
                    type="button"
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === catName
                        ? 'bg-taupe text-white shadow-soft-sm'
                        : 'bg-white border border-stone-200/90 text-charcoal hover:bg-stone-100/80'
                    }`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-taupe mx-auto mb-3" />
            <p className="text-sm font-medium text-stone-600">Loading marketplace listings...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: SERVICES FEED VIEW */}
            {activeTab === 'services' && (
              <div>
                {filteredServices.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/90 p-8">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-charcoal">No Service Packages Found</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      Try adjusting your search keyword or selecting &quot;All Categories&quot; to see newly added supplier packages.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => {
                      const supplierName = service.supplier?.business_name || service.supplier?.profile?.full_name || 'Verified Supplier Partner';
                      const city = service.supplier?.city || 'Amsterdam';
                      const { text: cleanDesc, image_url: cardImage } = decodeServiceDescription(service.description);
                      const displayImage = cardImage || (service.supplier?.portfolio && service.supplier.portfolio[0]?.media_url) || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop';

                      return (
                        <div
                          key={service.id}
                          className="bg-white border border-stone-200/90 hover:border-taupe/50 rounded-3xl p-5 transition-all shadow-soft-sm hover:shadow-soft-md flex flex-col justify-between group relative"
                        >
                          <div className="space-y-3.5">
                            {/* Service Image Banner */}
                            <div className="relative h-48 w-full overflow-hidden bg-stone-900 rounded-2xl">
                              <img
                                src={displayImage}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-taupe shadow-soft-sm">
                                <MapPin className="w-3 h-3" />
                                <span>{city}</span>
                              </div>
                              {Number(service.review_count || service.supplier?.review_count || 0) > 0 && Number(service.rating_avg || service.supplier?.rating_avg || 0) > 0 ? (
                                <div className="absolute top-3 right-3 bg-amber-500/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold text-white shadow-soft-sm">
                                  <Star className="w-3 h-3 fill-white" />
                                  <span>{Number(service.rating_avg || service.supplier?.rating_avg).toFixed(1)}</span>
                                  <span className="text-[10px] text-white/80 font-normal">({service.review_count || service.supplier?.review_count})</span>
                                </div>
                              ) : (
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-charcoal shadow-soft-sm">
                                  <Sparkles className="w-3 h-3 text-taupe" />
                                  <span>New Listing</span>
                                </div>
                              )}
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="text-[10px] text-stone-200 uppercase font-bold block">Provided by</span>
                                <span className="text-xs font-bold">{supplierName}</span>
                              </div>
                            </div>

                            {/* Service Title */}
                            <div>
                              <h3 className="text-lg font-bold text-charcoal group-hover:text-taupe transition-colors tracking-tight">
                                {service.name}
                              </h3>
                            </div>

                            {/* Prominent Description Display */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block">Description & Inclusions:</span>
                              <p className="text-xs text-stone-700 leading-relaxed line-clamp-3 bg-stone-50/80 p-3 rounded-2xl border border-stone-100">
                                {cleanDesc || 'Bespoke event package tailored for high-end celebrations and luxury gatherings.'}
                              </p>
                            </div>

                            {/* Metrics Bar: Duration & Completed Orders */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50/80 px-2.5 py-2 rounded-xl">
                                <Clock className="w-3.5 h-3.5 text-taupe shrink-0" />
                                <span className="truncate">{service.duration_minutes ? `${service.duration_minutes} mins` : '120 mins'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/90 px-2.5 py-2 rounded-xl border border-emerald-200/70 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  {Number(service.order_count || service.orders_completed || service.bookings_count || 0) > 0
                                    ? `${service.order_count || service.orders_completed || service.bookings_count} Orders Delivered`
                                    : 'Inquiries Open'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-[10px] text-stone-400 uppercase font-bold">Rate</div>
                              <div className="text-lg font-bold text-charcoal font-mono">
                                €{Number(service.base_price).toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenPortfolioModal(service.supplier || { id: service.supplier_id, name: supplierName, business_name: supplierName, city })}
                                className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
                                title="View Supplier Portfolio & Experience"
                              >
                                <Briefcase className="w-4 h-4 text-taupe" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenBookingModal(service)}
                                className="btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-soft-sm hover:scale-[1.02] transition-transform"
                              >
                                <span>Book / Inquire</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SUPPLIERS DIRECTORY VIEW */}
            {activeTab === 'suppliers' && (
              <div>
                {filteredSuppliers.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/90 p-8">
                    <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-charcoal">No Suppliers Found</h3>
                    <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                      Try searching with another keyword or resetting category filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map((sup) => {
                      const isSelected = selectedSupplierIds.includes(sup.id);
                      const name = sup.business_name || sup.name || 'Verified Supplier';
                      const catDisplay = normalizeCategory(sup.category || sup.categories);
                      const price = sup.starting_price
                        ? `€${Number(sup.starting_price).toLocaleString()} / starting`
                        : '€1.500 / starting';

                      return (
                        <div
                          key={sup.id}
                          className={`bg-white border rounded-3xl overflow-hidden transition-all shadow-soft-sm flex flex-col justify-between group ${
                            isSelected
                              ? 'border-taupe ring-1 ring-taupe'
                              : 'border-stone-200/90 hover:border-taupe/40'
                          }`}
                        >
                          <div>
                            <div className="relative h-48 w-full">
                              <Image
                                src={
                                  sup.image ||
                                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'
                                }
                                alt={name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-taupe shadow-soft-sm">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Verified Partner</span>
                              </div>
                              <div className="absolute bottom-3 right-3 bg-charcoal/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold shadow-sm">
                                {price}
                              </div>
                            </div>

                            <div className="p-5 space-y-3">
                              <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">
                                {catDisplay} • {sup.city || 'Netherlands'}
                              </span>
                              <h3 className="text-lg font-bold text-charcoal tracking-tight group-hover:text-taupe transition-colors">
                                {name}
                              </h3>

                              {sup.tagline && (
                                <p className="text-xs text-stone-600 font-medium">
                                  &quot;{sup.tagline}&quot;
                                </p>
                              )}

                              {/* Active Services Pills */}
                              {Array.isArray(sup.services) && sup.services.length > 0 && (
                                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                                    <Package className="w-3 h-3 text-taupe" />
                                    <span>Available Services ({sup.services.length}):</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {sup.services.slice(0, 3).map((srv: any) => (
                                      <button
                                        key={srv.id}
                                        type="button"
                                        onClick={() => handleOpenBookingModal(srv)}
                                        className="px-2 py-1 rounded-lg bg-sand-100/90 hover:bg-taupe hover:text-white text-charcoal text-[11px] font-medium transition-colors"
                                      >
                                        {srv.name} (from €{srv.base_price})
                                      </button>
                                    ))}
                                    {sup.services.length > 3 && (
                                      <span className="text-[10px] text-stone-400 self-center">+{sup.services.length - 3} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                                {Number(sup.review_count || 0) > 0 && Number(sup.rating_avg || 0) > 0 ? (
                                  <>
                                    <div className="flex text-amber-500">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3.5 h-3.5 ${
                                            i < Math.round(Number(sup.rating_avg))
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-stone-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="font-bold text-charcoal font-mono">
                                      {Number(sup.rating_avg).toFixed(1)}
                                    </span>
                                    <span>({sup.review_count} reviews)</span>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                      ★ New Specialist
                                    </span>
                                    <span className="text-[10px] text-stone-400">0 reviews yet</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-5 pt-0 flex items-center gap-2 border-t border-stone-100 mt-3">
                            <button
                              type="button"
                              onClick={() => handleOpenPortfolioModal(sup)}
                              className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
                              title="View Supplier Portfolio & Experience"
                            >
                              <Briefcase className="w-4 h-4 text-taupe" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSelectSupplier(sup.id)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                isSelected ? 'bg-emerald-700 text-white' : 'btn-primary'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 text-white" />
                                  <span>Select for Broadcast</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* DIRECT SERVICE BOOKING MODAL */}
        {selectedServiceForBooking && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedServiceForBooking(null);
            }}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
              <button
                type="button"
                onClick={() => setSelectedServiceForBooking(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protected Escrow Booking Request</span>
                </div>
                <h2 className="text-2xl font-bold text-charcoal">{selectedServiceForBooking.name}</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  by <span className="font-bold text-charcoal">{selectedServiceForBooking.supplier?.business_name || 'Verified Supplier'}</span> • €{Number(selectedServiceForBooking.base_price).toLocaleString()}
                </p>
              </div>

              {bookingSuccess ? (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-sand-50 border border-emerald-200/90 rounded-3xl text-center space-y-3 shadow-soft-sm">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Inquiry Live in Database
                      </span>
                      <h3 className="text-xl font-bold text-emerald-950 mt-2">Booking Inquiry Sent!</h3>
                      <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mt-1">
                        Your request has been delivered to <strong>{selectedServiceForBooking.supplier?.business_name || 'the supplier'}</strong>. They can now review your dates, client details, and confirm availability.
                      </p>
                    </div>

                    {/* Booking Review Summary Receipt */}
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-left space-y-2.5 text-xs shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-stone-500 font-medium">Requested Service:</span>
                        <span className="font-bold text-charcoal">{selectedServiceForBooking.name}</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-stone-500 font-medium">Event Date:</span>
                        <span className="font-bold text-charcoal font-mono">{bookingForm.requested_date || 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-stone-500 font-medium">Guests / Attendees:</span>
                        <span className="font-bold text-charcoal">{bookingForm.guest_count || 50} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500 font-medium">Total Package Rate:</span>
                        <span className="font-bold text-taupe font-mono text-sm">€{Number(selectedServiceForBooking.base_price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccess(false);
                        setSelectedServiceForBooking(null);
                      }}
                      className="flex-1 py-3 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Continue Browsing
                    </button>
                    <Link
                      href="/dashboard/host/requests"
                      className="flex-1 py-3 rounded-2xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-soft-sm"
                    >
                      <span>View My Requests</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDirectServiceBooking} className="space-y-4">
                  {events.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Select Your Active Celebration
                      </label>
                      <select
                        value={bookingForm.event_id}
                        onChange={(e) => setBookingForm({ ...bookingForm, event_id: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe bg-white"
                      >
                        {events.map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            🎉 {ev.title} ({ev.city || 'City'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Requested Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.requested_date}
                        onChange={(e) => setBookingForm({ ...bookingForm, requested_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Guest Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={bookingForm.guest_count}
                        onChange={(e) => setBookingForm({ ...bookingForm, guest_count: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Bespoke Notes / Preferences
                    </label>
                    <textarea
                      rows={3}
                      value={bookingForm.requirements}
                      onChange={(e) => setBookingForm({ ...bookingForm, requirements: e.target.value })}
                      placeholder="Specify timing, theme, or any particular questions..."
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-500 block">Package Price</span>
                      <span className="font-bold text-charcoal font-mono text-sm">€{Number(selectedServiceForBooking.base_price).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-500 block">Required Escrow Deposit (20%)</span>
                      <span className="font-bold text-emerald-700 font-mono text-sm">
                        €{(((Number(selectedServiceForBooking.base_price) || 1500) * 20) / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedServiceForBooking(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingSubmitting}
                      className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                    >
                      {bookingSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Delivering Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Booking Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* BROADCAST INQUIRY MODAL */}
        {isBroadcastModalOpen && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsBroadcastModalOpen(false);
            }}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto my-auto">
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Broadcast Inquiries</span>
                </div>
                <h2 className="text-2xl font-bold text-charcoal">Broadcast Quote Request</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Simultaneously request personalized packages from {selectedSupplierIds.length} chosen suppliers.
                </p>
              </div>

              {broadcastSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-800">Broadcast Sent Successfully!</h3>
                  <p className="text-xs text-emerald-700">
                    Your request was delivered to {selectedSupplierIds.length} partners. Check status in your Requests Tab.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={broadcastForm.event_date}
                        onChange={(e) =>
                          setBroadcastForm({ ...broadcastForm, event_date: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        City / Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={broadcastForm.city}
                        onChange={(e) =>
                          setBroadcastForm({ ...broadcastForm, city: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={broadcastForm.guest_count}
                      onChange={(e) =>
                        setBroadcastForm({ ...broadcastForm, guest_count: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Custom Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={broadcastForm.requirements}
                      onChange={(e) =>
                        setBroadcastForm({ ...broadcastForm, requirements: e.target.value })
                      }
                      placeholder="Describe styling themes, dietary preferences, or specific timings..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-taupe"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsBroadcastModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={broadcastSubmitting}
                      className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                    >
                      {broadcastSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending Inquiries...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Broadcast Inquiries</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* SUPPLIER PORTFOLIO PREVIEW MODAL */}
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
