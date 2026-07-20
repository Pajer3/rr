'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FilePenLine, KeyRound, LogOut, Mail, Settings, Signature, Sparkles } from 'lucide-react';

const LINKS = [
  { href: '/admin/facturen', label: 'Maken', longLabel: 'Factuur maken', icon: FilePenLine },
  { href: '/admin/facturen/versturen', label: 'Versturen', longLabel: 'Facturen versturen', icon: Mail },
  { href: '/admin/facturen/glasbewassing', label: 'Glas', longLabel: 'Glasbewassing', icon: Sparkles },
  { href: '/admin/facturen/handtekening', label: 'Handtekening', longLabel: 'E-mailhandtekening', icon: Signature },
  { href: '/admin/facturen/beheer', label: 'Beheer', longLabel: 'Beheer', icon: Settings },
  { href: '/admin/facturen/wachtwoord', label: 'Wachtwoord', longLabel: 'Wachtwoord', icon: KeyRound },
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#252a2f] text-white shadow-lg shadow-slate-900/10">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/admin/facturen" className="flex shrink-0 items-center gap-3" aria-label="Naar factuursysteem">
          <Image src="/factuur-logo.png" alt="Frisspits" width={120} height={28} className="h-7 w-auto" priority />
          <span className="hidden border-l border-white/20 pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50 xl:inline">Bedrijfsbeheer</span>
        </Link>
        <nav className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => {
            const exactRoot = link.href === '/admin/facturen';
            const active = exactRoot ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} title={link.longLabel} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? 'bg-sky-500 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
          <button onClick={uitloggen} title="Uitloggen" className="ml-1 flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-red-500 hover:text-white">
            <LogOut className="h-4 w-4" /><span className="hidden lg:inline">Uitloggen</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
