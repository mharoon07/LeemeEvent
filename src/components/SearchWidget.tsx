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

export interface SearchState {
  eventType: string;
  date: string;
  location: string;
  guests: string;
}

interface SearchWidgetProps {
  onSearchSubmit: (params: SearchState) => void;
}

const EVENT_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'Wedding',
    label: 'Wedding',
    subtitle: 'Ceremony & Reception',
    icon: <Heart className="w-4 h-4" />,
  },
  {
    value: 'Birthday Party',
    label: 'Birthday Party',
    subtitle: 'Milestone & Parties',
    icon: <PartyPopper className="w-4 h-4" />,
  },
  {
    value: 'Corporate Event',
    label: 'Corporate Event',
    subtitle: 'Conferences & Galas',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    value: 'Anniversary Gala',
    label: 'Anniversary Gala',
    subtitle: 'Milestone Celebrations',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    value: 'Baby Shower',
    label: 'Baby Shower & Reveal',
    subtitle: 'Showers & Family',
    icon: <Baby className="w-4 h-4" />,
  },
  {
    value: 'Private Dinner',
    label: 'Private Dinner',
    subtitle: 'Fine Dining & Soirées',
    icon: <Utensils className="w-4 h-4" />,
  },
];

const GUEST_COUNT_OPTIONS: SelectOption[] = [
  {
    value: '10 - 30 guests',
    label: '10 - 30 guests',
    subtitle: 'Intimate Gathering',
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: '30 - 50 guests',
    label: '30 - 50 guests',
    subtitle: 'Medium Party',
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: '50 - 100 guests',
    label: '50 - 100 guests',
    subtitle: 'Classic Celebration',
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: '100 - 200 guests',
    label: '100 - 200 guests',
    subtitle: 'Large Event',
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: '200+ guests',
    label: '200+ guests',
    subtitle: 'Grand Gala',
    icon: <Users className="w-4 h-4" />,
  },
];

export default function SearchWidget({ onSearchSubmit }: SearchWidgetProps) {
  const [eventType, setEventType] = useState('Wedding');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('50 - 100 guests');

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
            <span>Event Type</span>
          </label>
          <CustomSelect
            value={eventType}
            onChange={setEventType}
            options={EVENT_TYPE_OPTIONS}
            placeholder="Select Event Type"
            align="left"
          />
        </div>

        {/* Date Selection */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Event Date</span>
          </label>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            placeholder="mm/dd/yyyy"
          />
        </div>

        {/* Location Selection */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Location / City</span>
          </label>
          <CustomLocationInput
            value={location}
            onChange={setLocation}
            placeholder="e.g. London, New York..."
          />
        </div>

        {/* Guest Count & Submit */}
        <div className="flex flex-col text-left lg:col-span-3">
          <label className="text-xs font-semibold text-taupe uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Guest Count</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <CustomSelect
                value={guests}
                onChange={setGuests}
                options={GUEST_COUNT_OPTIONS}
                placeholder="Select Guests"
                align="right"
              />
            </div>
            <button
              type="submit"
              className="btn-primary shrink-0 px-4 sm:px-5 py-3 flex items-center justify-center gap-2 group h-[46px]"
              title="Start my event"
            >
              <Sparkles className="w-4 h-4 text-sand transition-transform group-hover:scale-110" />
              <span className="hidden xl:inline">Start</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
