'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { Star, ShieldCheck, Plus, Check, Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Venue & Location',
  'Catering & Food Trucks',
  'Photography',
  'Videography',
  'Floral & Decor',
  'Bridal & Suits',
  'Hair & Makeup',
  'DJ & Music',
  'Wedding Planner',
  'Cake & Sweets',
];

const SUPPLIERS_LIST = [
  {
    id: 'sup_1',
    name: 'Château de Bellevue',
    category: 'Venue & Location',
    location: 'Cotswolds, UK',
    rating: 4.95,
    reviews: 48,
    price: '$4,500 / event',
    verified: true,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    added: true,
  },
  {
    id: 'sup_2',
    name: 'Maison Gourmet Catering',
    category: 'Catering & Food Trucks',
    location: 'London & Nationwide',
    rating: 4.90,
    reviews: 62,
    price: '$85 / guest',
    verified: true,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    added: true,
  },
  {
    id: 'sup_3',
    name: 'Lumière Wedding Photography',
    category: 'Photography',
    location: 'London, UK',
    rating: 4.98,
    reviews: 74,
    price: '$2,900 / full day',
    verified: true,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    added: true,
  },
  {
    id: 'sup_4',
    name: 'Aura Floral & Botanical Styling',
    category: 'Floral & Decor',
    location: 'Bath, UK',
    rating: 4.92,
    reviews: 35,
    price: '$2,200 / package',
    verified: true,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    added: false,
  },
  {
    id: 'sup_5',
    name: 'Harmonics Vinyl DJ & Live Sax',
    category: 'DJ & Music',
    location: 'London, UK',
    rating: 4.88,
    reviews: 51,
    price: '$1,600 / evening',
    verified: true,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    added: false,
  },
  {
    id: 'sup_6',
    name: 'Patisserie Atelier Cakes',
    category: 'Cake & Sweets',
    location: 'Oxford, UK',
    rating: 4.96,
    reviews: 29,
    price: '$750 / 3-tier',
    verified: true,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    added: false,
  },
];

export default function BrowseSuppliersPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState(SUPPLIERS_LIST);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesCategory = selectedCategory === 'All Categories' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAddSupplier = (id: string) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, added: !s.added } : s));
  };

  return (
    <HostLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-taupe block">
            Supplier Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
            Browse Vetted Event Partners
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-taupe absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by supplier name, service, or city..."
              className="w-full bg-white border border-stone-200/90 rounded-2xl pl-11 pr-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe shadow-soft-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-charcoal text-white shadow-soft-sm'
                    : 'bg-white border border-stone-200/90 text-charcoal hover:bg-stone-100/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Supplier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden hover:border-taupe/40 hover:shadow-soft-md transition-all shadow-soft-sm flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full">
                  <Image src={sup.image} alt={sup.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {sup.verified && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-taupe shadow-soft-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Partner</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-charcoal/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold shadow-sm">
                    {sup.price}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">
                    {sup.category} • {sup.location}
                  </span>
                  <h3 className="text-lg font-bold text-charcoal tracking-tight group-hover:text-taupe transition-colors">
                    {sup.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-charcoal">{sup.rating}</span>
                    <span>({sup.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-3 border-t border-stone-100 mt-3">
                <button
                  type="button"
                  onClick={() => toggleAddSupplier(sup.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    sup.added
                      ? 'bg-emerald-700 text-sand'
                      : 'btn-primary'
                  }`}
                >
                  {sup.added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Request</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-sand" />
                      <span>Add to Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HostLayout>
  );
}
