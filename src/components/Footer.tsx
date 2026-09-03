'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-charcoal text-sand pt-20 pb-12 border-t border-taupe/20 relative overflow-hidden">
      {/* Top Footer Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-taupe to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-sand/10">

          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif-display text-3xl font-bold tracking-tight text-sand">
                LEEMEVENTS
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-taupe" />
            </Link>

            <p className="text-xs sm:text-sm text-sand/70 max-w-sm leading-relaxed">
              The leading two-sided event marketplace platform. Discover, compare, and book all your event suppliers in one place with a single combined request.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-sand-300 uppercase tracking-wider mb-2">
                Receive curated event inspiration
              </span>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-sand/10 border border-sand/20 rounded-xl px-3.5 py-2 text-xs text-sand placeholder-sand/40 focus:outline-none focus:border-taupe"
                  />
                  <button
                    type="submit"
                    className="btn-primary shrink-0 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <span>Subscribe</span>
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 text-xs text-taupe-300 bg-sand/10 p-2.5 rounded-xl border border-taupe/30">
                  <CheckCircle2 className="w-4 h-4 text-taupe" />
                  <span>Thank you! You are now subscribed to our newsletter.</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h4 className="font-serif-display text-lg font-bold text-sand mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-sand/70">
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Wedding Venues & Mansions
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Gourmet Catering & Chefs
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Wedding Photographers
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Cinematic Videography
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Floral Design & Styling
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  DJs & Live Music Bands
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Company */}
          <div>
            <h4 className="font-serif-display text-lg font-bold text-sand mb-4">
              Platform & Company
            </h4>
            <ul className="space-y-2.5 text-xs text-sand/70">
              <li>
                <Link href="/why-us" className="hover:text-taupe transition-colors">
                  Why LEEMEVENTS
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-taupe transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-taupe transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors">
                  Supplier Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-taupe transition-colors font-medium text-taupe-300">
                  Become a Supplier Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & HQ */}
          <div>
            <h4 className="font-serif-display text-lg font-bold text-sand mb-4">
              Contact & HQ
            </h4>
            <ul className="space-y-3 text-xs text-sand/70">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-taupe shrink-0" />
                <span>5th Avenue, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-taupe shrink-0" />
                <a href="mailto:hello@LEEMEVENTS.com" className="hover:text-taupe transition-colors">
                  hello@LEEMEVENTS.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-taupe shrink-0" />
                <a href="tel:+18005550199" className="hover:text-taupe transition-colors">
                  +1 (800) 555-0199
                </a>
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sand/10 border border-sand/20 flex items-center justify-center text-sand hover:bg-taupe hover:border-taupe transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-sand/10 border border-sand/20 flex items-center justify-center text-sand hover:bg-taupe hover:border-taupe transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand/50">
          <p>© {new Date().getFullYear()} LEEMEVENTS Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-sand transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-sand transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-sand transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
