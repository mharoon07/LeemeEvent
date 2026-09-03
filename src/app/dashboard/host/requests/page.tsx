'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { FileText, MessageSquare, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function HostRequestsPage() {
  const requests = [
    {
      id: 'req_1',
      supplierName: 'Château de Bellevue',
      category: 'Venue & Location',
      dateSubmitted: 'Aug 28, 2026',
      price: '$4,500',
      status: 'Accepted',
      statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_2',
      supplierName: 'Maison Gourmet Catering',
      category: 'Catering & Food',
      dateSubmitted: 'Aug 29, 2026',
      price: '$3,800',
      status: 'Contract Sent',
      statusBadge: 'bg-blue-100 text-blue-800 border-blue-300',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_3',
      supplierName: 'Aura Floral & Styling',
      category: 'Floral & Decor',
      dateSubmitted: 'Aug 30, 2026',
      price: '$2,200',
      status: 'Pending',
      statusBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_4',
      supplierName: 'Lumière Wedding Photography',
      category: 'Photography',
      dateSubmitted: 'Aug 28, 2026',
      price: '$2,900',
      status: 'Deposit Paid',
      statusBadge: 'bg-purple-100 text-purple-800 border-purple-300',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <HostLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Status Tracker
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Requests & Booking Status
          </h1>
        </div>

        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-sand-50 border border-taupe/20 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft-sm"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative h-20 w-24 rounded-2xl overflow-hidden shrink-0">
                  <Image src={req.image} alt={req.supplierName} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-classico tracking-wider uppercase text-taupe font-semibold">
                      {req.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border ${req.statusBadge}`}>
                      {req.status}
                    </span>
                  </div>
                  <h3 className="font-classico text-lg uppercase font-semibold text-charcoal">
                    {req.supplierName}
                  </h3>
                  <span className="text-xs text-charcoal/60 font-sans block mt-0.5">
                    Submitted on {req.dateSubmitted} • Package: <strong className="text-taupe font-mono">{req.price}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-taupe/10">
                <Link
                  href="/dashboard/host/messages"
                  className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </Link>
                <Link
                  href="/dashboard/host/documents"
                  className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-sand" />
                  <span>Contract</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HostLayout>
  );
}
