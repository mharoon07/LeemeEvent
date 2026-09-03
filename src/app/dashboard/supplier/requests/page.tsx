'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Inbox, CheckCircle2, XCircle, MessageSquare, Calendar, MapPin, Users } from 'lucide-react';

export default function SupplierRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: 'sreq_1',
      hostName: 'Eleanor & Liam',
      eventType: 'Wedding Ceremony & Reception',
      eventDate: 'September 18, 2026',
      location: 'Cotswolds, UK',
      guestCount: 120,
      requestedService: 'Full Floral & Backdrop Package',
      budget: '$2,200',
      status: 'pending',
    },
    {
      id: 'sreq_2',
      hostName: 'Marcus Vance',
      eventType: '30th Birthday Dinner Gala',
      eventDate: 'October 10, 2026',
      location: 'London, UK',
      guestCount: 65,
      requestedService: 'Tablescape & Entrance Arch',
      budget: '$1,400',
      status: 'pending',
    },
    {
      id: 'sreq_3',
      hostName: 'Sophie & James',
      eventType: 'Anniversary Celebration',
      eventDate: 'November 02, 2026',
      location: 'Bath, UK',
      guestCount: 80,
      requestedService: 'Bridal Bouquet & Dining Florals',
      budget: '$1,850',
      status: 'accepted',
    },
  ]);

  const handleAction = (id: string, action: 'accepted' | 'declined') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <SupplierLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Inquiries Queue
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Incoming Booking Requests
          </h1>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-soft-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-classico text-xl uppercase font-semibold text-charcoal">
                    {req.hostName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {req.eventType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/80">
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-taupe" />
                    <span>{req.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-taupe" />
                    <span>{req.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-taupe" />
                    <span>{req.guestCount} Guests</span>
                  </div>
                </div>

                <div className="pt-1 text-xs text-charcoal/70">
                  Requested Package: <strong className="text-charcoal">{req.requestedService}</strong> • Budget: <span className="font-mono font-bold text-taupe">{req.budget}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {req.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(req.id, 'declined')}
                      className="px-4 py-2.5 rounded-xl border border-red-200 text-red-700 bg-red-50 text-xs font-classico tracking-wider uppercase font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction(req.id, 'accepted')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 text-sand text-xs font-classico tracking-wider uppercase font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-soft-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Booking</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-classico uppercase tracking-wider font-bold ${
                      req.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {req.status === 'accepted' ? '✓ Booking Accepted' : '✗ Request Declined'}
                  </span>
                )}

                <Link
                  href="/dashboard/supplier/messages"
                  className="btn-secondary px-3.5 py-2.5 text-xs flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
}
