'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import FactuurNav from './FactuurNav';
import {
  money, DEFAULT_MESSAGE, fillTemplate, templatize, buildSubject, type Vals,
} from '@/lib/factuur/message';
import type { Company, Customer } from '@/lib/factuur/types';

interface Row { id: number; dateText: string; type: string; amount: string }

interface InvoiceResult {
  invoiceNumber: string;
  totals: { subtotal: number; btw: number; total: number };
  file: string;
  pdfUrl: string;
  synced?: boolean;
  syncMap?: string | null;
}

export default function FactuurMakenPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Klant
  const [customerId, setCustomerId] = useState('');
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custType, setCustType] = useState('zakelijk');
  const [saveCustomer, setSaveCustomer] = useState(true);

  // Notitie
  const [notes, setNotes] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [skipped, setSkipped] = useState('');

  // Regels
  const [rows, setRows] = useState<Row[]>([]);
  const [linesVisible, setLinesVisible] = useState(false);
  const rowId = useRef(1);

  // Factuurgegevens
  const [invNumber, setInvNumber] = useState('');
  const [invDate, setInvDate] = useState('');
  const [payTerm, setPayTerm] = useState('30');

  // Resultaat
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [lastVals, setLastVals] = useState<Vals | null>(null);
  const [lastCustomerName, setLastCustomerName] = useState('');
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [okMsg, setOkMsg] = useState('');

  // --- laden ---
  useEffect(() => {
    (async () => {
      const c = await fetch('/api/factuur/company');
      if (c.status === 401) { router.push('/admin/facturen/login'); return; }
      const comp: Partial<Company> = await c.json();
      const custs: Customer[] = await (await fetch('/api/factuur/customers')).json();
      setCompany(comp);
      setCustomers(custs);
      const now = new Date();
      setYear(now.getFullYear());
      setInvNumber((comp.numberPrefix || '') + (comp.nextNumber || ''));
      setInvDate(`${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
    })();
  }, [router]);

  // --- afgeleide totalen ---
  const totals = useMemo(() => {
    const sub = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const rate = company.btwRate || 21;
    const btw = Math.round(sub * (rate / 100) * 100) / 100;
    return { sub, btw, total: Math.round((sub + btw) * 100) / 100, rate };
  }, [rows, company.btwRate]);

  function kiesKlant(id: string) {
    setCustomerId(id);
    const c = customers.find((x) => x.id === id);
    if (c) {
      setCustName(c.name);
      setCustEmail(c.email || '');
      setCustAddress((c.addressLines || []).join('\n'));
      const t = c.type === 'particulier' ? 'particulier' : 'zakelijk';
      setCustType(t);
      setPayTerm(t === 'particulier' ? '14' : '30');
    } else {
      setCustName(''); setCustEmail(''); setCustAddress(''); setCustType('zakelijk'); setPayTerm('30');
    }
  }

  function kiesType(t: string) {
    setCustType(t);
    setPayTerm(t === 'particulier' ? '14' : '30');
  }

  function addRow(it?: Partial<Row>) {
    setRows((prev) => [...prev, {
      id: rowId.current++,
      dateText: it?.dateText || '',
      type: it?.type === 'glasbewassing' ? 'glasbewassing' : 'schoonmaak',
      amount: it?.amount != null ? String(it.amount) : '',
    }]);
  }

  async function doParse() {
    const res = await fetch('/api/factuur/parse', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: notes, year }),
    });
    if (res.status === 401) { router.push('/admin/facturen/login'); return; }
    const data = await res.json();
    rowId.current = 1;
    setRows((data.items || []).map((it: { dateText?: string; type?: string; amount?: number }) => ({
      id: rowId.current++,
      dateText: it.dateText || '',
      type: it.type === 'glasbewassing' ? 'glasbewassing' : 'schoonmaak',
      amount: it.amount != null ? String(it.amount) : '',
    })));
    setSkipped(data.skipped && data.skipped.length ? 'Overgeslagen regels: ' + data.skipped.join('  •  ') : '');
    setLinesVisible(true);
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function makeInvoice() {
    if (!custName.trim()) { alert('Vul een klantnaam in.'); return; }
    const items = rows
      .map((r) => ({ dateText: r.dateText.trim(), type: r.type, amount: parseFloat(r.amount) }))
      .filter((r) => !isNaN(r.amount));
    if (items.length === 0) { alert('Er zijn geen factuurregels.'); return; }

    setBusy(true);
    try {
      const customer: Customer = {
        name: custName.trim(),
        email: custEmail.trim(),
        addressLines: custAddress.split('\n').map((s) => s.trim()).filter(Boolean),
        customerNo: customers.find((c) => c.id === customerId)?.customerNo,
        type: custType,
      };
      const res = await fetch('/api/factuur/invoice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer, items,
          invoiceNumber: invNumber.trim(),
          dateText: invDate.trim(),
          paymentTermDays: parseInt(payTerm, 10),
          saveCustomer,
        }),
      });
      if (res.status === 401) { router.push('/admin/facturen/login'); return; }
      const data = await res.json();
      if (data.error) { alert('Fout: ' + data.error); return; }
      setResult(data);
      showResult(data, customer);
      // klantenlijst verversen (nieuw nummer / nieuwe klant)
      setCustomers(await (await fetch('/api/factuur/customers')).json());
      setInvNumber((company.numberPrefix || '') + ((company.nextNumber || 0) + 1));
    } catch (e) {
      alert('Er ging iets mis: ' + (e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  function showResult(data: InvoiceResult, customer: Customer) {
    const vals: Vals = {
      klant: customer.name,
      nummer: data.invoiceNumber,
      totaal: money(data.totals.total),
      termijn: payTerm,
      iban: company.iban || '',
      tnv: company.accountHolder || '',
      contactpersoon: company.contactName || '',
      telefoon: company.phone || '',
    };
    setLastVals(vals);
    setLastCustomerName(customer.name);
    const saved = customers.find((c) => c.name === customer.name);
    const template = saved?.emailMessage || DEFAULT_MESSAGE;
    setMailTo(customer.email || '');
    setMailSubject(buildSubject(company, data.invoiceNumber));
    setMailBody(fillTemplate(template, vals));
    setOkMsg('');
  }

  async function copyMessage() {
    try { await navigator.clipboard.writeText(mailBody); } catch { /* */ }
    flash('✓ Gekopieerd');
  }

  async function saveMessage() {
    if (!lastVals || !lastCustomerName) return;
    const template = templatize(mailBody, lastVals);
    const res = await fetch('/api/factuur/customer-message', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: lastCustomerName, message: template }),
    });
    if (res.ok) {
      setCustomers((prev) => {
        const c = prev.find((x) => x.name === lastCustomerName);
        if (c) return prev.map((x) => (x.name === lastCustomerName ? { ...x, emailMessage: template } : x));
        return [...prev, { name: lastCustomerName, emailMessage: template }];
      });
      flash('✓ Bewaard voor deze klant');
    }
  }

  function flash(msg: string) {
    setOkMsg(msg);
    setTimeout(() => setOkMsg(''), 2600);
  }

  async function reveal() {
    if (!result) return;
    await fetch('/api/factuur/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: result.file }),
    });
  }

  function openMailto() {
    window.location.href = `mailto:${encodeURIComponent(mailTo)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    reveal();
  }
  function openGmail() {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(mailTo)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`, '_blank');
    reveal();
  }

  const card = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6';
  const label = 'block text-sm font-medium text-gray-700 mb-1';
  const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400';

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Stap 1: Klant */}
        <section className={card}>
          <h2 className="text-lg font-bold text-gray-800 mb-4">1 · Klant</h2>
          <div className="mb-4">
            <label className={label}>Bestaande klant</label>
            <select className={input} value={customerId} onChange={(e) => kiesKlant(e.target.value)}>
              <option value="">— Nieuwe klant —</option>
              {customers.filter((c) => c.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={label}>Naam</label>
              <input className={input} value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="Bijv. Taxi Boute" />
            </div>
            <div>
              <label className={label}>E-mailadres</label>
              <input className={input} value={custEmail} onChange={(e) => setCustEmail(e.target.value)} placeholder="klant@voorbeeld.nl" />
            </div>
          </div>
          <div className="mb-4">
            <label className={label}>Adres (één regel per regel)</label>
            <textarea className={input} rows={2} value={custAddress} onChange={(e) => setCustAddress(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className={label}>Soort klant</label>
            <select className={input} value={custType} onChange={(e) => kiesType(e.target.value)}>
              <option value="zakelijk">Zakelijk — 30 dagen betaaltermijn</option>
              <option value="particulier">Particulier — 14 dagen betaaltermijn</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={saveCustomer} onChange={(e) => setSaveCustomer(e.target.checked)} />
            Klantgegevens onthouden
          </label>
        </section>

        {/* Stap 2: Notitie */}
        <section className={card}>
          <h2 className="text-lg font-bold text-gray-800 mb-2">2 · Plak je notitie</h2>
          <p className="text-sm text-gray-500 mb-3">
            Plak de regels zoals je ze bijhoudt, bijv. <code className="bg-gray-100 px-1 rounded">€145 glasbewassing kantoor 13 mei</code>.
            Regels als <code className="bg-gray-100 px-1 rounded">507#</code> of de klantnaam worden overgeslagen.
          </p>
          <textarea className={input} rows={7} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={'€145 glasbewassing kantoor 13 mei\n€76 kantoor 4 mei\n€76 kantoor 11 mei'} />
          <div className="flex items-center gap-3 mt-3">
            <div>
              <label className={label}>Jaar</label>
              <input className={input + ' w-24'} type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10) || year)} />
            </div>
            <button onClick={doParse} className="self-end px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium">
              Verwerk notitie →
            </button>
          </div>
          {skipped && <p className="text-xs text-gray-400 mt-3">{skipped}</p>}
        </section>

        {/* Stap 3: Regels */}
        {linesVisible && (
          <section className={card}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">3 · Controleer de regels</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-2">Datum</th>
                    <th className="py-2 pr-2">Soort</th>
                    <th className="py-2 pr-2">Bedrag (€)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">
                        <input className={input} value={r.dateText} onChange={(e) => updateRow(r.id, { dateText: e.target.value })} placeholder="4-5-2026" />
                      </td>
                      <td className="py-2 pr-2">
                        <select className={input} value={r.type} onChange={(e) => updateRow(r.id, { type: e.target.value })}>
                          <option value="schoonmaak">Periodieke schoonmaak</option>
                          <option value="glasbewassing">Periodieke glasbewassing</option>
                        </select>
                      </td>
                      <td className="py-2 pr-2">
                        <input className={input + ' w-28'} type="number" step="0.01" value={r.amount} onChange={(e) => updateRow(r.id, { amount: e.target.value })} />
                      </td>
                      <td className="py-2">
                        <button onClick={() => removeRow(r.id)} className="text-gray-400 hover:text-red-500 text-xl leading-none" title="verwijder">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => addRow()} className="mt-3 text-sm text-sky-600 hover:underline">+ Regel toevoegen</button>

            <div className="mt-5 ml-auto w-full sm:w-72 text-sm">
              <div className="flex justify-between py-1"><span>Subtotaal</span><b>{money(totals.sub)}</b></div>
              <div className="flex justify-between py-1"><span>{totals.rate}% BTW</span><b>{money(totals.btw)}</b></div>
              <div className="flex justify-between py-2 px-3 bg-gray-200 rounded font-bold"><span>TOTAAL</span><span>{money(totals.total)}</span></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className={label}>Factuurnummer</label>
                <input className={input} value={invNumber} onChange={(e) => setInvNumber(e.target.value)} />
              </div>
              <div>
                <label className={label}>Factuurdatum</label>
                <input className={input} value={invDate} onChange={(e) => setInvDate(e.target.value)} placeholder="9-6-2026" />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>Betaaltermijn</label>
              <select className={input} value={payTerm} onChange={(e) => setPayTerm(e.target.value)}>
                <option value="30">30 dagen (zakelijk)</option>
                <option value="14">14 dagen (particulier)</option>
              </select>
            </div>

            <button onClick={makeInvoice} disabled={busy}
              className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50">
              {busy ? '⏳ bezig met PDF maken…' : 'Maak factuur (PDF)'}
            </button>
          </section>
        )}

        {/* Stap 4: Resultaat */}
        {result && (
          <section className={card}>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4 · Klaar!</h2>
            <p className="text-gray-700 mb-4">
              Factuur <b>{result.invoiceNumber}</b> voor <b>{lastCustomerName}</b> is gemaakt — totaal <b>{money(result.totals.total)}</b>.
            </p>
            {result.synced && (
              <p className="mb-4 -mt-2 text-sm text-green-700">
                ☁️ Ook opgeslagen in je sync-map — verschijnt vanzelf op je telefoon.
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-5">
              <a href={result.pdfUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium">📄 Open PDF</a>
              <button onClick={reveal} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium">📁 Toon in map</button>
              <button onClick={openMailto} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">✉️ Open in Mail</button>
              <button onClick={openGmail} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium">Gmail</button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Factuurbericht voor deze klant</p>
              <div className="mb-3">
                <label className={label}>Aan</label>
                <input className={input} value={mailTo} onChange={(e) => setMailTo(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className={label}>Onderwerp</label>
                <input className={input} value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className={label}>Bericht</label>
                <textarea className={input} rows={9} value={mailBody} onChange={(e) => setMailBody(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={copyMessage} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium">📋 Kopieer bericht</button>
                <button onClick={saveMessage} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium">💾 Bewaar dit bericht voor deze klant</button>
                {okMsg && <span className="text-green-600 font-semibold text-sm">{okMsg}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Dit bericht wordt onthouden per klant en verschijnt volgende keer automatisch (met het nieuwe
                factuurnummer, bedrag en betaaltermijn er al in). Sleep de PDF (knop &quot;Toon in map&quot;) erbij als bijlage.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
