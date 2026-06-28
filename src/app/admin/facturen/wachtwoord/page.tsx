'use client';

import { useState } from 'react';
import FactuurNav from '../FactuurNav';
import { ShieldCheck } from 'lucide-react';

export default function WachtwoordPage() {
  const [huidig, setHuidig] = useState('');
  const [nieuw, setNieuw] = useState('');
  const [herhaal, setHerhaal] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');
  const [klaar, setKlaar] = useState(false);

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    setFout(''); setKlaar(false);
    if (nieuw.length < 6) { setFout('Kies een nieuw wachtwoord van minstens 6 tekens.'); return; }
    if (nieuw !== herhaal) { setFout('De twee nieuwe wachtwoorden zijn niet hetzelfde.'); return; }
    setBezig(true);
    try {
      const res = await fetch('/api/factuur/wachtwoord', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ huidig, nieuw }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setKlaar(true);
        setHuidig(''); setNieuw(''); setHerhaal('');
      } else {
        setFout(data.error || 'Er ging iets mis.');
      }
    } catch {
      setFout('Er ging iets mis bij het opslaan.');
    } finally {
      setBezig(false);
    }
  }

  const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400';
  const label = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
            <h1 className="text-lg font-bold text-gray-800">Wachtwoord wijzigen</h1>
          </div>
          <p className="text-sm text-gray-500 mb-5">
            Je wachtwoord wordt versleuteld opgeslagen — het is nergens als gewone tekst te lezen.
          </p>

          <form onSubmit={opslaan} className="space-y-4">
            <div>
              <label className={label}>Huidig wachtwoord</label>
              <input className={input} type="password" value={huidig} onChange={(e) => setHuidig(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Nieuw wachtwoord</label>
              <input className={input} type="password" value={nieuw} onChange={(e) => setNieuw(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Nieuw wachtwoord herhalen</label>
              <input className={input} type="password" value={herhaal} onChange={(e) => setHerhaal(e.target.value)} required />
            </div>

            {fout && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{fout}</div>}
            {klaar && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">✓ Je wachtwoord is gewijzigd. Gebruik het de volgende keer dat je inlogt.</div>}

            <button type="submit" disabled={bezig}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50">
              {bezig ? 'Bezig…' : 'Wachtwoord opslaan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
