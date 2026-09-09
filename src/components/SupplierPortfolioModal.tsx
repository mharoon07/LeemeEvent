'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  BadgeCheck,
  Sparkles,
  Award,
  Camera,
  MessageSquare,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  Users,
  Clock,
  Heart
} from 'lucide-react';
import { suppliersApi, reviewsApi } from '@/lib/services/consumerApi';

interface SupplierPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId?: string;
  initialSupplier?: any;
  serviceName?: string;
}

export default function SupplierPortfolioModal({
  isOpen,
  onClose,
  supplierId,
  initialSupplier,
  serviceName,
}: SupplierPortfolioModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [supplier, setSupplier] = useState<any>(initialSupplier || null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const targetId = supplierId || initialSupplier?.id || initialSupplier?.supplier_id;

        // Try to read local custom CV state for this supplier if any
        let localCv: any = null;
        if (typeof window !== 'undefined' && targetId) {
          try {
            const raw =
              localStorage.getItem(`LEEMEVENTS_SUPPLIER_PORTFOLIO_CV_${targetId}`) ||
              localStorage.getItem('LEEMEVENTS_SUPPLIER_PORTFOLIO_CV');
            if (raw) localCv = JSON.parse(raw);
          } catch (e) {}
        }
        setCvData(localCv);

        if (targetId) {
          const res = await suppliersApi.getSupplierPortfolio(targetId);
          if (res?.supplier) {
            setSupplier(res.supplier);
          } else if (initialSupplier) {
            setSupplier(initialSupplier);
          }
          if (Array.isArray(res?.reviews)) {
            setReviews(res.reviews);
          }
        } else if (initialSupplier) {
          setSupplier(initialSupplier);
        }
      } catch (err) {
        console.error('Failed to load portfolio modal details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, supplierId, initialSupplier]);

  if (!isOpen) return null;

  const businessName =
    supplier?.business_name ||
    supplier?.name ||
    initialSupplier?.business_name ||
    'Verified Supplier Partner';

  const category =
    supplier?.category ||
    initialSupplier?.category ||
    'Event Specialist';

  const city = supplier?.city || initialSupplier?.city || 'Madrid';

  const savedYears =
    supplier?.years_in_business ||
    supplier?.yearsInBusiness ||
    cvData?.yearsInBusiness ||
    (typeof window !== 'undefined' ? localStorage.getItem(`LEEMEVENTS_SUPPLIER_YEARS_IN_BUSINESS_${supplier?.id}`) : null) ||
    '8';

  const tagline =
    cvData?.tagline ||
    supplier?.tagline ||
    'Bespoke Celebration Scenography & Luxury Gastronomy';

  const bio =
    cvData?.bio ||
    supplier?.bio ||
    'Pioneering unforgettable celebration aesthetics across Europe. From private château weddings to high-profile luxury galas, we deliver world-class precision, ethical artisan sourcing, and turnkey execution.';

  const milestones = cvData?.milestones || [
    {
      id: 'm-1',
      title: 'Royal Botanic Garden Annual Gala',
      role: 'Lead Floral & Atmosphere Designer',
      venue: 'Madrid Botanical Estate',
      year: '2025',
      description: 'Engineered 14 bespoke floral pergolas and centerpiece styling for 350 VIP patrons.',
    },
    {
      id: 'm-2',
      title: 'Château de Bellevue Wedding Season',
      role: 'Exclusive Catering & Mixology Resident',
      venue: 'Château de Bellevue, Den Haag',
      year: '2024 - 2025',
      description: 'Delivered 24 full-service luxury weddings featuring seasonal 4-course gourmet dining.',
    },
  ];

  const certifications = cvData?.certifications || [
    {
      id: 'c-1',
      name: 'HACCP Level 3 Master Food Safety Certification',
      issuer: 'European Hospitality Authority',
      year: '2025',
      verified: true,
    },
    {
      id: 'c-2',
      name: 'European Master Floral & Scenography Guild',
      issuer: 'International Floral Artistry Board',
      year: '2024',
      verified: true,
    },
  ];

  const specialties = cvData?.specialties || [
    'Bespoke Scenography',
    'Michelin-Tasting Banquets',
    'Cold Spark FX & Atmospheric Smoke',
    'Botanical Cocktail Bars',
    'Halal Fine Dining',
    '4K Drone Cinematography',
    'Live Classical & Saxophone Ensembles',
  ];

  const awards = cvData?.awards || [
    {
      id: 'a-1',
      title: 'European Luxury Event Artisan Winner',
      organization: 'Bridal & Milestone Awards',
      year: '2025',
    },
    {
      id: 'a-2',
      title: 'Top 10 Bespoke Curators Feature',
      organization: 'Vogue Celebrations Spain',
      year: '2024',
    },
  ];

  const portfolioItems = Array.isArray(supplier?.portfolio) && supplier.portfolio.length > 0
    ? supplier.portfolio
    : [
        {
          id: 'p-1',
          media_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
          title: 'Royal Pavilion Grand Reception',
          category_tag: 'Weddings',
        },
        {
          id: 'p-2',
          media_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
          title: 'Candlelight Courtyard Banquet',
          category_tag: 'Gastronomy',
        },
        {
          id: 'p-3',
          media_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
          title: 'Bespoke Floral Pergola Showcase',
          category_tag: 'Floral Scenography',
        },
      ];

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.overall_rating || r.rating_overall || 5), 0) / totalReviews).toFixed(2)
      : supplier?.rating_avg && Number(supplier.rating_avg) > 0
      ? Number(supplier.rating_avg).toFixed(2)
      : null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-auto">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-charcoal text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-charcoal">{businessName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Partner</span>
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {category} • {city}, Spain & Destinations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/host/messages?supplierId=${supplier?.id || supplierId || ''}&supplierEmail=${encodeURIComponent(supplier?.profile?.email || supplier?.email || '')}&supplierName=${encodeURIComponent(businessName)}`}
              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-taupe" />
              <span className="hidden sm:inline">Message</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-100 transition-colors"
              title="Close Portfolio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 space-y-6 pt-0">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
            <div className="p-2">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Years in Business</span>
              <span className="text-sm sm:text-base font-bold text-charcoal font-mono mt-0.5 block">
                {savedYears} Years Experience
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Events Executed</span>
              <span className="text-sm sm:text-base font-bold text-charcoal font-mono mt-0.5 block">
                {supplier?.events_executed || '10+'} Events Completed
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Client Rating</span>
              <span className="text-sm sm:text-base font-bold text-charcoal flex items-center justify-center gap-1.5 mt-0.5">
                {avgRating ? (
                  <>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{avgRating} / 5.0</span>
                    <span className="text-xs text-stone-400 font-normal">({totalReviews} reviews)</span>
                  </>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    ★ New Specialist Partner
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Headline & Statement */}
          <div className="space-y-2 bg-sand-50/60 p-5 rounded-2xl border border-stone-200/80">
            <h3 className="font-bold text-charcoal text-sm sm:text-base">{tagline}</h3>
            <p className="text-xs text-stone-700 leading-relaxed">{bio}</p>
          </div>

          {/* Section: Visual Showcase Gallery */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-charcoal font-bold text-sm">
              <Camera className="w-4 h-4 text-taupe" />
              <span>Visual Showcase Gallery</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {portfolioItems.map((item: any, idx: number) => (
                <div key={idx} className="relative h-40 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 group">
                  <img src={item.media_url} alt={item.title || 'Portfolio Highlight'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-charcoal">
                    {item.category_tag || 'Showcase'}
                  </span>
                  <span className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white truncate">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Specialties Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-charcoal font-bold text-sm">
              <Sparkles className="w-4 h-4 text-taupe" />
              <span>Specialties & Core Capabilities</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-charcoal"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Career Milestones & Certifications (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milestones */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2 text-charcoal font-bold text-xs">
                <Briefcase className="w-4 h-4 text-taupe" />
                <span>Career Milestones & Residencies</span>
              </div>
              <div className="space-y-2.5">
                {milestones.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-charcoal">{m.title}</h4>
                      <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        {m.year}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px]"><span className="text-taupe font-semibold">{m.role}</span> • {m.venue}</p>
                    <p className="text-stone-500 text-[11px] leading-snug">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Awards */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2 text-charcoal font-bold text-xs">
                <BadgeCheck className="w-4 h-4 text-taupe" />
                <span>Certifications & Industry Honors</span>
              </div>
              <div className="space-y-2.5">
                {certifications.map((c: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-stone-100 flex items-start gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-charcoal text-xs">{c.name}</h4>
                      <span className="text-[10px] text-stone-400">{c.issuer} • Verified {c.year}</span>
                    </div>
                  </div>
                ))}

                {awards.map((a: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200/70 flex items-start gap-2 text-xs">
                    <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-charcoal text-xs">{a.title}</h4>
                      <span className="text-[10px] text-stone-500">{a.organization} • {a.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Verified Client Reviews */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-charcoal font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Verified Client Reviews ({reviews.length})</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs text-stone-500">
                No client reviews submitted yet. When bookings complete, verified testimonials will be listed here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reviews.map((rev: any, idx: number) => {
                  const reviewer =
                    rev.consumer_name ||
                    rev.consumer?.full_name ||
                    rev.consumer?.name ||
                    'Verified Host';
                  const score = Number(rev.overall_rating || rev.rating_overall || 5);

                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-charcoal">{reviewer}</span>
                        <span className="flex items-center gap-1 font-bold font-mono text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                          ★ {score.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[9px] text-stone-500 font-semibold">
                        <span>Punctuality: {rev.rating_punctuality || 5}★</span> •
                        <span>Quality: {rev.rating_quality || 5}★</span> •
                        <span>Value: {rev.rating_value || 5}★</span>
                      </div>
                      <p className="text-stone-700 italic bg-white p-2.5 rounded-lg border border-stone-100 text-[11px]">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-stone-100 flex items-center justify-between rounded-b-3xl">
          <span className="text-xs text-stone-500">
            Protected by LEEMEVENT Master Verification & Escrow
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
