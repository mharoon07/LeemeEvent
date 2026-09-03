import React from 'react';

export default function SeoSchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://leemevent.com/#website',
        url: 'https://leemevent.com',
        name: 'LEEMEVENT',
        description: 'The all-in-one event planning marketplace for discovering and booking verified event suppliers.',
        publisher: {
          '@id': 'https://leemevent.com/#organization',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'Organization',
        '@id': 'https://leemevent.com/#organization',
        name: 'LEEMEVENT Inc.',
        url: 'https://leemevent.com',
        logo: 'https://leemevent.com/logo.png',
        sameAs: [
          'https://instagram.com/leemevent',
          'https://linkedin.com/company/leemevent',
          'https://pinterest.com/leemevent',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-800-555-0199',
          contactType: 'customer service',
          email: 'hello@leemevent.com',
          areaServed: ['US', 'EU', 'UK'],
          availableLanguage: ['English', 'Dutch'],
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://leemevent.com/#service',
        name: 'LEEMEVENT Event Planning Marketplace',
        provider: {
          '@id': 'https://leemevent.com/#organization',
        },
        serviceType: 'Event Planning & Supplier Discovery Platform',
        areaServed: 'Worldwide',
        description:
          'Connect with verified venue, catering, photography, videography, decor, styling, DJ, and entertainment suppliers through a single combined quote request.',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '480',
          bestRating: '5',
          worstRating: '1',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
