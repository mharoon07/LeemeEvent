import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Tenor_Sans } from 'next/font/google';
import './globals.css';
import SeoSchema from '@/components/SeoSchema';
import { AuthProvider } from '@/context/AuthContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const tenorSans = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-classico',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LEEMEVENT — Wabi-Sabi Luxury Event Supplier Marketplace',
  description:
    'The premier stone & earth luxury event marketplace. Discover, compare, and book all event suppliers — venues, catering, photography, styling, DJ, cake, and more. Submit 1 combined request.',
  keywords: [
    'event planning',
    'wedding venue hire',
    'wedding suppliers',
    'catering booking',
    'wedding photographer',
    'event videographer',
    'DJ hire',
    'LEEMEVENT',
    'event marketplace',
    'plan an event',
  ],
  authors: [{ name: 'LEEMEVENT' }],
  creator: 'LEEMEVENT',
  publisher: 'LEEMEVENT Marketplace',
  metadataBase: new URL('https://leemevent.com'),
  alternates: {
    canonical: 'https://leemevent.com',
  },
  openGraph: {
    title: 'LEEMEVENT — Every event, planned in one place.',
    description:
      'Discover, compare, and book all your event suppliers in one place. Submit 1 combined request and manage your whole event effortlessly.',
    url: 'https://leemevent.com',
    siteName: 'LEEMEVENT',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'LEEMEVENT - Luxury event setup',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEEMEVENT — Every event, planned in one place.',
    description:
      'Book all your event suppliers in one place. Venues, catering, photography, styling, DJ, and more.',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable} ${tenorSans.variable}`}>
      <head>
        <SeoSchema />
      </head>
      <body className="bg-sand text-charcoal antialiased selection:bg-taupe selection:text-sand">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
