'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function FactuurLoginPage() {
  const router = useRouter();
  const [wachtwoord, setWachtwoord] = useState('');
  const [toon, setToon] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFout('');
    try {
      const res = await fetch('/api/factuur/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wachtwoord }),
      });
      if (res.ok) {
        router.push('/admin/facturen');
        router.refresh();
      } else {
        setFout('Onjuist wachtwoord');
      }
    } catch {
      setFout('Er ging iets mis bij het inloggen');
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-400 rounded-full filter blur-3xl opacity-20" />

        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Factuursysteem</h1>
            <p className="text-blue-100">Frisspits Schoonmaakdiensten</p>
          </div>

          <form onSubmit={login} className="p-8 space-y-6">
            <div>
              <label htmlFor="ww" className="block text-sm font-medium text-white mb-2">Wachtwoord</label>
              <div className="relative">
                <input
                  id="ww"
                  type={toon ? 'text' : 'password'}
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Voer je wachtwoord in"
                  required
                />
                <button
                  type="button"
                  onClick={() => setToon(!toon)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {toon ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {fout && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm">
                {fout}
              </div>
            )}

            <button
              type="submit"
              disabled={bezig}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg"
            >
              {bezig ? 'Bezig…' : 'Inloggen'}
            </button>
          </form>

          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-white/60">Beveiligd — alleen voor Frisspits</p>
          </div>
        </div>
      </div>
    </div>
  );
}
