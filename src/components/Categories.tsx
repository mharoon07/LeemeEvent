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
import { useLanguage } from '@/context/LanguageContext';

interface CategoriesProps {
  onCategorySelect: (categoryId: string) => void;
}

export default function Categories({ onCategorySelect }: CategoriesProps) {
  const { t } = useLanguage();

  const categoriesData = [
    {
      id: 'venue',
      label: t.categories.list.venue.label,
      count: t.categories.list.venue.count,
      icon: Building2,
      tag: t.categories.list.venue.tag,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'catering',
      label: t.categories.list.catering.label,
      count: t.categories.list.catering.count,
      icon: Utensils,
      tag: t.categories.list.catering.tag,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'photography',
      label: t.categories.list.photography.label,
      count: t.categories.list.photography.count,
      icon: Camera,
      tag: t.categories.list.photography.tag,
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'videography',
      label: t.categories.list.videography.label,
      count: t.categories.list.videography.count,
      icon: Video,
      tag: t.categories.list.videography.tag,
      image: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'decor',
      label: t.categories.list.decor.label,
      count: t.categories.list.decor.count,
      icon: Flower2,
      tag: t.categories.list.decor.tag,
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'dress',
      label: t.categories.list.dress.label,
      count: t.categories.list.dress.count,
      icon: Shirt,
      tag: t.categories.list.dress.tag,
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'hair_makeup',
      label: t.categories.list.hair_makeup.label,
      count: t.categories.list.hair_makeup.count,
      icon: Sparkles,
      tag: t.categories.list.hair_makeup.tag,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'planner',
      label: t.categories.list.planner.label,
      count: t.categories.list.planner.count,
      icon: ClipboardCheck,
      tag: t.categories.list.planner.tag,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'nanny',
      label: t.categories.list.nanny.label,
      count: t.categories.list.nanny.count,
      icon: Baby,
      tag: t.categories.list.nanny.tag,
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'rentals',
      label: t.categories.list.rentals.label,
      count: t.categories.list.rentals.count,
      icon: Armchair,
      tag: t.categories.list.rentals.tag,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cake',
      label: t.categories.list.cake.label,
      count: t.categories.list.cake.count,
      icon: Cake,
      tag: t.categories.list.cake.tag,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'favors',
      label: t.categories.list.favors.label,
      count: t.categories.list.favors.count,
      icon: Gift,
      tag: t.categories.list.favors.tag,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'photoshoot',
      label: t.categories.list.photoshoot.label,
      count: t.categories.list.photoshoot.count,
      icon: Aperture,
      tag: t.categories.list.photoshoot.tag,
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="categories" className="py-28 bg-sand border-t border-taupe/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs tracking-wider uppercase text-taupe block mb-3 font-bold">
              {t.categories.tag}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight">
              {t.categories.titlePart1}{' '}
              <span className="text-taupe">
                {t.categories.titlePart2}
              </span>
            </h2>
            <p className="mt-3 text-base text-charcoal/70 leading-relaxed">
              {t.categories.subtext}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-200 text-taupe text-xs font-classico tracking-wider uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {t.categories.countBadge}
            </span>
          </div>
        </div>

        {/* Categories Grid with Background Photography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesData.map((cat, index) => {
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
