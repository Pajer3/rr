'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FactuurNav from '../FactuurNav';
import {
  parseGlasNotes, volgendeKeer, groep, weekNummer, formatNL, frequentieTekst,
  vanIso, type GlasAdres,
} from '@/lib/factuur/glas';

const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400';
const label = 'block text-sm font-medium text-gray-700 mb-1';
const card = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6';
const ghost = 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium';
const primary = 'px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50';
const groen = 'px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium disabled:opacity-50';

export default function GlasbewassingPage() {
  const router = useRouter();
  const [lijst, setLijst] = useState<GlasAdres[]>([]);
  const [loaded, setLoaded] = useState(false);
  const vandaag = useMemo(() => new Date(), []);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/factuur/glas');
      if (r.status === 401) { router.push('/admin/facturen/login'); return; }
      setLijst(await r.json());
      setLoaded(true);
    })();
  }, [router]);

  const groepen = useMemo(() => {
    const g = { nu: [] as GlasAdres[], volgende: [] as GlasAdres[], later: [] as GlasAdres[], onbekend: [] as GlasAdres[] };
    for (const a of lijst) g[groep(a, vandaag)].push(a);
    const opDatum = (x: GlasAdres, y: GlasAdres) => (volgendeKeer(x) || '').localeCompare(volgendeKeer(y) || '');
    g.nu.sort(opDatum); g.volgende.sort(opDatum); g.later.sort(opDatum);
    return g;
  }, [lijst, vandaag]);

  const week = weekNummer(vandaag);

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Glasbewassing</h1>
        <p className="text-gray-500 mb-6">
          Het is nu <b>week {week}</b>. Hieronder zie je welke adressen aan de beurt zijn.
          Klik na het wassen op <b>✓ Uitgevoerd</b> — de volgende keer wordt dan vanzelf uitgerekend.
        </p>

        {loaded && (
          <>
            <Groep titel={`🔵 Deze week aan de beurt (week ${week})`} leeg="Geen adressen deze week. 🎉"
              items={groepen.nu} setLijst={setLijst} vandaag={vandaag} accent />
            <Groep titel="Volgende week" leeg="Geen adressen volgende week."
              items={groepen.volgende} setLijst={setLijst} vandaag={vandaag} />
            <Groep titel="Later" leeg="Geen adressen gepland."
              items={groepen.later} setLijst={setLijst} vandaag={vandaag} />
            {groepen.onbekend.length > 0 && (
              <Groep titel="⚠️ Nog niet compleet (frequentie of datum mist)" leeg=""
                items={groepen.onbekend} setLijst={setLijst} vandaag={vandaag} />
            )}
            <ImportCard setLijst={setLijst} vandaag={vandaag} />
            <NieuwAdresCard setLijst={setLijst} />
          </>
        )}
      </main>
    </div>
  );
}

// ---- een groep adressen ----
function Groep({ titel, leeg, items, setLijst, vandaag, accent }: {
  titel: string; leeg: string;
  items: GlasAdres[];
  setLijst: React.Dispatch<React.SetStateAction<GlasAdres[]>>;
  vandaag: Date;
  accent?: boolean;
}) {
  return (
    <section className={card + (accent ? ' border-sky-200 ring-1 ring-sky-100' : '')}>
      <h2 className="text-lg font-bold text-gray-800 mb-3">{titel}</h2>
      {items.length === 0
        ? (leeg && <p className="text-sm text-gray-500">{leeg}</p>)
        : <div className="space-y-3">{items.map((a) => (
            <AdresRij key={a.id} adres={a} setLijst={setLijst} vandaag={vandaag} />
          ))}</div>}
    </section>
  );
}

