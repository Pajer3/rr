'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FactuurNav from '../FactuurNav';
import type { Company, Customer } from '@/lib/factuur/types';

const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400';
const label = 'block text-sm font-medium text-gray-700 mb-1';
const card = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6';
const ghost = 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium';
const primary = 'px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50';

export default function BeheerPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await fetch('/api/factuur/company');
      if (c.status === 401) { router.push('/admin/facturen/login'); return; }
      setCompany(await c.json());
      setCustomers(await (await fetch('/api/factuur/customers')).json());
      setLoaded(true);
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Beheer</h1>
        <p className="text-gray-500 mb-6">
          Hier kun je instellingen en klanten aanpassen. Voor het maken van facturen heb je dit
          scherm niet nodig — dat gaat gewoon zoals je gewend bent.
        </p>

        {loaded && (
          <>
            <InstellingenCard company={company} setCompany={setCompany} />
            <KlantenCard customers={customers} setCustomers={setCustomers} />
          </>
        )}
      </main>
    </div>
  );
}

// ---- Instellingen (factuurnummer, betaaltermijn, bedrijfsgegevens) ----
function InstellingenCard({ company, setCompany }: {
  company: Partial<Company>;
  setCompany: React.Dispatch<React.SetStateAction<Partial<Company>>>;
}) {
  const [vorm, setVorm] = useState({
    numberPrefix: company.numberPrefix || '',
    nextNumber: String(company.nextNumber ?? ''),
    paymentTermDays: String(company.paymentTermDays ?? 30),
    btwRate: String(company.btwRate ?? 21),
    contactName: company.contactName || '',
    addressLine: company.addressLine || '',
    postcodeCity: company.postcodeCity || '',
    phone: company.phone || '',
    email: company.email || '',
    iban: company.iban || '',
    accountHolder: company.accountHolder || '',
    btwNumber: company.btwNumber || '',
    kvkNumber: company.kvkNumber || '',
  });
  const [bezig, setBezig] = useState(false);
  const [ok, setOk] = useState('');
  const [fout, setFout] = useState('');

  const zet = (k: string, v: string) => setVorm((p) => ({ ...p, [k]: v }));

  async function opslaan() {
    setBezig(true); setOk(''); setFout('');
    try {
      const res = await fetch('/api/factuur/company-update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vorm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setFout(data.error || 'Er ging iets mis.'); return; }
      setCompany(data.company);
      setOk('✓ Opgeslagen');
      setTimeout(() => setOk(''), 2600);
    } catch {
      setFout('Er ging iets mis bij het opslaan.');
    } finally {
      setBezig(false);
    }
  }

  return (
    <section className={card}>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Instellingen</h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label className={label}>Nummer-voorvoegsel</label>
          <input className={input} value={vorm.numberPrefix} onChange={(e) => zet('numberPrefix', e.target.value)} placeholder="2026-" />
        </div>
        <div>
          <label className={label}>Volgend factuurnummer</label>
          <input className={input} type="number" value={vorm.nextNumber} onChange={(e) => zet('nextNumber', e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        De eerstvolgende factuur wordt: <b>{vorm.numberPrefix}{vorm.nextNumber || '…'}</b>
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={label}>Standaard betaaltermijn (dagen)</label>
          <input className={input} type="number" value={vorm.paymentTermDays} onChange={(e) => zet('paymentTermDays', e.target.value)} />
        </div>
        <div>
          <label className={label}>BTW-percentage</label>
          <input className={input} type="number" value={vorm.btwRate} onChange={(e) => zet('btwRate', e.target.value)} />
        </div>
      </div>

      <details className="mb-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 py-1">Bedrijfsgegevens (op de factuur)</summary>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div><label className={label}>Contactpersoon</label><input className={input} value={vorm.contactName} onChange={(e) => zet('contactName', e.target.value)} /></div>
          <div><label className={label}>Telefoon</label><input className={input} value={vorm.phone} onChange={(e) => zet('phone', e.target.value)} /></div>
          <div><label className={label}>Adres</label><input className={input} value={vorm.addressLine} onChange={(e) => zet('addressLine', e.target.value)} /></div>
          <div><label className={label}>Postcode en plaats</label><input className={input} value={vorm.postcodeCity} onChange={(e) => zet('postcodeCity', e.target.value)} /></div>
          <div><label className={label}>E-mailadres</label><input className={input} value={vorm.email} onChange={(e) => zet('email', e.target.value)} /></div>
          <div><label className={label}>IBAN</label><input className={input} value={vorm.iban} onChange={(e) => zet('iban', e.target.value)} /></div>
          <div><label className={label}>Rekening op naam van</label><input className={input} value={vorm.accountHolder} onChange={(e) => zet('accountHolder', e.target.value)} /></div>
          <div><label className={label}>BTW-nummer</label><input className={input} value={vorm.btwNumber} onChange={(e) => zet('btwNumber', e.target.value)} /></div>
          <div><label className={label}>KvK-nummer</label><input className={input} value={vorm.kvkNumber} onChange={(e) => zet('kvkNumber', e.target.value)} /></div>
        </div>
      </details>

      {fout && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">{fout}</div>}
      <div className="flex items-center gap-3">
        <button onClick={opslaan} disabled={bezig} className={primary}>{bezig ? 'Bezig…' : 'Instellingen opslaan'}</button>
        {ok && <span className="text-green-600 font-semibold text-sm">{ok}</span>}
      </div>
    </section>
  );
}

// ---- Klanten (aanpassen en verwijderen) ----
function KlantenCard({ customers, setCustomers }: {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}) {
  return (
    <section className={card}>
      <h2 className="text-lg font-bold text-gray-800 mb-1">Klanten</h2>
      <p className="text-sm text-gray-500 mb-4">
        Klik op een klant om de gegevens aan te passen of de klant te verwijderen.
        Al gemaakte facturen blijven altijd bestaan.
      </p>
      <div className="space-y-3">
        {customers.length === 0 && <p className="text-gray-500 text-sm">Er zijn nog geen opgeslagen klanten.</p>}
        {customers.map((c) => (
          <KlantRij key={c.id || c.name} klant={c} setCustomers={setCustomers} />
        ))}
      </div>
    </section>
  );
}

function KlantRij({ klant, setCustomers }: {
  klant: Customer;
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [naam, setNaam] = useState(klant.name);
  const [email, setEmail] = useState(klant.email || '');
  const [adres, setAdres] = useState((klant.addressLines || []).join('\n'));
  const [type, setType] = useState(klant.type === 'particulier' ? 'particulier' : 'zakelijk');
  const [bericht, setBericht] = useState(klant.emailMessage || '');
  const [bezig, setBezig] = useState(false);
  const [ok, setOk] = useState('');
  const [fout, setFout] = useState('');

  async function opslaan() {
    setBezig(true); setOk(''); setFout('');
    try {
      const res = await fetch('/api/factuur/customer-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalId: klant.id,
          customer: {
            name: naam,
            email,
            addressLines: adres.split('\n').map((s) => s.trim()).filter(Boolean),
            type,
            emailMessage: bericht,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setFout(data.error || 'Er ging iets mis.'); return; }
      setCustomers((prev) => prev.map((x) => (x.id === klant.id ? data.customer : x)));
      setOk('✓ Opgeslagen');
      setTimeout(() => setOk(''), 2600);
    } catch {
      setFout('Er ging iets mis bij het opslaan.');
    } finally {
      setBezig(false);
    }
  }

  async function verwijderen() {
    if (!confirm(`Weet je zeker dat je "${klant.name}" wilt verwijderen?\n\nDe al gemaakte facturen blijven gewoon bestaan.`)) return;
    setBezig(true); setFout('');
    try {
      const res = await fetch('/api/factuur/customer-delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: klant.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setFout(data.error || 'Er ging iets mis.'); return; }
      setCustomers((prev) => prev.filter((x) => x.id !== klant.id));
    } catch {
      setFout('Er ging iets mis bij het verwijderen.');
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50">
        <span className="font-medium text-gray-800">{klant.name}</span>
        <span className="ml-auto text-sm text-gray-400">{klant.email || 'geen e-mail'} · {klant.type === 'particulier' ? 'particulier' : 'zakelijk'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="grid sm:grid-cols-2 gap-4 mb-3">
            <div><label className={label}>Naam</label><input className={input} value={naam} onChange={(e) => setNaam(e.target.value)} /></div>
            <div><label className={label}>E-mailadres</label><input className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          </div>
          <div className="mb-3">
            <label className={label}>Adres (één regel per regel)</label>
            <textarea className={input} rows={2} value={adres} onChange={(e) => setAdres(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className={label}>Soort klant</label>
            <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="zakelijk">Zakelijk — 30 dagen betaaltermijn</option>
              <option value="particulier">Particulier — 30 dagen betaaltermijn</option>
            </select>
          </div>
          <div className="mb-3">
            <label className={label}>Bewaard factuurbericht (leeg = standaardbericht)</label>
            <textarea className={input} rows={5} value={bericht} onChange={(e) => setBericht(e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">
              Woorden tussen accolades zoals {'{nummer}'} en {'{totaal}'} worden bij elke factuur automatisch ingevuld.
            </p>
          </div>

          {fout && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">{fout}</div>}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={opslaan} disabled={bezig} className={primary}>{bezig ? 'Bezig…' : 'Opslaan'}</button>
            <button onClick={verwijderen} disabled={bezig} className={ghost + ' !text-red-600 hover:!bg-red-50'}>🗑 Klant verwijderen</button>
            {ok && <span className="text-green-600 font-semibold text-sm">{ok}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
