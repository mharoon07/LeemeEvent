'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Building2,
  Utensils,
  Camera,
  Video,
  Flower2,
  Shirt,
  Sparkles,
  ClipboardCheck,
  Baby,
  Armchair,
  Cake,
  Gift,
  Aperture,
  ArrowUpRight,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'venue',
    label: 'Venues & Locations',
    count: '140+ Unique Venues',
    icon: Building2,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'catering',
    label: 'Catering & Food Trucks',
    count: '95+ Culinary Partners',
    icon: Utensils,
    tag: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'photography',
    label: 'Photography',
    count: '110+ Photographers',
    icon: Camera,
    tag: 'Featured',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'videography',
    label: 'Videography',
    count: '65+ Filmmakers',
    icon: Video,
    tag: 'Cinematic',
    image: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'decor',
    label: 'Decor & Floral Design',
    count: '85+ Stylists',
    icon: Flower2,
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dress',
    label: 'Bridal & Suits',
    count: '45+ Boutiques',
    icon: Shirt,
    tag: 'Couture',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'hair_makeup',
    label: 'Hair & Makeup',
    count: '75+ Beauty Artists',
    icon: Sparkles,
    tag: 'Beauty',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'planner',
    label: 'Event & Wedding Planners',
    count: '40+ Directors',
    icon: ClipboardCheck,
    tag: 'Full Service',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nanny',
    label: 'Nanny & Kids Corner',
    count: '25+ Childcare Providers',
    icon: Baby,
    tag: 'Carefree',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'rentals',
    label: 'Tables, Chairs & Rentals',
    count: '55+ Rental Companies',
    icon: Armchair,
    tag: 'Furniture',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cake',
    label: 'Wedding Cake & Sweets',
    count: '60+ Patissiers',
    icon: Cake,
    tag: 'Artisan',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'favors',
    label: 'Favors & Gifting',
    count: '50+ Artisans',
    icon: Gift,
    tag: 'Keepsakes',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'photoshoot',
    label: 'Photoshoot Locations',
    count: '35+ Exclusive Spots',
    icon: Aperture,
    tag: 'Spotlight',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
  },
];

interface CategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

export default function Categories({ onCategorySelect }: CategoriesProps) {
  return (
    <section id="categories" className="py-28 bg-sand border-t border-taupe/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-3 font-semibold">
              Explore Our Supplier Network
            </span>
            <h2 className="font-classico text-3xl sm:text-5xl uppercase font-normal text-charcoal tracking-wide">
              All event specialists <span className="font-serif-display lowercase italic font-normal text-taupe">in one directory</span>
            </h2>
            <p className="mt-3 text-base text-charcoal/70 leading-relaxed">
              From enchanting estate grounds to artisan patissiers and award-winning photographers. Add to your combined request with one click.
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-200 text-taupe text-xs font-classico tracking-wider uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              13 Categories • 800+ Verified Partners
            </span>
          </div>
        </div>

        {/* Categories Grid with Background Photography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                onClick={() => onCategorySelect(cat.id)}
                className="group cursor-pointer relative h-[260px] sm:h-[280px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between border border-taupe/20 shadow-soft-md hover:shadow-soft-lg transition-all duration-500"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/20 group-hover:from-charcoal/95 transition-colors duration-300 z-10" />

                {/* Top Header inside Card */}
                <div className="relative z-20 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sand/20 backdrop-blur-md border border-white/20 text-sand flex items-center justify-center group-hover:bg-taupe group-hover:text-sand transition-all duration-300">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-[10px] font-classico tracking-widest uppercase text-sand bg-charcoal/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    {cat.tag}
                  </span>
                </div>

                {/* Bottom Content inside Card */}
                <div className="relative z-20">
                  <h3 className="font-classico text-lg sm:text-xl uppercase font-semibold text-sand tracking-wide mb-1.5 group-hover:text-sand-100 transition-colors leading-snug">
                    {cat.label}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-sand/80 pt-1">
                    <span>{cat.count}</span>
                    <div className="w-7 h-7 rounded-full bg-sand/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-taupe group-hover:scale-110 transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5 text-sand" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
