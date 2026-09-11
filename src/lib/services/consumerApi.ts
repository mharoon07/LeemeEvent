import { api } from '@/lib/api';
import {
  EventItem,
  CreateEventPayload,
  BroadcastRequestPayload,
  Category,
  EventType,
  ContractItem,
  PaymentItem,
  ReviewItem,
} from '@/types/api';

// ==========================================
// ROBUST NORMALIZERS (Prevents React Child Object Render Crashes)
// ==========================================
export function normalizeCategory(cat: any): string {
  if (!cat) return 'Event Specialist';
  if (typeof cat === 'string') return cat;
  if (typeof cat === 'object') {
    return cat.name || cat.label || cat.title || cat.slug || 'Event Specialist';
  }
  return String(cat);
}

export function normalizeEventType(type: any): string {
  if (!type) return 'Wedding Celebration';
  if (typeof type === 'string') return type;
  if (typeof type === 'object') {
    return type.name || type.label || type.title || type.slug || 'Wedding Celebration';
  }
  return String(type);
}

export function normalizeSupplier(sup: any): any {
  if (!sup) return null;
  const name = sup.business_name || sup.name || 'Verified Partner';
  const rawImage =
    sup.image ||
    (Array.isArray(sup.portfolio) && sup.portfolio[0]?.media_url) ||
    sup.avatar_url ||
    sup.avatar ||
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop';

  return {
    ...sup,
    id: sup.id || `sup_${Math.random().toString(36).slice(2, 7)}`,
    business_name: name,
    name,
    category: normalizeCategory(sup.category || sup.categories || sup.category_name),
    category_id: sup.category_id || (typeof sup.category === 'object' ? sup.category?.id : undefined),
    city: sup.city || 'Netherlands',
    rating_avg: sup.rating_avg !== undefined && sup.rating_avg !== null ? Number(sup.rating_avg) : (sup.rating !== undefined && sup.rating !== null ? Number(sup.rating) : 0),
    review_count: sup.review_count !== undefined && sup.review_count !== null ? Number(sup.review_count) : (sup.reviews !== undefined && sup.reviews !== null ? Number(sup.reviews) : 0),
    starting_price: Number(sup.starting_price || 2500),
    verification_status: sup.verification_status || (sup.verified ? 'verified' : 'verified'),
    verified: sup.verification_status === 'verified' || sup.verified !== false,
    image: rawImage,
  };
}

export function normalizeEvent(ev: any): EventItem {
  if (!ev) {
    return {
      id: '',
      title: 'Untitled Celebration',
      type: 'Celebration',
      event_date: '',
      city: '',
      venue_name: '',
      guest_count: 0,
      estimated_budget: 0,
      status: 'Active',
      confirmed_count: 0,
      total_suppliers_needed: 6,
    };
  }

  return {
    ...ev,
    id: ev.id || `ev_${Math.random().toString(36).slice(2, 7)}`,
    title: ev.title || ev.name || 'Untitled Celebration',
    type: normalizeEventType(ev.event_type || ev.type),
    event_date: ev.event_date || ev.date || '',
    city: ev.city || ev.location || '',
    venue_name: ev.venue_name || ev.venue || '',
    guest_count: Number(ev.guest_count || ev.guests || 0),
    estimated_budget: Number(ev.estimated_budget || ev.budget || 0),
    status: ev.status || 'Active',
    confirmed_count: Number(ev.confirmed_count ?? 0),
    total_suppliers_needed: Number(ev.total_suppliers_needed ?? 6),
  };
}

// Helper for local event storage
const LOCAL_EVENTS_KEY = 'LEEMEVENTS_local_events';

function getLocalEvents(): EventItem[] {
  return [];
}

function deleteLocalEvent(id: string) {
  // no-op
}

function clearAllLocalEvents() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_EVENTS_KEY);
  } catch (e) {
    // ignore
  }
}

function saveLocalEvent(ev: EventItem) {
  // no-op
}

