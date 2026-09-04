'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Sparkles,
  PartyPopper,
  Heart,
  Building2,
  Utensils,
  Baby,
} from 'lucide-react';
import CustomSelect, { SelectOption } from './ui/CustomSelect';
import CustomDatePicker from './ui/CustomDatePicker';
import CustomLocationInput from './ui/CustomLocationInput';
import { useLanguage } from '@/context/LanguageContext';

export interface SearchState {
  eventType: string;
  date: string;
  location: string;
  guests: string;
}

interface SearchWidgetProps {
  onSearchSubmit: (params: SearchState) => void;
}

export default function SearchWidget({ onSearchSubmit }: SearchWidgetProps) {
  const { t } = useLanguage();
  const [eventType, setEventType] = useState('Wedding');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('50 - 100 guests');

  const eventTypeOptions: SelectOption[] = [
    {
      value: 'Wedding',
      label: t.search.eventTypes.wedding.label,
      subtitle: t.search.eventTypes.wedding.subtitle,
      icon: <Heart className="w-4 h-4" />,
    },
    {
      value: 'Birthday Party',
      label: t.search.eventTypes.birthday.label,
      subtitle: t.search.eventTypes.birthday.subtitle,
      icon: <PartyPopper className="w-4 h-4" />,
    },
    {
      value: 'Corporate Event',
      label: t.search.eventTypes.corporate.label,
      subtitle: t.search.eventTypes.corporate.subtitle,
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      value: 'Anniversary Gala',
      label: t.search.eventTypes.anniversary.label,
      subtitle: t.search.eventTypes.anniversary.subtitle,
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      value: 'Baby Shower',
      label: t.search.eventTypes.babyShower.label,
      subtitle: t.search.eventTypes.babyShower.subtitle,
      icon: <Baby className="w-4 h-4" />,
    },
    {
      value: 'Private Dinner',
      label: t.search.eventTypes.privateDinner.label,
      subtitle: t.search.eventTypes.privateDinner.subtitle,
      icon: <Utensils className="w-4 h-4" />,
    },
  ];

  const guestCountOptions: SelectOption[] = [
    {
      value: '10 - 30 guests',
      label: t.search.guestOptions.tier1.label,
      subtitle: t.search.guestOptions.tier1.subtitle,
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: '30 - 50 guests',
      label: t.search.guestOptions.tier2.label,
      subtitle: t.search.guestOptions.tier2.subtitle,
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: '50 - 100 guests',
      label: t.search.guestOptions.tier3.label,
      subtitle: t.search.guestOptions.tier3.subtitle,
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: '100 - 200 guests',
      label: t.search.guestOptions.tier4.label,
      subtitle: t.search.guestOptions.tier4.subtitle,
      icon: <Users className="w-4 h-4" />,
    },
    {
      value: '200+ guests',
      label: t.search.guestOptions.tier5.label,
      subtitle: t.search.guestOptions.tier5.subtitle,
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({ eventType, date, location, guests });
  };

  return (
    <div className="bg-sand/90 backdrop-blur-md border border-taupe/20 rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-soft-lg transition-all hover:shadow-glow relative z-30">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
        {/* Event Type Selection */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>{t.search.eventTypeLabel}</span>
          </label>
          <CustomSelect
            value={eventType}
            onChange={setEventType}
            options={eventTypeOptions}
            placeholder={t.search.selectEventType}
            align="left"
          />
        </div>

        {/* Date Selection */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{t.search.dateLabel}</span>
          </label>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            placeholder={t.search.datePlaceholder}
          />
        </div>

        {/* Location Selection */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.search.locationLabel}</span>
          </label>
          <CustomLocationInput
            value={location}
            onChange={setLocation}
            placeholder={t.search.locationPlaceholder}
          />
        </div>

        {/* Guest Count & Submit */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{t.search.guestsLabel}</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <CustomSelect
                value={guests}
                onChange={setGuests}
                options={guestCountOptions}
                placeholder={t.search.selectGuests}
                align="right"
              />
            </div>
            <button
              type="submit"
              className="btn-primary shrink-0 px-4 sm:px-5 py-3 flex items-center justify-center gap-2 group h-[46px]"
              title={t.search.startBtn}
            >
              <Sparkles className="w-4 h-4 text-sand transition-transform group-hover:scale-110" />
              <span className="hidden xl:inline">{t.search.startBtn}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
