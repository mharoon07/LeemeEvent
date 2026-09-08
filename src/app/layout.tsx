import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import SeoSchema from '@/components/SeoSchema';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LEEMEVENTS — Wabi-Sabi Luxury Event Supplier Marketplace',
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
    'LEEMEVENTS',
    'event marketplace',
    'plan an event',
  ],
  authors: [{ name: 'LEEMEVENTS' }],
  creator: 'LEEMEVENTS',
  publisher: 'LEEMEVENTS Marketplace',
  metadataBase: new URL('https://LEEMEVENTS.com'),
  alternates: {
    canonical: 'https://LEEMEVENTS.com',
  },
  openGraph: {
    title: 'LEEMEVENTS — Every event, planned in one place.',
    description:
      'Discover, compare, and book all your event suppliers in one place. Submit 1 combined request and manage your whole event effortlessly.',
    url: 'https://LEEMEVENTS.com',
    siteName: 'LEEMEVENTS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'LEEMEVENTS - Luxury event setup',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEEMEVENTS — Every event, planned in one place.',
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
    <html lang="en" className={bricolage.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />
        <SeoSchema />
      </head>
      <body className="bg-sand text-charcoal font-sans antialiased selection:bg-taupe selection:text-sand">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
