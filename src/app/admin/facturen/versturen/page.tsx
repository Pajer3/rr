'use client';

import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  Search,
  Send,
  Settings2,
} from 'lucide-react';
import FactuurNav from '../FactuurNav';
import {
  money, DEFAULT_MESSAGE, fillTemplate, templatize, buildSubject, buildVals,
} from '@/lib/factuur/message';
import type { Company, Customer, InvoiceLog, InvoiceStatus } from '@/lib/factuur/types';

type Filter = 'alles' | 'klaar' | 'verzonden' | 'betaald' | 'vervallen';

function parseInvoiceDate(value: string) {
  const parts = value.split(/[-/]/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [day, month, year] = parts;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dueDate(inv: InvoiceLog) {
  const date = parseInvoiceDate(inv.date);
  if (!date) return null;
  date.setDate(date.getDate() + (inv.paymentTermDays || 30));
  return date;
}

function isOverdue(inv: InvoiceLog) {
  const due = dueDate(inv);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inv.status !== 'betaald' && !!due && due < today;
}

function nlDate(date: Date | null) {
  return date?.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) || 'onbekend';
}

function timestamp(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function VersturenPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<InvoiceLog[]>([]);
  const [mailConfigured, setMailConfigured] = useState(false);
  const [fromEmail, setFromEmail] = useState('info@frisspits.nl');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('alles');

  useEffect(() => {
    (async () => {
      try {
        const responses = await Promise.all([
          fetch('/api/factuur/company'),
          fetch('/api/factuur/customers'),
          fetch('/api/factuur/invoices'),
          fetch('/api/factuur/mail-status'),
        ]);
        if (responses.some((response) => response.status === 401)) {
          router.push('/admin/facturen/login');
          return;
        }
        if (responses.some((response) => !response.ok)) throw new Error('De factuurgegevens konden niet worden geladen.');
        const [companyData, customerData, invoiceData, mailData] = await Promise.all(responses.map((r) => r.json()));
        setCompany(companyData);
        setCustomers(Array.isArray(customerData) ? customerData : []);
        setInvoices(Array.isArray(invoiceData) ? invoiceData.slice().reverse() : []);
        setMailConfigured(Boolean(mailData.configured));
        setFromEmail(mailData.fromEmail || companyData.email || 'info@frisspits.nl');
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Laden mislukt.');
      } finally {
        setLoaded(true);
      }
    })();
  }, [router]);

  const counts = useMemo(() => ({
    klaar: invoices.filter((inv) => !inv.status || inv.status === 'klaar').length,
    verzonden: invoices.filter((inv) => inv.status === 'verzonden').length,
    betaald: invoices.filter((inv) => inv.status === 'betaald').length,
    vervallen: invoices.filter(isOverdue).length,
  }), [invoices]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchesSearch = !needle || `${inv.number} ${inv.customer} ${inv.recipient || ''}`.toLowerCase().includes(needle);
      const status = inv.status || 'klaar';
      const matchesFilter = filter === 'alles' || (filter === 'vervallen' ? isOverdue(inv) : status === filter);
      return matchesSearch && matchesFilter;
    });
  }, [invoices, query, filter]);

  function replaceInvoice(updated: InvoiceLog) {
    setInvoices((current) => current.map((inv) => (inv.number === updated.number ? updated : inv)));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <FactuurNav />
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Factuurbeheer</p>
            <h1 className="text-3xl font-bold tracking-tight">Facturen versturen</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Controleer ontvanger, bericht en PDF voordat je verzendt. Houd daarna bij wat verstuurd en betaald is.</p>
          </div>
          <div className={`flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${mailConfigured ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            {mailConfigured ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <Settings2 className="mt-0.5 h-5 w-5 shrink-0" />}
            <div>
              <p className="font-semibold">{mailConfigured ? 'Automatisch verzenden actief' : 'Automatisch verzenden nog uit'}</p>
              <p className="mt-0.5 opacity-80">{mailConfigured ? `Afzender: ${fromEmail}` : 'Je kunt intussen gewoon iCloud Mail openen en handmatig versturen.'}</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Klaar om te sturen" value={counts.klaar} icon={<FileText />} tone="sky" />
          <Stat label="Verzonden" value={counts.verzonden} icon={<Send />} tone="indigo" />
          <Stat label="Betaald" value={counts.betaald} icon={<CheckCircle2 />} tone="emerald" />
          <Stat label="Vervallen" value={counts.vervallen} icon={<AlertCircle />} tone="rose" />
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op klant of factuurnummer" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {(['alles', 'klaar', 'verzonden', 'betaald', 'vervallen'] as Filter[]).map((value) => (
                <button key={value} onClick={() => setFilter(value)} className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition ${filter === value ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}{value !== 'alles' ? ` (${counts[value]})` : ''}
                </button>
              ))}
            </div>
          </div>
        </section>

        {error && <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"><AlertCircle className="h-5 w-5" />{error}</div>}
        {!loaded && <div className="mt-8 text-center text-slate-500">Facturen laden…</div>}
        {loaded && !error && visible.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            {invoices.length === 0 ? 'Er zijn nog geen facturen gemaakt.' : 'Geen facturen gevonden met deze selectie.'}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {visible.map((inv, index) => (
            <InvoiceCard
              key={inv.number}
              inv={inv}
              initiallyOpen={index === 0 && visible.length < 6}
              company={company}
              customers={customers}
              setCustomers={setCustomers}
              mailConfigured={mailConfigured}
              onUpdate={replaceInvoice}
              onLogin={() => router.push('/admin/facturen/login')}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

const toneClasses = {
  sky: 'bg-sky-50 text-sky-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  rose: 'bg-rose-50 text-rose-700',
};

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: ReactNode; tone: keyof typeof toneClasses }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl [&>svg]:h-4 [&>svg]:w-4 ${toneClasses[tone]}`}>{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
    </div>
  );
}

