import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { go3Font } from './fonts';

export const metadata: Metadata = {
  title: "Frisspits - Professionele Schoonmaakdiensten",
  description: "Welkom bij Frisspits – uw allround schoonmaakpartner! Van glazenwassen en het reinigen van dakgoten tot het schoonmaken van zonnepanelen en complete bedrijfsruimtes, wij staan voor u klaar. Of het nu gaat om dagelijkse schoonmaak voor bedrijven, het reinigen van vloeren en gevels, of specialistische klussen zoals bouwschoonmaak, Frisspits levert altijd een stralend resultaat. Kwaliteit, betrouwbaarheid en zorg voor uw pand staan bij ons voorop. Vertrouw op Frisspits voor een frisse, grondige aanpak, binnen én buiten!",
  keywords: "schoonmaakbedrijf, glazenwassen, dakgoten reinigen, zonnepanelen schoonmaken, bedrijfsschoonmaak, vloerreiniging, gevelreiniging, bouwschoonmaak, professionele schoonmaak, schoonmaakdiensten Friesland, Amersfoort, Utrecht",
  openGraph: {
    title: "Frisspits - Uw Allround Schoonmaakpartner",
    description: "Frisspits biedt professionele schoonmaakdiensten voor bedrijven en particulieren. Van glazenwassen en dakgoten reinigen tot zonnepanelen schoonmaken en complete bedrijfsruimtes. Wij leveren kwaliteit, betrouwbaarheid en een frisse aanpak voor al uw schoonmaakbehoeften in Friesland en omstreken.",
    url: "https://frisspits.nl",
    siteName: "Frisspits",
    images: [
      {
        url: "https://frisspits.nl/icons/fs.jpg",
        width: 1200,
        height: 630,
        alt: "Frisspits Professionele Schoonmaakdiensten",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/fs-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/fs-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/fs-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/fs-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/icons/fs.ico",
    apple: [
      { url: "/icons/fs-180x180.png", sizes: "180x180", type: "image/png" },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={go3Font.variable}>
      <head>
        <link rel="alternate" hrefLang="nl-NL" href="https://frisspits.nl" />
        <link rel="alternate" hrefLang="en-US" href="https://frisspits.nl/en" />
        <script
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
              "image": "https://frisspits.nl/images/fs.jpg",
              "sameAs": [
                "https://www.facebook.com/frisspits",
                "https://www.instagram.com/frisspits",
                "https://www.linkedin.com/company/frisspits"
              ],
              "logo": "https://frisspits.nl/icons/fs-180x180.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+31 6 51891004",
                "contactType": "Klantenservice"
              }
            }),
          }}
        />
      </head>
      <body className={`flex flex-col min-h-screen bg-background font-go3`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