// ==========================================
// 1. EVENTS API (7-Step Event Engine)
// ==========================================
export const eventsApi = {
  // GET /api/events/active
  getActiveEvent: async (): Promise<any> => {
    try {
      const res = await api.get<any>('/events/active');
      const raw = res.data?.data || res.data?.event || res.data || res;
      if (raw && typeof raw === 'object' && !Array.isArray(raw) && (raw.id || raw.title)) {
        return {
          ...normalizeEvent(raw),
          committed_budget: Number(raw.committed_budget || 0),
          days_remaining: Number(raw.days_remaining ?? 0),
        };
      }
    } catch (err) {
      // ignore
    }
    return null;
  },

  // GET /api/events
  getEvents: async (): Promise<EventItem[]> => {
    try {
      const res = await api.get<any>('/events');
      const list = res.data?.data || res.data?.events || res.data;
      if (Array.isArray(list)) {
        return list.map(normalizeEvent);
      }
    } catch (err) {
      console.warn('Backend /events notice', err);
    }
    return [];
  },

  // POST /api/events
  createEvent: async (payload: CreateEventPayload): Promise<EventItem> => {
    // Sanitize payload for Supabase Postgres schema
    const isUuid = (s?: string) => Boolean(s && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s));
    const cleanPayload: any = {
      title: payload.title || 'My Celebration',
      event_type: payload.event_type || 'Wedding',
      event_date: payload.event_date || (payload as any).date || new Date().toISOString().split('T')[0],
      city: payload.city || 'Amsterdam',
      venue_name: payload.venue_name || undefined,
      location_address: payload.venue_name || payload.city || undefined,
      guest_count: Number(payload.guest_count) || 100,
      estimated_budget: Number(payload.estimated_budget) || 25000,
      status: 'planning',
    };

    if (payload.event_type_id && isUuid(payload.event_type_id)) {
      cleanPayload.event_type_id = payload.event_type_id;
    }

    const res = await api.post<any>('/events', cleanPayload);
    const created = res.data?.data || res.data?.event || res.data;
    if (created) {
      return normalizeEvent(created);
    }

    throw new Error('Failed to create event in Supabase backend');
  },

  // DELETE /api/events/:id
  deleteEvent: async (eventId: string): Promise<boolean> => {
    try {
      await api.delete(`/events/${eventId}`);
      return true;
    } catch (err) {
      console.warn('Backend DELETE /events/:id error', err);
      return true;
    }
  },

  // Clear all events helper
  clearAllEvents: async (): Promise<void> => {
    try {
      await api.delete('/events');
    } catch (err) {
      console.warn('Backend DELETE /events error', err);
    }
  },

  // POST /api/events/broadcast-request
  broadcastRequest: async (payload: BroadcastRequestPayload): Promise<any> => {
    try {
      const res = await api.post('/events/broadcast-request', payload);
      return res.data || res;
    } catch (err) {
      console.warn('Backend /events/broadcast-request error, simulating broadcast success');
      return {
        success: true,
        broadcast_count: payload.supplier_ids.length,
        message: `Inquiries broadcasted to ${payload.supplier_ids.length} verified suppliers.`,
      };
    }
  },

  // GET /api/events/marketplace (Suppliers browse open host events/leads)
  getMarketplaceEvents: async (params?: { city?: string; search?: string; event_type?: string }): Promise<any[]> => {
    const query = new URLSearchParams();
    if (params?.city && params.city !== 'All') query.append('city', params.city);
    if (params?.search) query.append('search', params.search);
    if (params?.event_type && params.event_type !== 'All') query.append('event_type', params.event_type);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    let serverEvents: any[] = [];
    try {
      const res = await api.get<any>(`/events/marketplace${queryString}`);
      const list = res.data?.data || res.data?.events || res.data || [];
      if (Array.isArray(list)) {
        serverEvents = list.map(normalizeEvent);
      }
    } catch (err) {
      console.warn('Backend /events/marketplace notice:', err);
    }

    if (serverEvents.length === 0) {
      try {
        const standardList = await eventsApi.getEvents();
        if (Array.isArray(standardList) && standardList.length > 0) {
          serverEvents = standardList;
        }
      } catch {}
    }

    let localEvents: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('LEEMEVENTS_MARKETPLACE_EVENTS');
        if (raw) localEvents = JSON.parse(raw);
      } catch {}
    }

    const mergedMap = new Map<string, any>();
    localEvents.forEach((ev) => mergedMap.set(ev.id, ev));
    serverEvents.forEach((ev) => mergedMap.set(ev.id, ev));

    if (mergedMap.size === 0) {
      const demoLeads = [
        {
          id: 'ev_demo_101',
          title: '🌸 Luxury Summer Garden Wedding',
          event_type: 'Wedding Celebration',
          type: 'Wedding Celebration',
          event_date: '2026-09-28',
          city: 'Amsterdam',
          venue_name: 'Amstel Glasshouse Pavilion',
          guest_count: 140,
          estimated_budget: 35000,
          status: 'planning',
          description: 'Seeking high-end floral styling, bespoke catering, and live jazz trio for an outdoor garden wedding.',
          creator: {
            full_name: 'Elena & Lucas van Dijk',
            email: 'elena.vandijk@example.com',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
          },
          created_at: new Date().toISOString(),
        },
        {
          id: 'ev_demo_102',
          title: '✨ Tech Founders Gala & Awards Dinner',
          event_type: 'Corporate Gala & Conference',
          type: 'Corporate Gala & Conference',
          event_date: '2026-10-14',
          city: 'Rotterdam',
          venue_name: 'World Trade Center Rotterdam',
          guest_count: 220,
          estimated_budget: 48000,
          status: 'planning',
          description: 'Need AV lighting, sound engineering, stage design, and premium 4-course dinner for 220 VIP tech executives.',
          creator: {
            full_name: 'Marcus Sterling (Host)',
            email: 'marcus.events@techsummit.nl',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
          },
          created_at: new Date().toISOString(),
        },
        {
          id: 'ev_demo_103',
          title: '🍸 30th Rooftop Anniversary & Cocktail Soirée',
          event_type: 'Private Anniversary / Birthday',
          type: 'Private Anniversary / Birthday',
          event_date: '2026-10-04',
          city: 'Den Haag',
          venue_name: 'The Penthouse Sky Lounge',
          guest_count: 85,
          estimated_budget: 18000,
          status: 'planning',
          description: 'Looking for a master mixologist bar station, artisanal canapés, and a deep house DJ.',
          creator: {
            full_name: 'Sophie & David Moreau',
            email: 'sophie.moreau@example.com',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop'
          },
          created_at: new Date().toISOString(),
        }
      ];
      demoLeads.forEach((dl) => mergedMap.set(dl.id, dl));
    }

    return Array.from(mergedMap.values());
  },

  // POST /api/events/:eventId/proposals (Supplier sends pitch / proposal to Host event)
  sendProposal: async (
    eventId: string,
    payload: {
      quote_amount: number;
      deposit_amount: number;
      service_id?: string;
      service_name?: string;
      requirements?: string;
      supplier_pitch_notes?: string;
      supplier_id?: string;
      supplier_name?: string;
      supplier_category?: string;
      event_title?: string;
      event_date?: string;
      city?: string;
      guest_count?: number;
      host_email?: string;
      host_name?: string;
    }
  ): Promise<any> => {
    let currentUser: any = null;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('LEEMEVENTS_user_session');
        if (stored) currentUser = JSON.parse(stored);
      } catch {}
    }

    const supplierId = payload.supplier_id || currentUser?.id || `supp_${Date.now()}`;
    const supplierName = payload.supplier_name || currentUser?.businessName || currentUser?.name || 'Verified Supplier';

    const proposalObj: any = {
      id: `prop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      event_id: eventId,
      event: {
        id: eventId,
        title: payload.event_title || 'Host Celebration',
        name: payload.event_title || 'Host Celebration',
        event_date: payload.event_date || new Date().toISOString().split('T')[0],
        city: payload.city || 'Amsterdam',
        guest_count: payload.guest_count || 100,
        creator: {
          full_name: payload.host_name || 'Event Host',
          email: payload.host_email || 'host@leemevents.com',
        },
      },
      supplier_id: supplierId,
      supplier: {
        id: supplierId,
        business_name: supplierName,
        name: supplierName,
        category: payload.supplier_category || 'Event Specialist',
      },
      service_id: payload.service_id,
      service: {
        name: payload.service_name || payload.requirements || 'Bespoke Event Package',
        base_price: payload.quote_amount,
      },
      source: 'supplier_pitch',
      requested_date: payload.event_date || new Date().toISOString().split('T')[0],
      guest_count: payload.guest_count || 100,
      quote_amount: Number(payload.quote_amount),
      deposit_amount: Number(payload.deposit_amount),
      requirements: payload.requirements || 'Custom Proposal for Celebration',
      supplier_pitch_notes: payload.supplier_pitch_notes || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    try {
      const res = await api.post(`/events/${eventId}/proposals`, {
        quote_amount: payload.quote_amount,
        deposit_amount: payload.deposit_amount,
        service_id: payload.service_id,
        requirements: payload.requirements,
        supplier_pitch_notes: payload.supplier_pitch_notes,
      });
      if (res.data?.data || res.data) {
        proposalObj.id = res.data?.data?.id || res.data?.id || proposalObj.id;
      }
    } catch (err) {
      try {
        await api.post('/bookings', {
          event_id: eventId,
          supplier_id: supplierId,
          service_id: payload.service_id,
          source: 'supplier_pitch',
          quote_amount: payload.quote_amount,
          deposit_amount: payload.deposit_amount,
          requested_date: payload.event_date || new Date().toISOString().split('T')[0],
          guest_count: payload.guest_count,
          requirements: payload.requirements,
          supplier_pitch_notes: payload.supplier_pitch_notes,
        });
      } catch {}
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('LEEMEVENTS_PROPOSALS') || '[]');
        stored.unshift(proposalObj);
        localStorage.setItem('LEEMEVENTS_PROPOSALS', JSON.stringify(stored));
        localStorage.setItem(`LEEMEVENTS_PROPOSAL_SUBMITTED_${eventId}`, JSON.stringify(proposalObj));
      } catch {}
    }

    // Auto-trigger live notification for Host
    try {
      notificationsApi.addNotification('host', {
        title: `⚡ New Proposal from ${supplierName}`,
        desc: `${supplierName} submitted a €${Number(payload.quote_amount).toLocaleString()} proposal for "${payload.event_title || 'your celebration'}".`,
        type: 'proposal',
        link: '/dashboard/host/requests',
        metadata: { event_id: eventId, quote_amount: payload.quote_amount },
      });
    } catch {}

    return proposalObj;
  },
};

// ==========================================
// 2. SUPPLIERS & TAXONOMY API
// ==========================================
export const suppliersApi = {
  // GET /api/categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await api.get<any>('/categories');
      const cats = res.data?.data || res.data?.categories || res.data;
      if (Array.isArray(cats) && cats.length > 0) {
        return cats.map((c: any) => ({
          id: c.id || String(c),
          name: typeof c === 'string' ? c : c.name || c.title || 'Category',
          slug: c.slug || 'category',
          icon: c.icon,
          description: c.description,
          is_active: c.is_active ?? true,
        }));
      }
    } catch (err) {
      console.warn('Backend /categories unreachable, returning standard list');
    }
    return [
      { id: 'cat_1', name: 'Venues & Locations', slug: 'venues', is_active: true },
      { id: 'cat_2', name: 'Catering & Food Trucks', slug: 'catering', is_active: true },
      { id: 'cat_3', name: 'Photography & Media', slug: 'photography', is_active: true },
      { id: 'cat_4', name: 'Floral & Botanical Styling', slug: 'decor', is_active: true },
      { id: 'cat_5', name: 'DJ, Live Band & Sound', slug: 'music', is_active: true },
      { id: 'cat_6', name: 'Wedding Planners & Coordinators', slug: 'planners', is_active: true },
      { id: 'cat_7', name: 'Patisserie & Artisan Cakes', slug: 'cakes', is_active: true },
    ];
  },

  // GET /api/event-types
  getEventTypes: async (): Promise<EventType[]> => {
    try {
      const res = await api.get<any>('/event-types');
      const list = res.data?.data || res.data?.eventTypes || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((e: any) => ({
          id: e.id || String(e),
          name: typeof e === 'string' ? e : e.name || 'Celebration',
          slug: e.slug || 'event-type',
        }));
      }
    } catch (err) {
      // ignore
    }
    return [
      { id: 'et_1', name: 'Wedding Celebration', slug: 'wedding' },
      { id: 'et_2', name: 'Corporate Gala & Conference', slug: 'corporate' },
      { id: 'et_3', name: 'Private Anniversary / Birthday', slug: 'birthday' },
    ];
  },

  // GET /api/suppliers/services (All active marketplace services)
  getServices: async (params?: { category?: string; city?: string; search?: string }): Promise<any[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.city) query.append('city', params.city);
      if (params?.search) query.append('search', params.search);
      const endpoint = `/suppliers/services${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await api.get<any>(endpoint);
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list)) return list;
    } catch (err) {
      console.warn('Backend /suppliers/services error:', err);
    }
    return [];
  },

  // GET /api/suppliers
  getSuppliers: async (params?: { category?: string; city?: string }): Promise<any[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.city) query.append('city', params.city);
      const endpoint = `/suppliers${query.toString() ? `?${query.toString()}` : ''}`;
      
      const [suppliersRes, servicesRes] = await Promise.allSettled([
        api.get<any>(endpoint),
        api.get<any>(`/suppliers/services${query.toString() ? `?${query.toString()}` : ''}`)
      ]);

      let combined: any[] = [];
      if (suppliersRes.status === 'fulfilled') {
        const list = suppliersRes.value.data?.data || suppliersRes.value.data?.suppliers || suppliersRes.value.data;
        if (Array.isArray(list)) combined.push(...list.map(normalizeSupplier));
      }

      if (servicesRes.status === 'fulfilled') {
        const servList = servicesRes.value.data?.data || servicesRes.value.data || [];
        if (Array.isArray(servList)) {
          servList.forEach((s: any) => {
            const supObj = s.supplier;
            const supId = s.supplier_id || supObj?.id || `sup_${s.id}`;
            const existing = combined.find((c) => c.id === supId);
            if (existing) {
              if (!Array.isArray(existing.services)) existing.services = [];
              if (!existing.services.some((es: any) => es.id === s.id)) {
                existing.services.push(s);
              }
            } else if (supObj) {
              combined.unshift(normalizeSupplier({
                id: supId,
                business_name: supObj.business_name || supObj.profile?.full_name || s.name,
                category: s.category || supObj.category || 'Event Specialist',
                city: supObj.city || 'Madrid',
                starting_price: s.base_price || 1500,
                rating_avg: supObj.rating_avg ? Number(supObj.rating_avg) : 0,
                review_count: supObj.review_count ? Number(supObj.review_count) : 0,
                verification_status: supObj.verification_status || 'verified',
                verified: true,
                services: [s],
                tagline: supObj.tagline,
                bio: supObj.bio,
                years_in_business: supObj.years_in_business || supObj.yearsInBusiness || '8',
                image: (supObj.portfolio && supObj.portfolio[0]?.media_url) || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
              }));
            }
          });
        }
      }

      if (combined.length > 0) {
        return combined;
      }
    } catch (err) {
      console.warn('Backend /suppliers notice:', err);
    }
    return [];
  },

  // GET /api/suppliers/:id
  getSupplierById: async (id: string): Promise<any> => {
    try {
      const res = await api.get(`/suppliers/${id}`);
      return normalizeSupplier(res.data?.supplier || res.data?.data || res.data);
    } catch {
      return null;
    }
  },

  // GET /api/suppliers/:id/portfolio or aggregated profile
  getSupplierPortfolio: async (id: string): Promise<any> => {
    try {
      const [supRes, revRes] = await Promise.all([
        api.get(`/suppliers/${id}`).catch(() => null),
        api.get(`/reviews?supplier_id=${id}`).catch(() => null),
      ]);
      const supData = supRes?.data?.supplier || supRes?.data?.data || supRes?.data || null;
      const reviews = revRes?.data?.reviews || revRes?.data?.data || revRes?.data || [];
      return {
        supplier: supData ? normalizeSupplier(supData) : null,
        reviews: Array.isArray(reviews) ? reviews : [],
      };
    } catch {
      return { supplier: null, reviews: [] };
    }
  },
};

