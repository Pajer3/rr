import type { Metadata } from 'next';

// Extra zekerheid: zet alle factuurpagina's op "niet indexeren" voor zoekmachines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function FacturenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
