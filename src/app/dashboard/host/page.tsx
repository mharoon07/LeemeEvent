'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HostLayout from '@/components/dashboard/HostLayout';
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Search,
  ShoppingBag,
} from 'lucide-react';

export default function HostDashboardHome() {
  const currentEvent = {
    name: "Eleanor & Liam's Country Estate Wedding",
    type: "Wedding",
    date: "September 18, 2026",
    daysRemaining: 16,
    location: "Cotswolds, UK",
    guestCount: 120,
    confirmedSuppliers: 3,
    totalSuppliersNeeded: 8,
  };

  const bookingRequests = [
    {
      id: 'req_1',
      supplierName: 'Château de Bellevue Venue',
      category: 'Venue & Location',
      price: '$4,500',
      status: 'Accepted',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_2',
      supplierName: 'Maison Gourmet Catering',
      category: 'Catering & Food',
      price: '$3,800',
      status: 'Contract Sent',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_3',
      supplierName: 'Aura Floral & Styling',
      category: 'Floral & Decor',
      price: '$2,200',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'req_4',
      supplierName: 'Lumière Wedding Photography',
      category: 'Photography',
      price: '$2,900',
      status: 'Accepted',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <HostLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
              Host Dashboard Overview
            </span>
            <h1 className="font-classico text-3xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal mt-1">
              Welcome back, Eleanor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/host/browse"
              className="btn-secondary px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Suppliers</span>
            </Link>
            <Link
              href="/dashboard/host/cart"
              className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-sand" />
              <span>View Cart (3)</span>
            </Link>
          </div>
        </div>

        {/* ACTIVE EVENT SUMMARY CARD */}
        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 sm:p-8 shadow-soft-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/10 text-taupe text-xs font-classico tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Event</span>
              </div>

              <h2 className="font-classico text-2xl sm:text-3xl font-normal uppercase tracking-wide text-charcoal">
                {currentEvent.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-charcoal/80">
                <div className="flex items-center gap-1.5 font-medium">
                  <CalendarDays className="w-4 h-4 text-taupe" />
                  <span>{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-taupe" />
                  <span>{currentEvent.location}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-taupe" />
                  <span>{currentEvent.guestCount} Guests</span>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-xs font-classico tracking-wider uppercase font-semibold text-charcoal">
                  <span>Supplier Confirmation Progress</span>
                  <span className="text-taupe">
                    {currentEvent.confirmedSuppliers} of {currentEvent.totalSuppliersNeeded} Confirmed
                  </span>
                </div>
                <div className="w-full h-2.5 bg-taupe/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-taupe transition-all duration-500"
                    style={{
                      width: `${(currentEvent.confirmedSuppliers / currentEvent.totalSuppliersNeeded) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="lg:col-span-4 bg-sand border border-taupe/20 rounded-2xl p-6 text-center space-y-2">
              <Clock className="w-6 h-6 text-taupe mx-auto" />
              <div className="font-classico text-4xl font-bold text-charcoal">
                {currentEvent.daysRemaining}
              </div>
              <div className="text-xs font-classico tracking-[0.2em] uppercase text-taupe font-semibold">
                Days Until Event
              </div>
            </div>

          </div>
        </div>

        {/* BOOKING STATUS TRACKER GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-classico text-xl uppercase font-normal text-charcoal tracking-wide">
              Supplier Booking Requests
            </h3>
            <Link
              href="/dashboard/host/requests"
              className="text-xs font-classico tracking-widest uppercase text-taupe hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All Requests</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-sand-50 border border-taupe/20 rounded-2xl p-4 space-y-3 hover:border-taupe/40 transition-colors shadow-soft-sm relative overflow-hidden"
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden">
                  <Image src={req.image} alt={req.supplierName} fill className="object-cover" />
                  <span
                    className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold border ${req.statusColor}`}
                  >
                    {req.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-classico tracking-wider uppercase text-taupe font-semibold block">
                    {req.category}
                  </span>
                  <h4 className="font-classico text-base uppercase font-semibold text-charcoal truncate">
                    {req.supplierName}
                  </h4>
                  <div className="mt-1 font-mono text-xs font-bold text-taupe">
                    {req.price}
                  </div>
                </div>

                <div className="pt-2 border-t border-taupe/10 flex items-center justify-between text-xs text-charcoal/70">
                  <span>Status Update</span>
                  <Link
                    href={`/dashboard/host/requests`}
                    className="text-taupe hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-sand-100 border border-taupe/20 rounded-2xl p-6 space-y-3">
            <h4 className="font-classico text-lg uppercase font-semibold text-charcoal">
              Add More Services
            </h4>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              Explore 13 curated supplier categories including DJ, Videography, Hair & Makeup, and Cake.
            </p>
            <Link
              href="/dashboard/host/browse"
              className="btn-primary inline-flex px-4 py-2 text-xs items-center gap-1.5"
            >
              <span>Explore Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-sand-100 border border-taupe/20 rounded-2xl p-6 space-y-3">
            <h4 className="font-classico text-lg uppercase font-semibold text-charcoal">
              Review Combined Deposit
            </h4>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              Review your unified deposit agreement for your confirmed suppliers in 1 single checkout.
            </p>
            <Link
              href="/dashboard/host/cart"
              className="btn-secondary inline-flex px-4 py-2 text-xs items-center gap-1.5"
            >
              <span>View Cart & Deposit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-sand-100 border border-taupe/20 rounded-2xl p-6 space-y-3">
            <h4 className="font-classico text-lg uppercase font-semibold text-charcoal">
              Supplier Chat Threads
            </h4>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              You have 2 unread messages from Château de Bellevue and Lumière Photography.
            </p>
            <Link
              href="/dashboard/host/messages"
              className="btn-secondary inline-flex px-4 py-2 text-xs items-center gap-1.5"
            >
              <span>Open Messages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </HostLayout>
  );
}
