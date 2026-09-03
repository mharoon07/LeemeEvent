'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#ECE3D9] text-[#2B2620] font-sans min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-3">System Exception</h2>
          <p className="text-sm opacity-80 mb-6">
            A global layout error occurred. Please click below to reset the application.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#917555] text-[#ECE3D9] font-medium rounded-xl hover:bg-[#7E6346] transition-all"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
