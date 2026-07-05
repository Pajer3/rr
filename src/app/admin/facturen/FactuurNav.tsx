'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const LINKS = [
  { href: '/admin/facturen', label: 'Factuur maken' },
  { href: '/admin/facturen/versturen', label: 'Facturen versturen' },
  { href: '/admin/facturen/handtekening', label: 'E-mailhandtekening' },
  { href: '/admin/facturen/beheer', label: 'Beheer' },
  { href: '/admin/facturen/wachtwoord', label: 'Wachtwoord' },
];

export default function FactuurNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function uitloggen() {
    await fetch('/api/factuur/logout', { method: 'POST' });
    router.push('/admin/facturen/login');
    router.refresh();
  }

  return (
    <header className="bg-[#36393d] text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Image src="/factuur-logo.png" alt="Frisspits" width={120} height={28} className="h-7 w-auto" priority />
        <span className="text-sm text-white/50 hidden sm:inline">Factuursysteem</span>
        <nav className="flex items-center gap-1 ml-auto flex-wrap">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-sky-500 text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={uitloggen}
            className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-red-500/80 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </nav>
      </div>
    </header>
  );
}