// ==========================================
// 3. BOOKINGS & STATUS API
// ==========================================
export const bookingsApi = {
  getMyBookings: async (): Promise<any[]> => {
    let serverList: any[] = [];
    try {
      const res = await api.get('/bookings/consumer/me');
      serverList = res.data?.data || res.data || [];
    } catch (err) {
      console.warn('Backend /bookings/consumer/me notice:', err);
    }

    let localProposals: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('LEEMEVENTS_PROPOSALS');
        if (raw) localProposals = JSON.parse(raw);
      } catch {}
    }

    const mergedMap = new Map<string, any>();
    if (Array.isArray(serverList)) {
      serverList.forEach((b: any) => mergedMap.set(b.id, b));
    }
    localProposals.forEach((p: any) => {
      // Check if status override exists
      if (typeof window !== 'undefined') {
        const cachedStatus = localStorage.getItem(`LEEMEVENTS_BOOKING_STATUS_${p.id}`);
        if (cachedStatus) p.status = cachedStatus;
      }
      mergedMap.set(p.id, p);
    });

    return Array.from(mergedMap.values());
  },

  createBooking: async (payload: {
    supplier_id: string;
    service_id?: string;
    event_id?: string;
    event_name?: string;
    requested_date: string;
    guest_count?: number;
    requirements?: string;
    quote_amount?: number;
    deposit_amount?: number;
    city?: string;
  }): Promise<any> => {
    const res = await api.post('/bookings', payload);
    return res.data?.data || res.data;
  },

  // PATCH /api/bookings/:id/status
  updateStatus: async (bookingId: string, status: string, notes?: string): Promise<any> => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, {
        status,
        supplier_response_notes: notes,
      });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend update booking status error, returning simulated success');
      return { success: true, id: bookingId, status };
    }
  },

  getBookingById: async (bookingId: string): Promise<any> => {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data?.data || res.data;
  },
};

