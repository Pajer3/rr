import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { go3Font } from "./fonts";
export const metadata: Metadata = {
  title: "Frisspits Schoonmaakdiensten",
  description: "Professionele schoonmaakdiensten voor huizen en bedrijven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={go3Font.variable}>
      <body className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
