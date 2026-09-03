'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6 text-center text-charcoal">
      <div className="w-16 h-16 rounded-full bg-taupe/15 text-taupe flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="font-serif-display text-3xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-charcoal/70 max-w-md mb-6">
        An unexpected error occurred while rendering this page. Please try refreshing or click below to retry.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary px-6 py-3 text-sm flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