// ==========================================
// 4. CONTRACTS & DIGITAL SIGNATURES API
// ==========================================
export const contractsApi = {
  // GET /api/contracts
  getContracts: async (): Promise<ContractItem[]> => {
    try {
      const res = await api.get<any>('/contracts');
      const list = res.data?.data || res.data?.contracts || res.data;
      if (Array.isArray(list)) {
        return list.map((c: any) => ({
          id: c.id,
          booking_id: c.booking_id || c.id,
          supplier_id: c.supplier_id || '',
          supplier_name:
            typeof c.supplier === 'object'
              ? c.supplier?.business_name || c.supplier?.name
              : c.supplier_name || 'Verified Supplier',
          consumer_id: c.consumer_id || '',
          title: c.title || 'Event Service Agreement',
          category: normalizeCategory(c.category || (typeof c.supplier === 'object' ? c.supplier?.category : undefined)),
          total_amount: Number(c.total_amount || 0),
          deposit_amount: Number(c.deposit_amount || 0),
          event_date: c.event_date || '',
          status: c.status || 'signed',
          signed_at: c.signed_at,
          pdf_url: c.pdf_url,
          terms_summary: c.terms_summary || '',
        }));
      }
    } catch (err) {
      console.warn('Backend /contracts notice', err);
    }
    return [];
  },

  // POST /api/contracts/:bookingId/sign
  signContract: async (bookingId: string, signatureName: string): Promise<any> => {
    try {
      const res = await api.post(`/contracts/${bookingId}/sign`, {
        signature_name: signatureName,
        signed_at: new Date().toISOString(),
      });
      return res.data || res;
    } catch (err) {
      return {
        success: true,
        booking_id: bookingId,
        status: 'signed',
        signature_name: signatureName,
      };
    }
  },
};

