import type { MetadataRoute } from 'next';

// Vertelt zoekmachines (Google e.d.) om het beheer- en API-gedeelte met rust te
// laten. De rest van de site mag gewoon gevonden worden.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    host: 'https://www.frisspits.nl',
  };
}
