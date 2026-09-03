import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6 text-center text-charcoal">
      <h1 className="font-serif-display text-8xl font-bold text-taupe mb-2">404</h1>
      <h2 className="font-serif-display text-3xl font-bold mb-3">Page Not Found</h2>
      <p className="text-sm text-charcoal/70 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="btn-primary px-6 py-3 text-sm flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