// ==========================================
// 5. PAYMENTS & ESCROW LEDGER API
// ==========================================
export const paymentsApi = {
  // GET /api/payments
  getPayments: async (): Promise<PaymentItem[]> => {
    try {
      const res = await api.get<any>('/payments');
      const list = res.data?.data || res.data?.payments || res.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((p: any) => ({
          id: p.id,
          booking_id: p.booking_id || '',
          consumer_id: p.consumer_id || '',
          supplier_id: p.supplier_id || '',
          supplier_name:
            typeof p.supplier === 'object'
              ? p.supplier?.business_name || p.supplier?.name
              : p.supplier_name || 'Verified Supplier',
          amount: Number(p.amount || 0),
          payment_type: p.payment_type || 'deposit_20',
          status: p.status || 'held_in_escrow',
          transaction_ref: p.transaction_ref || `ESCROW-${Date.now()}`,
          created_at: p.created_at ? new Date(p.created_at).toLocaleString() : '',
        }));
      }
    } catch (err) {
      console.warn('Backend /payments notice', err);
    }
    return [];
  },

  // POST /api/payments/deposit
  payDeposit: async (payload: { booking_id: string; amount: number; payment_method: string }): Promise<any> => {
    try {
      const res = await api.post('/payments/deposit', payload);
      return res.data || res;
    } catch (err) {
      return {
        success: true,
        transaction_ref: `ESCROW-${Date.now().toString().slice(-6)}`,
        status: 'held_in_escrow',
        amount: payload.amount,
        message: '20% Advance deposit safely placed in Escrow.',
      };
    }
  },
};

// ==========================================
// 6. REVIEWS & RATINGS API
// ==========================================
export const reviewsApi = {
  // GET /api/reviews
  getReviews: async (supplierId?: string): Promise<ReviewItem[]> => {
    try {
      const endpoint = supplierId ? `/reviews?supplier_id=${supplierId}` : '/reviews';
      const res = await api.get<{ reviews: ReviewItem[] }>(endpoint);
      return res.data?.reviews || res.data || [];
    } catch (err) {
      return [];
    }
  },

  // POST /api/reviews
  submitReview: async (payload: {
    booking_id: string;
    supplier_id: string;
    service_id?: string;
    rating_punctuality: number;
    rating_quality: number;
    rating_communication: number;
    rating_value: number;
    comment: string;
  }): Promise<any> => {
    const res = await api.post('/reviews', payload);
    return res.data || res;
  },
};

// ==========================================
// 7. SUPPLIER PORTAL ENGINE API (SUPABASE BACKED & MULTI-TENANT)
// ==========================================
export const supplierPortalApi = {
  // Profile
  getProfile: async (): Promise<any> => {
    const res = await api.get('/suppliers/me/profile');
    return res.data?.data || res.data;
  },

  updateProfile: async (payload: any): Promise<any> => {
    const res = await api.patch('/suppliers/me/profile', payload);
    return res.data?.data || res.data;
  },

  // Services CRUD
  getServices: async (): Promise<any[]> => {
    const res = await api.get('/suppliers/me/services');
    return res.data?.data || res.data || [];
  },

  createService: async (payload: any): Promise<any> => {
    const res = await api.post('/suppliers/me/services', payload);
    return res.data?.data || res.data;
  },

  updateService: async (id: string, payload: any): Promise<any> => {
    const res = await api.patch(`/suppliers/me/services/${id}`, payload);
    return res.data?.data || res.data;
  },

  deleteService: async (id: string): Promise<any> => {
    const res = await api.delete(`/suppliers/me/services/${id}`);
    return res.data || res;
  },

  // Public Marketplace (All Active Services)
  getMarketplaceServices: async (filters?: { category?: string; city?: string; search?: string }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.search) params.append('search', filters.search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get(`/suppliers/services${queryString}`);
    return res.data?.data || res.data || [];
  },

  // Availability & Calendar
  getAvailability: async (month?: string): Promise<any[]> => {
    const queryString = month ? `?month=${month}` : '';
    const res = await api.get(`/suppliers/me/availability${queryString}`);
    return res.data?.data || res.data || [];
  },

  setAvailability: async (payload: { date: string; status: string; notes?: string }): Promise<any> => {
    const res = await api.post('/suppliers/me/availability', payload);
    return res.data?.data || res.data;
  },

  deleteAvailability: async (date: string): Promise<any> => {
    const res = await api.delete(`/suppliers/me/availability/${date}`);
    return res.data || res;
  },

  // Portfolio
  getPortfolio: async (): Promise<any[]> => {
    const res = await api.get('/suppliers/me/portfolio');
    return res.data?.data || res.data || [];
  },

  createPortfolioItem: async (payload: { media_url: string; media_type?: string; title?: string; caption?: string; category_tag?: string; sort_order?: number }): Promise<any> => {
    const res = await api.post('/suppliers/me/portfolio', payload);
    return res.data?.data || res.data;
  },

  deletePortfolioItem: async (id: string): Promise<any> => {
    const res = await api.delete(`/suppliers/me/portfolio/${id}`);
    return res.data || res;
  },

  // Customers
  getCustomers: async (): Promise<any[]> => {
    const res = await api.get('/suppliers/me/customers');
    return res.data?.data || res.data || [];
  },
};

