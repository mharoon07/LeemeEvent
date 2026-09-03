'use client';

import React from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Users, Calendar, MapPin } from 'lucide-react';

export default function SupplierCustomersPage() {
  const clients = [
    { name: 'Eleanor & Liam', event: 'Wedding', date: 'Sept 18, 2026', location: 'Cotswolds, UK', status: 'Confirmed', total: '$2,200' },
    { name: 'Marcus Vance', event: '30th Birthday', date: 'Oct 10, 2026', location: 'London, UK', status: 'Pending', total: '$1,400' },
    { name: 'Sophie & James', event: 'Anniversary', date: 'Nov 02, 2026', location: 'Bath, UK', status: 'Confirmed', total: '$1,850' },
  ];

  return (
    <SupplierLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Client Relationships
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            My Customers & Event Hosts
          </h1>
        </div>

        <div className="space-y-4">
          {clients.map((c, i) => (
            <div key={i} className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 flex items-center justify-between shadow-soft-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-classico text-lg uppercase font-semibold text-charcoal">{c.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-taupe/15 text-taupe">{c.event}</span>
                </div>
                <span className="text-xs text-charcoal/70 block">
                  {c.date} • {c.location}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-taupe block">{c.total}</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
}
