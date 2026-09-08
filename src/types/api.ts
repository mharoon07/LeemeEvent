// API Types matching LEEMEVENT 2026 Supabase Backend

export type BackendRole = 'consumer' | 'supplier' | 'admin';
export type FrontendRole = 'host' | 'supplier' | 'admin';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: FrontendRole;
  city?: string;
  phone?: string;
  avatar?: string;
  onboarded: boolean;
  supplierApproved: boolean;
  businessName?: string;
  is_active?: boolean;
  isActive?: boolean;
  isSuspended?: boolean;
  verification_status?: string;
  suspensionReason?: string;
}

export interface AuthResponseData {
  user: {
    id: string;
    full_name?: string;
    name?: string;
    email: string;
    role: BackendRole | FrontendRole;
    city?: string;
    phone?: string;
    avatar_url?: string;
  };
  role: BackendRole | FrontendRole;
  token: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  is_active: boolean;
}

export interface EventType {
  id: string;
  name: string;
  slug: string;
  typical_services?: string[];
}

export interface SupplierService {
  id: string;
  supplier_id?: string;
  name: string;
  description?: string;
  pricing_type: 'fixed' | 'hourly' | 'per_guest' | 'custom_quote' | 'custom';
  base_price: number;
  deposit_percentage: number;
  duration_minutes?: number;
  capacity_min?: number;
  capacity_max?: number;
  is_active?: boolean;
  category_id?: string;
  category?: any;
  location?: string;
  image?: string;
  rating_avg?: number;
  review_count?: number;
  supplier?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierAvailability {
  id?: string;
  supplier_id?: string;
  date: string;
  status: 'available' | 'booked' | 'blocked' | 'tentative';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierPortfolioItem {
  id: string;
  supplier_id?: string;
  media_url: string;
  media_type: 'image' | 'video';
  title?: string;
  caption?: string;
  category_tag?: string;
  sort_order?: number;
  created_at?: string;
}

export interface SupplierCustomerItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  total_bookings: number;
  total_spend: number;
  last_booking_date: string;
  status?: string;
  events: Array<{
    id: string;
    event_name?: string;
    event_type?: string;
    date?: string;
    status?: string;
    service_name?: string;
    amount?: number;
  }>;
}

export interface SupplierProfile {
  id: string;
  business_name: string;
  slug?: string;
  category_id?: string;
  tagline?: string;
  bio?: string;
  city?: string;
  country?: string;
  address?: string;
  service_radius_km?: number;
  starting_price?: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  rating_avg?: number;
  review_count?: number;
  subscription_tier?: 'starter' | 'pro' | 'elite';
  is_reliable_calendar?: boolean;
  services?: SupplierService[];
  portfolio?: SupplierPortfolioItem[];
  profile?: {
    id: string;
    email?: string;
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface EventItem {
  id: string;
  creator_id?: string;
  event_type_id?: string;
  event_type?: any;
  title: string;
  type?: string;
  event_date: string;
  city: string;
  venue_name?: string;
  guest_count: number;
  estimated_budget?: number;
  status: 'draft' | 'planning' | 'booked' | 'completed' | 'cancelled' | 'Active' | 'Planning';
  confirmed_count?: number;
  total_suppliers_needed?: number;
}

export interface CreateEventPayload {
  title: string;
  name?: string;
  event_type_id?: string;
  event_type?: string;
  event_date: string;
  date?: string;
  city: string;
  venue_name?: string;
  location_address?: string;
  guest_count: number;
  estimated_budget?: number;
  status?: string;
  notes?: string;
  [key: string]: any;
}

export interface BroadcastRequestPayload {
  event_id?: string;
  event_title?: string;
  category_id?: string;
  supplier_ids: string[];
  event_date: string;
  city: string;
  guest_count: number;
  budget_max?: number;
  requirements?: string;
}

export interface BookingItem {
  id: string;
  event_id: string;
  supplier_id: string;
  supplier_name?: string;
  category?: string;
  service_id?: string;
  status: 'inquiry' | 'quote_sent' | 'availability_confirmed' | 'deposit_pending' | 'deposit_paid' | 'confirmed' | 'contract_signed' | 'completed' | 'declined' | 'Accepted' | 'Contract Sent' | 'Pending';
  requested_date: string;
  guest_count?: number;
  custom_requirements?: string;
  quote_amount?: number;
  deposit_amount?: number;
  valid_until?: string;
  image?: string;
}

export interface ContractItem {
  id: string;
  booking_id: string;
  supplier_id: string;
  supplier_name: string;
  consumer_id: string;
  title: string;
  category: string;
  total_amount: number;
  deposit_amount: number;
  event_date: string;
  status: 'draft' | 'pending_consumer_signature' | 'pending_supplier_signature' | 'signed' | 'cancelled';
  signed_at?: string;
  pdf_url?: string;
  terms_summary?: string;
}

export interface PaymentItem {
  id: string;
  booking_id: string;
  consumer_id: string;
  supplier_id: string;
  supplier_name?: string;
  amount: number;
  payment_type: 'deposit_25' | 'balance_75' | 'full';
  status: 'held_in_escrow' | 'released_to_supplier' | 'refunded' | 'pending';
  transaction_ref: string;
  created_at: string;
}

export interface ReviewItem {
  id: string;
  booking_id: string;
  supplier_id: string;
  consumer_id: string;
  rating_punctuality: number;
  rating_quality: number;
  rating_communication: number;
  rating_value: number;
  overall_rating: number;
  comment?: string;
  supplier_reply?: string;
  is_verified_booking: boolean;
  created_at: string;
}

// Admin Panel API Types
export interface AdminStatsData {
  totalHosts: number;
  totalSuppliers: number;
  pendingSuppliers: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings?: any[];
  pendingApprovals?: AdminSupplierItem[];
}

export interface AdminSupplierItem {
  id: string;
  user_id?: string;
  business_name: string;
  slug?: string;
  category_id?: string;
  category_name?: string;
  category?: { id?: string; name?: string; icon?: string };
  tagline?: string;
  city?: string;
  country?: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  verification_notes?: string;
  starting_price?: number;
  rating_avg?: number;
  review_count?: number;
  created_at?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  profile?: {
    id?: string;
    email?: string;
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
  user?: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
}

export interface AdminUserItem {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'consumer' | 'supplier' | 'admin' | 'host';
  city?: string;
  avatar_url?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at: string;
  total_events_count?: number;
  total_spent?: number;
}

export interface AdminBookingItem {
  id: string;
  event_id?: string;
  event_title?: string;
  consumer_name?: string;
  consumer_email?: string;
  supplier_name?: string;
  supplier_business?: string;
  service_name?: string;
  category?: string;
  requested_date?: string;
  event_date?: string;
  status: string;
  quote_amount?: number;
  deposit_amount?: number;
  created_at?: string;
}

