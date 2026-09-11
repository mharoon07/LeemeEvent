'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { supplierPortalApi } from '@/lib/services/consumerApi';
import { SupplierCustomerItem } from '@/types/api';
import {
  Users,
  Calendar,
  MapPin,
  Mail,
  DollarSign,
  Search,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function SupplierCustomersPage() {
  const [customers, setCustomers] = useState<SupplierCustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await supplierPortalApi.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spend || 0), 0);
  const totalBookings = customers.reduce((sum, c) => sum + (c.total_bookings || 0), 0);

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header & Metrics */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Client Ledger
              </span>
              <span className="text-xs text-stone-500 font-medium">Supabase Aggregated</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              My Customers & Event Hosts
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Directory of verified hosts and event planners who have booked or requested your bespoke services.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-left">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Clients</span>
              <span className="text-lg font-bold text-charcoal">{customers.length}</span>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-left">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Bookings</span>
              <span className="text-lg font-bold text-charcoal">{totalBookings}</span>
            </div>
            <div className="p-3 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-left">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Gross Revenue</span>
              <span className="text-lg font-bold text-charcoal font-mono">€{totalRevenue.toLocaleString()}</span>
            </div>
            <button
              onClick={loadCustomers}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Client List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-3 shadow-soft-sm max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients by name or email..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
            />
          </div>
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Aggregating client ledger...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-3 shadow-soft-sm">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-charcoal text-base">No customers recorded yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No clients matched your search query.'
                : 'As event hosts book your services and contracts are confirmed, their contact records and booking histories will be tracked here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCustomers.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all space-y-5"
              >
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-charcoal text-white font-bold text-base flex items-center justify-center shadow-soft-sm shrink-0">
                      {client.full_name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal text-base">{client.full_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-taupe" />
                          {client.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Lifetime Spend</span>
                    <span className="text-base font-bold text-charcoal font-mono">
                      €{Number(client.total_spend || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Event History Summary */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Booked Celebrations ({client.events?.length || 0})
                  </span>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {(client.events || []).map((ev, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-charcoal block truncate">
                            {ev.event_name || 'Celebration'}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {ev.service_name || 'Bespoke Package'} • {ev.date || 'TBD'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-semibold text-charcoal">
                            €{Number(ev.amount || 0).toLocaleString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.status === 'accepted' || ev.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ev.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