function statusMeta(inv: InvoiceLog) {
  if (inv.status === 'betaald') return { label: 'Betaald', classes: 'bg-emerald-100 text-emerald-800' };
  if (isOverdue(inv)) return { label: 'Vervallen', classes: 'bg-rose-100 text-rose-800' };
  if (inv.status === 'verzonden') return { label: 'Verzonden', classes: 'bg-indigo-100 text-indigo-800' };
  return { label: 'Klaar', classes: 'bg-sky-100 text-sky-800' };
}

function InvoiceCard({ inv, initiallyOpen, company, customers, setCustomers, mailConfigured, onUpdate, onLogin }: {
  inv: InvoiceLog;
  initiallyOpen: boolean;
  company: Partial<Company>;
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  mailConfigured: boolean;
  onUpdate: (invoice: InvoiceLog) => void;
  onLogin: () => void;
}) {
  const cust = customers.find((c) => c.name === inv.customer) || { name: inv.customer, email: '', type: 'zakelijk' } as Customer;
  const term = inv.paymentTermDays || (cust.type === 'particulier' ? 14 : 30);
  const vals = buildVals(company, cust, inv.number, inv.total, term);
  const [open, setOpen] = useState(initiallyOpen);
  const [to, setTo] = useState(inv.recipient || cust.email || '');
  const [subject, setSubject] = useState(buildSubject(company, inv.number));
  const [body, setBody] = useState(fillTemplate(cust.emailMessage || DEFAULT_MESSAGE, vals));
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const status = statusMeta(inv);

  function flash(message: string) {
    setNotice(message);
    setError('');
    window.setTimeout(() => setNotice(''), 2800);
  }

  async function reveal() {
    const response = await fetch('/api/factuur/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: inv.file }),
    });
    if (response.status === 401) onLogin();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      flash('Bericht gekopieerd');
    } catch {
      setError('Kopiëren lukte niet. Selecteer het bericht handmatig.');
    }
  }

  async function saveMessage() {
    setBusy(true);
    const template = templatize(body, vals);
    const response = await fetch('/api/factuur/customer-message', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: inv.customer, message: template }),
    });
    setBusy(false);
    if (response.status === 401) { onLogin(); return; }
    if (!response.ok) { setError('Het klantbericht kon niet worden bewaard.'); return; }
    setCustomers((current) => {
      const exists = current.some((customer) => customer.name === inv.customer);
      if (exists) return current.map((customer) => customer.name === inv.customer ? { ...customer, emailMessage: template } : customer);
      return [...current, { name: inv.customer, emailMessage: template }];
    });
    flash('Bericht voor deze klant bewaard');
  }

  function openMail() {
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    reveal();
  }

  async function sendNow() {
    setError('');
    if (!to.trim() || !subject.trim() || !body.trim()) { setError('Vul ontvanger, onderwerp en bericht volledig in.'); return; }
    if (!window.confirm(`Factuur ${inv.number} met PDF nu versturen naar ${to}?`)) return;
    setBusy(true);
    const response = await fetch('/api/factuur/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: inv.number, to, subject, message: body }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.status === 401) { onLogin(); return; }
    if (!response.ok) { setError(data.error || 'Verzenden mislukt.'); return; }
    onUpdate(data.invoice);
    flash(`Factuur verstuurd naar ${to}`);
  }

  async function setStatus(next: InvoiceStatus) {
    setBusy(true);
    const response = await fetch('/api/factuur/invoice-status', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number: inv.number, status: next }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (response.status === 401) { onLogin(); return; }
    if (!response.ok) { setError(data.error || 'Status aanpassen mislukt.'); return; }
    onUpdate(data.invoice);
    flash(next === 'betaald' ? 'Gemarkeerd als betaald' : next === 'verzonden' ? 'Gemarkeerd als verzonden' : 'Status teruggezet');
  }

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-50';
  const secondary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50';

  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${open ? 'border-sky-200 shadow-md' : 'border-slate-200'}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 sm:px-5">
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-sky-700">{inv.number}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.classes}`}>{status.label}</span>
          </div>
          <p className="mt-1 truncate font-semibold text-slate-900 sm:mt-0">{inv.customer}</p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-semibold">{money(inv.total)}</p>
          <p className="text-xs text-slate-500">Vervalt {nlDate(dueDate(inv))}</p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          <div className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
            <div><span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Factuurdatum</span><span className="mt-1 block font-medium text-slate-800">{inv.date}</span></div>
            <div><span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Betaaltermijn</span><span className="mt-1 block font-medium text-slate-800">{term} dagen · {nlDate(dueDate(inv))}</span></div>
            <div><span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Laatste actie</span><span className="mt-1 block font-medium text-slate-800">{inv.paidAt ? `Betaald ${timestamp(inv.paidAt)}` : inv.sentAt ? `Verstuurd ${timestamp(inv.sentAt)}` : 'Nog niet verstuurd'}</span></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_230px]">
            <div className="grid gap-3">
              <label className="text-sm font-semibold text-slate-700">Aan<input type="email" className={`${input} mt-1.5`} value={to} onChange={(e) => setTo(e.target.value)} placeholder="klant@voorbeeld.nl" /></label>
              <label className="text-sm font-semibold text-slate-700">Onderwerp<input className={`${input} mt-1.5`} value={subject} onChange={(e) => setSubject(e.target.value)} /></label>
              <label className="text-sm font-semibold text-slate-700">Bericht<textarea className={`${input} mt-1.5 min-h-56 resize-y leading-relaxed`} value={body} onChange={(e) => setBody(e.target.value)} /></label>
            </div>
            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-sky-600" /> Bijlage</div>
              <p className="mt-2 break-all text-xs text-slate-500">{inv.file}</p>
              <a href={`/api/factuur/pdf?file=${encodeURIComponent(inv.file)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ExternalLink className="h-4 w-4" /> PDF controleren</a>
              <div className="my-4 h-px bg-slate-200" />
              <p className="text-xs leading-relaxed text-slate-500">Controleer altijd eerst de PDF en het e-mailadres. Automatisch verzenden voegt deze PDF zelf toe.</p>
            </aside>
          </div>

          {error && <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
          {notice && <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700"><Check className="h-4 w-4" />{notice}</div>}

          <div className="mt-5 flex flex-wrap gap-2">
            {mailConfigured ? (
              <button disabled={busy} onClick={sendNow} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60"><Send className="h-4 w-4" />{busy ? 'Bezig…' : 'PDF en factuur versturen'}</button>
            ) : (
              <button disabled={busy} onClick={openMail} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"><Mail className="h-4 w-4" />Open in iCloud Mail</button>
            )}
            <button disabled={busy} onClick={copy} className={secondary}><Copy className="h-4 w-4" />Kopieer bericht</button>
            <button disabled={busy} onClick={saveMessage} className={secondary}>Bericht bewaren</button>
            <button disabled={busy} onClick={reveal} className={secondary}>Toon PDF in map</button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-slate-400">Status</span>
            {inv.status !== 'betaald' && <button disabled={busy} onClick={() => setStatus('betaald')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-200"><CheckCircle2 className="h-4 w-4" />Markeer betaald</button>}
            {(!inv.status || inv.status === 'klaar') && <button disabled={busy} onClick={() => setStatus('verzonden')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-200"><Clock3 className="h-4 w-4" />Handmatig als verzonden markeren</button>}
            {(inv.status === 'verzonden' || inv.status === 'betaald') && <button disabled={busy} onClick={() => setStatus('klaar')} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Status terugzetten</button>}
          </div>
        </div>
      )}
    </article>
  );
}
