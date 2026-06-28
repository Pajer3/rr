'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FactuurNav from '../FactuurNav';
import {
  money, DEFAULT_MESSAGE, fillTemplate, templatize, buildSubject, buildVals,
} from '@/lib/factuur/message';
import type { Company, Customer, InvoiceLog } from '@/lib/factuur/types';

export default function VersturenPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<InvoiceLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await fetch('/api/factuur/company');
      if (c.status === 401) { router.push('/admin/facturen/login'); return; }
      setCompany(await c.json());
      setCustomers(await (await fetch('/api/factuur/customers')).json());
      setInvoices(await (await fetch('/api/factuur/invoices')).json());
      setLoaded(true);
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Facturen versturen</h1>
        <p className="text-gray-500 mb-6">Open een factuur om het kant-en-klare bericht te zien en te versturen.</p>

        {loaded && invoices.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-500">
            Er zijn nog geen facturen gemaakt.
          </div>
        )}

        <div className="space-y-4">
          {invoices.map((inv, i) => (
            <InvoiceCard key={inv.number} inv={inv} index={i} company={company}
              customers={customers} setCustomers={setCustomers} onLogin={() => router.push('/admin/facturen/login')} />
          ))}
        </div>
      </main>
    </div>
  );
}

function InvoiceCard({ inv, index, company, customers, setCustomers, onLogin }: {
  inv: InvoiceLog;
  index: number;
  company: Partial<Company>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  onLogin: () => void;
}) {
  const cust = customers.find((c) => c.name === inv.customer) || { name: inv.customer, email: '', type: 'zakelijk' } as Customer;
  const term = inv.paymentTermDays || (cust.type === 'particulier' ? 14 : 30);
  const vals = buildVals(company, cust, inv.number, inv.total, term);

  const [open, setOpen] = useState(index === 0);
  const [to, setTo] = useState(cust.email || '');
  const [subject, setSubject] = useState(buildSubject(company, inv.number));
  const [body, setBody] = useState(fillTemplate(cust.emailMessage || DEFAULT_MESSAGE, vals));
  const [ok, setOk] = useState('');

  function flash(m: string) { setOk(m); setTimeout(() => setOk(''), 2600); }

  async function reveal() {
    await fetch('/api/factuur/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: inv.file }),
    });
  }
  async function copy() {
    try { await navigator.clipboard.writeText(body); } catch { /* */ }
    flash('✓ Gekopieerd');
  }
  async function save() {
    const template = templatize(body, vals);
    const res = await fetch('/api/factuur/customer-message', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inv.customer, message: template }),
    });
    if (res.status === 401) { onLogin(); return; }
    if (res.ok) {
      setCustomers((prev) => {
        const c = prev.find((x) => x.name === inv.customer);
        if (c) return prev.map((x) => (x.name === inv.customer ? { ...x, emailMessage: template } : x));
        return [...prev, { name: inv.customer, emailMessage: template }];
      });
      flash('✓ Bewaard');
    }
  }
  function mailto() {
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    reveal();
  }
  function gmail() {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    reveal();
  }

  const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400';
  const ghost = 'px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium';

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50">
        <span className="font-mono text-sm font-semibold text-sky-700">{inv.number}</span>
        <span className="font-medium text-gray-800">{inv.customer}</span>
        <span className="ml-auto text-sm text-gray-400">{inv.date} · {money(inv.total)} · {term} dgn</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="grid gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aan</label>
              <input className={input} value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Onderwerp</label>
              <input className={input} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
              <textarea className={input} rows={9} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <a href={`/api/factuur/pdf?file=${encodeURIComponent(inv.file)}`} target="_blank" rel="noreferrer" className={ghost}>📄 Open PDF</a>
            <button onClick={reveal} className={ghost}>📁 Toon in map</button>
            <button onClick={copy} className={ghost}>📋 Kopieer bericht</button>
            <button onClick={save} className={ghost}>💾 Bewaar bericht voor deze klant</button>
            <button onClick={mailto} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">✉️ Open in Mail</button>
            <button onClick={gmail} className={ghost}>Gmail</button>
            {ok && <span className="text-green-600 font-semibold text-sm">{ok}</span>}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Het bewaarde bericht geldt voor deze klant. Bij een volgende factuur veranderen alleen het
            factuurnummer, het bedrag en de betaaltermijn automatisch mee.
          </p>
        </div>
      )}
    </section>
  );
}