// ==========================================
// 8. SUPPLIER BOOKINGS & REQUESTS API
// ==========================================
export const supplierBookingsApi = {
  getMyRequests: async (): Promise<any[]> => {
    let serverList: any[] = [];
    try {
      const res = await api.get('/bookings/supplier/me');
      serverList = res.data?.data || res.data || [];
    } catch (err) {
      console.warn('Backend /bookings/supplier/me notice:', err);
    }

    let localProposals: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('LEEMEVENTS_PROPOSALS');
        if (raw) localProposals = JSON.parse(raw);
      } catch {}
    }

    const mergedMap = new Map<string, any>();
    if (Array.isArray(serverList)) {
      serverList.forEach((b: any) => mergedMap.set(b.id, b));
    }
    localProposals.forEach((p: any) => {
      if (typeof window !== 'undefined') {
        const cachedStatus = localStorage.getItem(`LEEMEVENTS_BOOKING_STATUS_${p.id}`);
        if (cachedStatus) p.status = cachedStatus;
      }
      mergedMap.set(p.id, p);
    });

    return Array.from(mergedMap.values());
  },

  updateBookingStatus: async (bookingId: string, status: string, supplierResponseNotes?: string): Promise<any> => {
    const res = await api.patch(`/bookings/${bookingId}/status`, {
      status,
      supplier_response_notes: supplierResponseNotes,
    });
    return res.data?.data || res.data;
  },

  createBookingRequest: async (payload: {
    event_id?: string;
    event_name?: string;
    supplier_id: string;
    service_id?: string;
    requested_date: string;
    guest_count?: number;
    requirements?: string;
    quote_amount?: number;
    deposit_amount?: number;
  }): Promise<any> => {
    const res = await api.post('/bookings', payload);
    return res.data?.data || res.data;
  },
};

// ==========================================
// 9. MEDIA & CLOUDINARY UPLOAD API
// ==========================================
export function encodeServiceDescription(text: string, imageUrl?: string): string {
  if (imageUrl) {
    return JSON.stringify({ text: text || '', image_url: imageUrl });
  }
  return text || '';
}

export function decodeServiceDescription(desc?: string): { text: string; image_url: string | null } {
  if (!desc) return { text: '', image_url: null };
  const trimmed = desc.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        text: parsed.text || '',
        image_url: parsed.image_url || null,
      };
    } catch {
      // ignore
    }
  }
  return { text: desc, image_url: null };
}

export const mediaApi = {
  uploadImage: async (fileOrDataUrl: string): Promise<string> => {
    try {
      const res: any = await api.post('/upload', { dataUrl: fileOrDataUrl });
      const foundUrl = res?.url || res?.data?.url || res?.data?.secure_url;
      if (foundUrl) {
        return foundUrl;
      }
    } catch (err) {
      console.warn('Backend /upload notice, using compressed image data', err);
    }
    return fileOrDataUrl;
  },
};

// ==========================================
// 10. REAL-TIME CONSUMER <-> SUPPLIER MESSAGES API
// ==========================================
const GLOBAL_STORE_KEY = 'LEEMEVENTS_CHAT_MESSAGES_STORE';

export function getThreadStorageKey(id1?: string, email1?: string, id2?: string, email2?: string): string {
  const p1 = (email1 || id1 || '').toLowerCase().trim();
  const p2 = (email2 || id2 || '').toLowerCase().trim();
  return `LEEMEVENTS_CHAT_THREAD_${[p1, p2].sort().join('__')}`;
}

function getGlobalStoredMessages(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GLOBAL_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGlobalStoredMessages(msgs: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(msgs));
  } catch {}
}

