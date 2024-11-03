import type { Metadata } from "next";
import Script from 'next/script';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { go3Font } from './fonts';

export const metadata: Metadata = {
  title: "Frisspits - Professionele Schoonmaakdiensten",
  description: "Frisspits: uw allround schoonmaakpartner in Friesland en omstreken. Specialisten in glazenwassen, dakgoten reinigen, zonnepanelen schoonmaken en bedrijfsschoonmaak. Kwaliteit en betrouwbaarheid gegarandeerd.",
  keywords: "schoonmaakbedrijf, glazenwassen, dakgoten reinigen, zonnepanelen schoonmaken, bedrijfsschoonmaak, vloerreiniging, gevelreiniging, bouwschoonmaak, professionele schoonmaak, schoonmaakdiensten Friesland, Amersfoort, Utrecht",
  openGraph: {
    title: "Frisspits - Uw Allround Schoonmaakpartner",
    description: "Professionele schoonmaakdiensten voor bedrijven en particulieren. Van glazenwassen tot complete bedrijfsruimtes. Kwaliteit en betrouwbaarheid in Friesland en omstreken.",
    url: "https://frisspits.nl",
    siteName: "Frisspits",
    images: [
      {
        url: "/icons/fs.ico",
        width: 32,
        height: 32,
        alt: "Frisspits Logo",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  icons: {
    icon: [
      { 
        url: "/icons/fs.ico",
        sizes: "32x32",
        type: "image/x-icon"
      },
      {
        url: "/icons/fs-32x32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "/icons/fs-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        url: "/icons/fs-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
    ],
    shortcut: ["/icons/fs.ico"],
    apple: [
      { 
        url: "/icons/fs.ico",
        sizes: "32x32",
        type: "image/x-icon"
      }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/fs.ico",
      },
    ],
  },
  alternates: {
    canonical: "https://frisspits.nl",
    languages: {
      'nl-NL': 'https://frisspits.nl',
      'en-US': 'https://frisspits.nl/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "5zVGxtdt9nmcm6EpTxBpGwvY-sVmoUhkvBzoClCUxBU",
    yandex: "a0c72eba8bfeb42f",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={go3Font.variable}>
      <head>
        <link rel="icon" href="/icons/fs.ico" sizes="32x32" />
      </head>
      <body className={`flex flex-col min-h-screen bg-background font-go3`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <noscript>
          Deze website werkt het beste met JavaScript ingeschakeld.
        </noscript>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Frisspits",
              "description": "Professionele schoonmaakdiensten voor bedrijven en woningen in Friesland en omstreken.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Amersfoort",
                "addressRegion": "Utrecht",
                "addressCountry": "NL"
              },
              "telephone": "+31651891004",
              "email": "info@frisspits.nl",
              "url": "https://frisspits.nl",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                  ],
                  "opens": "08:00",
                  "closes": "18:00"
                }
              ],
              "priceRange": "$$",
              "image": "https://frisspits.nl/icons/fs.ico",
              "sameAs": [
                "https://www.facebook.com/frisspits",
                "https://www.instagram.com/frisspits",
              ],
              "logo": "https://frisspits.nl/icons/fs.ico",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+31 6 51891004",
                "contactType": "Klantenservice"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}