// ---- één adres ----
function AdresRij({ adres, setLijst, vandaag }: {
  adres: GlasAdres;
  setLijst: React.Dispatch<React.SetStateAction<GlasAdres[]>>;
  vandaag: Date;
}) {
  const [open, setOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');
  const [phone, setPhone] = useState(adres.phone || '');
  const [address, setAddress] = useState(adres.address);
  const [every, setEvery] = useState(adres.every != null ? String(adres.every) : '');
  const [unit, setUnit] = useState<'weken' | 'maanden'>(adres.unit || 'maanden');
  const [lastDone, setLastDone] = useState(adres.lastDone || '');
  const [note, setNote] = useState(adres.note || '');

  const next = volgendeKeer(adres);
  const teLaat = next ? vanIso(next) < new Date(vandaag.getFullYear(), vandaag.getMonth(), vandaag.getDate()) : false;

  async function uitgevoerd() {
    setBezig(true); setFout('');
    try {
      const r = await fetch('/api/factuur/glas-done', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adres.id }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setFout(d.error || 'Er ging iets mis.'); return; }
      setLijst((prev) => prev.map((x) => (x.id === adres.id ? d.item : x)));
      setLastDone(d.item.lastDone || '');
    } finally { setBezig(false); }
  }

  async function opslaan() {
    setBezig(true); setFout('');
    try {
      const r = await fetch('/api/factuur/glas-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalId: adres.id, item: { phone, address, every, unit, lastDone: lastDone || null, note } }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setFout(d.error || 'Er ging iets mis.'); return; }
      setLijst((prev) => prev.map((x) => (x.id === adres.id ? d.item : x)));
      setOpen(false);
    } finally { setBezig(false); }
  }

  async function verwijderen() {
    if (!confirm(`"${adres.address}" uit de glasbewassing-lijst verwijderen?`)) return;
    setBezig(true);
    try {
      const r = await fetch('/api/factuur/glas-delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adres.id }),
      });
      if (r.ok) setLijst((prev) => prev.filter((x) => x.id !== adres.id));
    } finally { setBezig(false); }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-3 text-left flex-1 min-w-0">
          <span className="font-medium text-gray-800 truncate">{adres.address}</span>
          {adres.note && <span className="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 shrink-0">{adres.note}</span>}
        </button>
        <span className="text-sm text-gray-400 shrink-0">
          {frequentieTekst(adres)} · laatst: {formatNL(adres.lastDone)} ·{' '}
          {next
            ? <b className={teLaat ? 'text-red-600' : 'text-gray-600'}>
                {teLaat ? 'te laat — was ' : ''}week {weekNummer(vanIso(next))} ({formatNL(next)})
              </b>
            : <b className="text-amber-600">onbekend</b>}
        </span>
        <button onClick={uitgevoerd} disabled={bezig} className={groen + ' shrink-0'}>✓ Uitgevoerd</button>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <div><label className={label}>Telefoon</label><input className={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><label className={label}>Adres</label><input className={input} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          </div>
          <div className="mb-3">
            <label className={label}>Notitie (optioneel)</label>
            <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="bijv. op vakantie, €32" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-3">
            <div>
              <label className={label}>Om de hoeveel</label>
              <input className={input} type="number" min={1} value={every} onChange={(e) => setEvery(e.target.value)} placeholder="bijv. 2" />
            </div>
            <div>
              <label className={label}>Weken of maanden</label>
              <select className={input} value={unit} onChange={(e) => setUnit(e.target.value as 'weken' | 'maanden')}>
                <option value="weken">weken</option>
                <option value="maanden">maanden</option>
              </select>
            </div>
            <div>
              <label className={label}>Laatst uitgevoerd</label>
              <input className={input} type="date" value={lastDone} onChange={(e) => setLastDone(e.target.value)} />
            </div>
          </div>
          {adres.history.length > 1 && (
            <p className="text-xs text-gray-400 mb-3">Eerdere keren: {adres.history.map((h) => formatNL(h)).join(' · ')}</p>
          )}
          {fout && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">{fout}</div>}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={opslaan} disabled={bezig} className={primary}>Opslaan</button>
            <button onClick={verwijderen} disabled={bezig} className={ghost + ' !text-red-600 hover:!bg-red-50'}>🗑 Verwijderen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- notitie inlezen ----
function ImportCard({ setLijst, vandaag }: {
  setLijst: React.Dispatch<React.SetStateAction<GlasAdres[]>>;
  vandaag: Date;
}) {
  const [tekst, setTekst] = useState('');
  const [preview, setPreview] = useState<GlasAdres[] | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [bezig, setBezig] = useState(false);
  const [ok, setOk] = useState('');

  function inlezen() {
    const res = parseGlasNotes(tekst, vandaag);
    setPreview(res.items);
    setSkipped(res.skipped);
    setOk('');
  }

  async function toevoegen() {
    if (!preview || preview.length === 0) return;
    setBezig(true);
    try {
      const r = await fetch('/api/factuur/glas-import', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: preview }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { alert(d.error || 'Er ging iets mis.'); return; }
      setLijst(await (await fetch('/api/factuur/glas')).json());
      setOk(`✓ ${d.nieuw} nieuw toegevoegd, ${d.bijgewerkt} bijgewerkt`);
      setPreview(null); setTekst('');
    } finally { setBezig(false); }
  }

  return (
    <section className={card}>
      <h2 className="text-lg font-bold text-gray-800 mb-2">Notitie inlezen</h2>
      <p className="text-sm text-gray-500 mb-3">
        Plak hier je glasbewassing-notitie, precies zoals je hem bijhoudt — telefoonnummer, adres,
        hoe vaak en de datum of &quot;deze week&quot;. Bijvoorbeeld:{' '}
        <code className="bg-gray-100 px-1 rounded">0612345678 Wieringermeerpolder 4 1x per maand 3 juli</code>
      </p>
      <textarea className={input} rows={7} value={tekst} onChange={(e) => setTekst(e.target.value)}
        placeholder={'0612345678 Wieringermeerpolder 4 1x per maand 3 juli\n\n0687654321 Weteringkade 240 1 x 2 maanden deze week'} />
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button onClick={inlezen} className={primary}>Lees notitie in</button>
        {ok && <span className="text-green-600 font-semibold text-sm">{ok}</span>}
      </div>

      {preview && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Gevonden: {preview.length} adres{preview.length === 1 ? '' : 'sen'} — controleer even en klik dan op toevoegen.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">
                <th className="py-1 pr-3">Adres</th><th className="py-1 pr-3">Hoe vaak</th>
                <th className="py-1 pr-3">Laatst gedaan</th><th className="py-1">Telefoon</th>
              </tr></thead>
              <tbody>
                {preview.map((it) => (
                  <tr key={it.id} className="border-b last:border-0">
                    <td className="py-1.5 pr-3">{it.address}{it.note ? <span className="text-amber-700"> · {it.note}</span> : ''}</td>
                    <td className="py-1.5 pr-3">{frequentieTekst(it)}</td>
                    <td className="py-1.5 pr-3">{formatNL(it.lastDone)}</td>
                    <td className="py-1.5 font-mono text-gray-400 text-xs">{it.phone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {skipped.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Overgeslagen regels: {skipped.join('  •  ')}</p>
          )}
          <button onClick={toevoegen} disabled={bezig} className={groen + ' mt-3'}>
            {bezig ? 'Bezig…' : `✓ Voeg ${preview.length} adres${preview.length === 1 ? '' : 'sen'} toe`}
          </button>
        </div>
      )}
    </section>
  );
}

// ---- handmatig een adres toevoegen ----
function NieuwAdresCard({ setLijst }: {
  setLijst: React.Dispatch<React.SetStateAction<GlasAdres[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [every, setEvery] = useState('');
  const [unit, setUnit] = useState<'weken' | 'maanden'>('maanden');
  const [lastDone, setLastDone] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');

  async function toevoegen() {
    setBezig(true); setFout('');
    try {
      const r = await fetch('/api/factuur/glas-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: { phone, address, every, unit, lastDone: lastDone || null } }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setFout(d.error || 'Er ging iets mis.'); return; }
      setLijst((prev) => [...prev, d.item]);
      setPhone(''); setAddress(''); setEvery(''); setLastDone(''); setOpen(false);
    } finally { setBezig(false); }
  }

  return (
    <section className={card}>
      {!open ? (
        <button onClick={() => setOpen(true)} className={ghost}>+ Adres toevoegen</button>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Nieuw adres</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <div><label className={label}>Telefoon (optioneel)</label><input className={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><label className={label}>Adres</label><input className={input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Straat 1, Plaats" /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-3">
            <div><label className={label}>Om de hoeveel</label><input className={input} type="number" min={1} value={every} onChange={(e) => setEvery(e.target.value)} placeholder="bijv. 2" /></div>
            <div>
              <label className={label}>Weken of maanden</label>
              <select className={input} value={unit} onChange={(e) => setUnit(e.target.value as 'weken' | 'maanden')}>
                <option value="weken">weken</option>
                <option value="maanden">maanden</option>
              </select>
            </div>
            <div><label className={label}>Laatst uitgevoerd</label><input className={input} type="date" value={lastDone} onChange={(e) => setLastDone(e.target.value)} /></div>
          </div>
          {fout && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">{fout}</div>}
          <div className="flex gap-2">
            <button onClick={toevoegen} disabled={bezig || !address.trim()} className={primary}>Toevoegen</button>
            <button onClick={() => setOpen(false)} className={ghost}>Annuleren</button>
          </div>
        </>
      )}
    </section>
  );
}