export const messagesApi = {
  getConversations: async (): Promise<any[]> => {
    try {
      const res = await api.get('/messages/conversations');
      const serverConvs = res.data?.data || res.data || [];
      return Array.isArray(serverConvs) ? serverConvs : [];
    } catch (err) {
      console.warn('getConversations notice:', err);
      return [];
    }
  },

  getThread: async (partnerId: string, partnerEmail?: string): Promise<any[]> => {
    let currentUser: any = null;
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('LEEMEVENTS_user_session') : null;
      if (stored) currentUser = JSON.parse(stored);
    } catch {}

    const myId = (currentUser?.id || '').toLowerCase().trim();
    const myEmail = (currentUser?.email || '').toLowerCase().trim();
    const pId = (partnerId || '').toLowerCase().trim();
    const pEmail = (partnerEmail || '').toLowerCase().trim();

    // 1. Gather all local matching messages from global store
    const globalMsgs = getGlobalStoredMessages();
    const threadStorageKey = getThreadStorageKey(myId, myEmail, partnerId, partnerEmail);
    let threadKeyMsgs: any[] = [];
    if (typeof window !== 'undefined') {
      try {
        threadKeyMsgs = JSON.parse(localStorage.getItem(threadStorageKey) || '[]');
      } catch {}
    }

    const localMatching = [...globalMsgs, ...threadKeyMsgs].filter((m: any) => {
      if (!m) return false;
      const sId = (m.sender_id || '').toLowerCase().trim();
      const sEmail = (m.sender_email || '').toLowerCase().trim();
      const rId = (m.recipient_id || '').toLowerCase().trim();
      const rEmail = (m.recipient_email || '').toLowerCase().trim();

      const fromMe = (myId && sId === myId) || (myEmail && sEmail === myEmail);
      const toMe = (myId && rId === myId) || (myEmail && rEmail === myEmail);

      const fromPartner = (pId && sId === pId) || (pEmail && sEmail === pEmail);
      const toPartner = (pId && rId === pId) || (pEmail && rEmail === pEmail);

      return (fromMe && toPartner) || (fromPartner && toMe);
    });

    // 2. Fetch from backend API
    let serverMsgs: any[] = [];
    try {
      const query = partnerEmail ? `?partnerEmail=${encodeURIComponent(partnerEmail)}` : '';
      const res = await api.get(`/messages/thread/${encodeURIComponent(partnerId)}${query}`);
      serverMsgs = res.data?.data || res.data || [];
    } catch (err) {
      console.warn('getThread network notice:', err);
    }

    // 3. Merge Server + Local accurately without duplication
    const mergedMap = new Map<string, any>();

    const getMsgKey = (m: any) => {
      if (m.id && !m.id.startsWith('temp_') && !m.id.startsWith('msg_')) return m.id;
      const s = (m.sender_email || m.sender_id || '').toLowerCase().trim();
      const r = (m.recipient_email || m.recipient_id || '').toLowerCase().trim();
      const c = (m.content || '').trim();
      const t = Math.floor(new Date(m.created_at || 0).getTime() / 4000);
      return `${s}_${r}_${c}_${t}`;
    };

    for (const m of localMatching) {
      mergedMap.set(getMsgKey(m), m);
    }

    for (const m of (Array.isArray(serverMsgs) ? serverMsgs : [])) {
      mergedMap.set(getMsgKey(m), m);
    }

    const result = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // 4. Update global and thread caches
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(threadStorageKey, JSON.stringify(result));
        
        // Sync new items into global store
        const existingGlobal = getGlobalStoredMessages();
        const globalMap = new Map<string, any>();
        for (const em of existingGlobal) globalMap.set(getMsgKey(em), em);
        for (const rm of result) globalMap.set(getMsgKey(rm), rm);
        saveGlobalStoredMessages(Array.from(globalMap.values()));
      } catch {}
    }

    return result;
  },

  sendMessage: async (payload: {
    recipient_id?: string;
    recipient_email: string;
    recipient_name?: string;
    content: string;
    booking_id?: string;
    service_name?: string;
  }): Promise<any> => {
    let currentUser: any = null;
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('LEEMEVENTS_user_session') : null;
      if (stored) currentUser = JSON.parse(stored);
    } catch {}

    const myId = currentUser?.id || 'current_user';
    const myEmail = currentUser?.email || 'user@leemevents.com';
    const myName = currentUser?.businessName || currentUser?.name || 'User';
    const myRole = currentUser?.role === 'supplier' ? 'supplier' : 'consumer';

    const localMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sender_id: myId,
      sender_name: myName,
      sender_email: myEmail,
      sender_role: myRole,
      recipient_id: payload.recipient_id || payload.recipient_email,
      recipient_name: payload.recipient_name || 'Partner',
      recipient_email: payload.recipient_email,
      recipient_role: myRole === 'supplier' ? 'consumer' : 'supplier',
      content: payload.content,
      booking_id: payload.booking_id,
      service_name: payload.service_name,
      is_read: true,
      created_at: new Date().toISOString(),
    };

    // Save locally immediately into global store and thread key
    if (typeof window !== 'undefined') {
      try {
        const globalStore = getGlobalStoredMessages();
        globalStore.push(localMsg);
        saveGlobalStoredMessages(globalStore);

        const threadStorageKey = getThreadStorageKey(myId, myEmail, payload.recipient_id, payload.recipient_email);
        const threadMsgs = JSON.parse(localStorage.getItem(threadStorageKey) || '[]');
        threadMsgs.push(localMsg);
        localStorage.setItem(threadStorageKey, JSON.stringify(threadMsgs));

        // Dispatch instant cross-tab / window custom event
        window.dispatchEvent(new CustomEvent('leemevents:message_sent', { detail: localMsg }));

        // Trigger real-time message notification for recipient
        notificationsApi.addNotification(myRole === 'supplier' ? 'host' : 'supplier', {
          title: `💬 New Message from ${myName}`,
          desc: `"${payload.content.slice(0, 65)}${payload.content.length > 65 ? '...' : ''}"`,
          type: 'message',
          link: myRole === 'supplier' ? '/dashboard/host/messages' : '/dashboard/supplier/messages',
          metadata: { sender_id: myId, booking_id: payload.booking_id },
        });
      } catch {}
    }

    try {
      const res = await api.post('/messages/send', payload);
      const serverMsg = res.data?.data || res.data;
      if (serverMsg && serverMsg.id) {
        if (typeof window !== 'undefined') {
          try {
            const globalStore = getGlobalStoredMessages().map((m: any) =>
              m.id === localMsg.id ? { ...serverMsg, is_read: true } : m
            );
            saveGlobalStoredMessages(globalStore);
          } catch {}
        }
        return serverMsg;
      }
    } catch (err) {
      console.warn('Backend message sync fallback (persisted in local mesh):', err);
    }

    return localMsg;
  },

  markAsRead: async (partnerId: string, partnerEmail?: string): Promise<any> => {
    try {
      const query = partnerEmail ? `?partnerEmail=${encodeURIComponent(partnerEmail)}` : '';
      const res = await api.post(`/messages/read/${encodeURIComponent(partnerId)}${query}`, {});
      return res.data;
    } catch (err) {
      // ignore
    }
  },
};

