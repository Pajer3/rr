import type { Metadata } from "next";
import Script from 'next/script';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";
import { go3Font } from './fonts';

export const metadata: Metadata = {
  title: "Frisspits - Professionele Schoonmaakdiensten",
  description: "Frisspits: uw allround schoonmaakpartner in Friesland en omstreken.",
  icons: {
    icon: "/icons/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={go3Font.variable}>
      <body className={`flex flex-col min-h-screen bg-background font-go3`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Frisspits",
              "description": "Professionele schoonmaakdiensten voor bedrijven en woningen in Friesland en omstreken.",
              "url": "https://frisspits.nl",
            }),
          }}
        />
      </body>
    </html>
  );
}