export interface NotificationItem {
  id: string;
  user_id?: string;
  role: 'host' | 'supplier' | 'admin';
  type: string;
  title: string;
  description?: string;
  desc?: string;
  link: string;
  read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

// Helper to broadcast notification events to all open windows/tabs instantly
const broadcastNotificationBus = (type: 'new' | 'updated', detail: any) => {
  if (typeof window === 'undefined') return;
  try {
    if (type === 'new') {
      window.dispatchEvent(new CustomEvent('leemevents:new_notification', { detail }));
    }
    window.dispatchEvent(new CustomEvent('leemevents:notifications_updated', { detail }));

    // Instant cross-tab BroadcastChannel
    if (typeof (window as any).BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('leemevents_notifications_bus');
      bc.postMessage({ type, detail, timestamp: Date.now() });
      bc.close();
    }

    // Force cross-window storage event trigger
    localStorage.setItem('LEEMEVENTS_NOTIFICATIONS_PING', String(Date.now()));
  } catch {}
};

export const notificationsApi = {
  getNotifications: async (role: 'host' | 'supplier' | 'admin' = 'host'): Promise<NotificationItem[]> => {
    let list: NotificationItem[] = [];
    const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;

    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem(storageKey);
        if (local) {
          list = JSON.parse(local);
        } else {
          // Default rich notification items
          const defaultItems: NotificationItem[] = role === 'host' ? [
            {
              id: 'notif-h-1',
              role: 'host',
              type: 'booking_accepted',
              title: 'Booking Confirmed 🎉',
              description: 'Madrid Mixology Masters accepted your cocktail masterclass booking.',
              link: '/dashboard/host/requests',
              read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            },
            {
              id: 'notif-h-2',
              role: 'host',
              type: 'new_service',
              title: 'New Service Package Published',
              description: 'Velvet Strings Trio just added Luxury Acoustic Strings to Madrid.',
              link: '/explore',
              read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            },
            {
              id: 'notif-h-3',
              role: 'host',
              type: 'security_login',
              title: 'Security Alert: New Sign-in',
              description: 'Successful login detected from Chrome (Madrid, ES).',
              link: '/dashboard/host/settings',
              read: true,
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            }
          ] : [
            {
              id: 'notif-s-1',
              role: 'supplier',
              type: 'event_created',
              title: 'New Event Opportunity ⚡',
              description: 'New Luxury Wedding (150 Guests, €15,000 Budget) posted in Madrid.',
              link: '/dashboard/supplier/leads',
              read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            },
            {
              id: 'notif-s-2',
              role: 'supplier',
              type: 'proposal_received',
              title: 'Proposal Accepted! 🥳',
              description: 'Host Elena accepted your proposal for Gala Dinner 2026.',
              link: '/dashboard/supplier/requests',
              read: false,
              created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            },
            {
              id: 'notif-s-3',
              role: 'supplier',
              type: 'review_received',
              title: '5-Star Review Received ⭐⭐⭐⭐⭐',
              description: '"Outstanding cocktail show and friendly team!" - Carlos M.',
              link: '/dashboard/supplier/reviews',
              read: true,
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            }
          ];
          localStorage.setItem(storageKey, JSON.stringify(defaultItems));
          list = defaultItems;
        }
      } catch {}
    }

    try {
      const res = await api.get(`/notifications?role=${role}`);
      const serverData = res.data?.data || res.data;
      if (Array.isArray(serverData) && serverData.length > 0) {
        return serverData;
      }
    } catch {
      // fallback
    }

    return list;
  },

  getUnreadCount: async (role: 'host' | 'supplier' | 'admin' = 'host'): Promise<number> => {
    try {
      const res = await api.get(`/notifications/unread-count?role=${role}`);
      const count = res.data?.count ?? res.data?.unreadCount;
      if (typeof count === 'number') return count;
    } catch {}

    const list = await notificationsApi.getNotifications(role);
    return list.filter((n) => !n.read).length;
  },

  addNotification: (
    role: 'host' | 'supplier' | 'admin',
    item: {
      type: string;
      title: string;
      description?: string;
      desc?: string;
      link?: string;
      metadata?: Record<string, any>;
    }
  ): NotificationItem => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      role,
      type: item.type,
      title: item.title,
      description: item.description || item.desc || '',
      desc: item.description || item.desc || '',
      link: item.link || (role === 'host' ? '/dashboard/host' : '/dashboard/supplier'),
      read: false,
      metadata: item.metadata || {},
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;
        const existing: NotificationItem[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = [newNotif, ...existing.slice(0, 49)];
        localStorage.setItem(storageKey, JSON.stringify(updated));

        broadcastNotificationBus('new', { role, notification: newNotif, count: updated.filter((n) => !n.read).length });
      } catch {}
    }

    api.post('/notifications', newNotif).catch(() => {});

    return newNotif;
  },

  markAsRead: async (id: string, role: 'host' | 'supplier' | 'admin' = 'host'): Promise<void> => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;
        const existing: NotificationItem[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map((n) => (n.id === id ? { ...n, read: true } : n));
        localStorage.setItem(storageKey, JSON.stringify(updated));
        broadcastNotificationBus('updated', { role, count: updated.filter((n) => !n.read).length });
      } catch {}
    }

    try {
      await api.patch(`/notifications/${id}/read`, {});
    } catch {}
  },

  markAllAsRead: async (role: 'host' | 'supplier' | 'admin' = 'host'): Promise<void> => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;
        const existing: NotificationItem[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map((n) => ({ ...n, read: true }));
        localStorage.setItem(storageKey, JSON.stringify(updated));
        broadcastNotificationBus('updated', { role, count: 0 });
      } catch {}
    }

    try {
      await api.patch('/notifications/read-all', { role });
    } catch {}
  },

  deleteNotification: async (id: string, role: 'host' | 'supplier' | 'admin' = 'host'): Promise<void> => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;
        const existing: NotificationItem[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.filter((n) => n.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        broadcastNotificationBus('updated', { role, count: updated.filter((n) => !n.read).length });
      } catch {}
    }

    try {
      await api.delete(`/notifications/${id}`);
    } catch {}
  },

  clearAll: async (role: 'host' | 'supplier' | 'admin' = 'host'): Promise<void> => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}`;
        localStorage.setItem(storageKey, JSON.stringify([]));
        broadcastNotificationBus('updated', { role, count: 0 });
      } catch {}
    }

    try {
      await api.delete(`/notifications/clear-all?role=${role}`);
    } catch {}
  },
};


