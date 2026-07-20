'use client';

import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, CalendarDays, Check, ChevronDown, ChevronUp, Clock3,
  Edit3, Phone, Plus, Search, Trash2, Upload, Users, X,
} from 'lucide-react';
import FactuurNav from '../FactuurNav';
import {
  formatNL, frequentieTekst, groep, parseGlasNotes, vandaagIso, vanIso,
  volgendeKeer, weekNummer, type GlasAdres, type GlasGroep,
} from '@/lib/factuur/glas';

type SetLijst = Dispatch<SetStateAction<GlasAdres[]>>;

const input = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';
const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const panel = 'rounded-2xl border border-slate-200 bg-white shadow-sm';
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50';
const secondary = 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

async function json<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || 'Er ging iets mis.');
  return data as T;
}

export default function GlasbewassingPage() {
  const router = useRouter();
  const [lijst, setLijst] = useState<GlasAdres[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const vandaag = useMemo(() => new Date(), []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/factuur/glas', { cache: 'no-store' });
        if (response.status === 401) { router.push('/admin/facturen/login'); return; }
        setLijst(await json<GlasAdres[]>(response));
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'De planning kon niet worden geladen.');
      } finally {
        setLoaded(true);
      }
    })();
  }, [router]);

  const gefilterd = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('nl-NL');
    if (!needle) return lijst;
    return lijst.filter((item) => [item.address, item.phone, item.note, frequentieTekst(item)]
      .filter(Boolean).join(' ').toLocaleLowerCase('nl-NL').includes(needle));
  }, [lijst, query]);

  const groepen = useMemo(() => {
    const result: Record<GlasGroep, GlasAdres[]> = {
      achterstallig: [], dezeWeek: [], volgende: [], later: [], inplannen: [],
    };
    for (const item of gefilterd) result[groep(item, vandaag)].push(item);
    for (const values of Object.values(result)) {
      values.sort((a, b) => {
        const byDate = (volgendeKeer(a) || '9999').localeCompare(volgendeKeer(b) || '9999');
        return byDate || a.address.localeCompare(b.address, 'nl');
      });
    }
    return result;
  }, [gefilterd, vandaag]);

  const week = weekNummer(vandaag);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <FactuurNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-sky-700">Planning · week {week}</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Glasbewassing</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Plan eerste afspraken, houd uitvoeringen bij en zie direct wat aandacht nodig heeft.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={secondary} onClick={() => setImportOpen((value) => !value)}>
              <Upload className="h-4 w-4" /> Notitie importeren
            </button>
            <button className={primary} onClick={() => setNewOpen(true)}>
              <Plus className="h-4 w-4" /> Adres toevoegen
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Achterstallig" value={groepen.achterstallig.length} icon={<AlertTriangle />} tone="red" />
          <Stat label="Deze week" value={groepen.dezeWeek.length} icon={<CalendarDays />} tone="sky" />
          <Stat label="Volgende week" value={groepen.volgende.length} icon={<Clock3 />} tone="violet" />
          <Stat label="Eerste afspraak" value={groepen.inplannen.length} icon={<Users />} tone="amber" />
        </div>

        <div className={`${panel} mb-6 p-3`}>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={`${input} pl-10`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Zoek op adres, telefoon, notitie of frequentie"
            />
          </label>
        </div>

        {loadError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>
        )}
        {!loaded && <Loading />}

        {loaded && !loadError && (
          <div className="space-y-5">
            {newOpen && <NieuwAdres setLijst={setLijst} onClose={() => setNewOpen(false)} />}
            {importOpen && <Importeren setLijst={setLijst} vandaag={vandaag} onClose={() => setImportOpen(false)} />}

            <PlanningGroep
              title="Achterstallig" description="Deze afspraken zijn voorbij de berekende of handmatig geplande datum."
              items={groepen.achterstallig} setLijst={setLijst} vandaag={vandaag} tone="red"
            />
            <PlanningGroep
              title={`Deze week · week ${week}`} description="De adressen die nu aan de beurt zijn."
              items={groepen.dezeWeek} setLijst={setLijst} vandaag={vandaag} tone="sky"
            />
            <PlanningGroep
              title="Volgende week" description="Alvast klaarzetten voor de komende week."
              items={groepen.volgende} setLijst={setLijst} vandaag={vandaag} tone="violet"
            />
            <PlanningGroep
              title="Eerste afspraak inplannen"
              description="Nieuwe klanten zonder uitvoerdatum. Kies bij Bewerken een geplande datum zodra die bekend is."
              items={groepen.inplannen} setLijst={setLijst} vandaag={vandaag} tone="amber"
            />
            <PlanningGroep
              title="Later gepland" description="Alle overige terugkerende adressen."
              items={groepen.later} setLijst={setLijst} vandaag={vandaag} tone="slate" defaultOpen={false}
            />

            {gefilterd.length === 0 && (
              <div className={`${panel} p-10 text-center`}>
                <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="font-semibold text-slate-700">Geen adressen gevonden</p>
                <p className="mt-1 text-sm text-slate-500">Pas je zoekopdracht aan.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label: text, value, icon, tone }: {
  label: string; value: number; icon: ReactNode; tone: 'red' | 'sky' | 'violet' | 'amber';
}) {
  const colors = {
    red: 'bg-red-50 text-red-700 border-red-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${colors}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">{text}</span>
        <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
      <strong className="text-3xl font-bold tabular-nums">{value}</strong>
    </div>
  );
}

function PlanningGroep({ title, description, items, setLijst, vandaag, tone, defaultOpen = true }: {
  title: string; description: string; items: GlasAdres[]; setLijst: SetLijst; vandaag: Date;
  tone: 'red' | 'sky' | 'violet' | 'amber' | 'slate'; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const dot = { red: 'bg-red-500', sky: 'bg-sky-500', violet: 'bg-violet-500', amber: 'bg-amber-500', slate: 'bg-slate-400' }[tone];
  return (
    <section className={panel}>
      <button className="flex w-full items-start gap-3 p-5 text-left sm:items-center" onClick={() => setOpen((value) => !value)}>
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full sm:mt-0 ${dot}`} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">{title}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{items.length}</span>
          </span>
          <span className="mt-1 block text-sm text-slate-500">{description}</span>
        </span>
        {open ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>
      {open && (
        <div className="border-t border-slate-100 p-3 sm:p-5">
          {items.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-400">Geen adressen in deze groep.</p>
          ) : (
            <div className="space-y-3">{items.map((item) => (
              <AdresKaart key={item.id} adres={item} setLijst={setLijst} vandaag={vandaag} />
            ))}</div>
          )}
        </div>
      )}
    </section>
  );
}

function AdresKaart({ adres, setLijst, vandaag }: { adres: GlasAdres; setLijst: SetLijst; vandaag: Date }) {
  const [edit, setEdit] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState(adres.phone || '');
  const [address, setAddress] = useState(adres.address);
  const [every, setEvery] = useState(adres.every == null ? '' : String(adres.every));
  const [unit, setUnit] = useState<'weken' | 'maanden'>(adres.unit || 'maanden');
  const [lastDone, setLastDone] = useState(adres.lastDone || '');
  const [plannedDate, setPlannedDate] = useState(adres.plannedDate || '');
  const [note, setNote] = useState(adres.note || '');
  const [doneDate, setDoneDate] = useState(vandaagIso());
  const next = volgendeKeer(adres);
  const overdue = next ? vanIso(next) < new Date(vandaag.getFullYear(), vandaag.getMonth(), vandaag.getDate()) : false;

  function reset() {
    setPhone(adres.phone || ''); setAddress(adres.address);
    setEvery(adres.every == null ? '' : String(adres.every)); setUnit(adres.unit || 'maanden');
    setLastDone(adres.lastDone || ''); setPlannedDate(adres.plannedDate || ''); setNote(adres.note || '');
    setError('');
  }

  async function save() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/factuur/glas-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalId: adres.id, item: { phone, address, every, unit, lastDone, plannedDate, note } }),
      });
      const data = await json<{ item: GlasAdres }>(response);
      setLijst((current) => current.map((item) => item.id === adres.id ? data.item : item));
      setEdit(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Opslaan mislukt.'); }
    finally { setBusy(false); }
  }

  async function markDone() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/factuur/glas-done', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adres.id, date: doneDate }),
      });
      const data = await json<{ item: GlasAdres }>(response);
      setLijst((current) => current.map((item) => item.id === adres.id ? data.item : item));
      setLastDone(data.item.lastDone || ''); setPlannedDate(''); setDoneOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : 'Uitvoering opslaan mislukt.'); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm(`Verwijder “${adres.address}” definitief uit de planning?`)) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/factuur/glas-delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: adres.id }),
      });
      await json(response);
      setLijst((current) => current.filter((item) => item.id !== adres.id));
    } catch (e) { setError(e instanceof Error ? e.message : 'Verwijderen mislukt.'); }
    finally { setBusy(false); }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{adres.address}</h3>
              {adres.note && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">{adres.note}</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{frequentieTekst(adres)}</span>
              <span>Laatst: {formatNL(adres.lastDone)}</span>
              {adres.phone && <a className="inline-flex items-center gap-1 hover:text-sky-700" href={`tel:${adres.phone}`}><Phone className="h-3.5 w-3.5" />{adres.phone}</a>}
            </div>
            <p className={`mt-2 text-sm font-semibold ${overdue ? 'text-red-700' : next ? 'text-slate-700' : 'text-amber-700'}`}>
              {next ? `${adres.plannedDate ? 'Handmatig gepland' : 'Volgende beurt'}: ${formatNL(next)} · week ${weekNummer(vanIso(next))}` : 'Eerste afspraak nog niet ingepland'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={secondary} onClick={() => { reset(); setEdit((value) => !value); setDoneOpen(false); }}>
              <Edit3 className="h-4 w-4" /> Bewerken
            </button>
            <button className={primary} onClick={() => { setDoneOpen((value) => !value); setEdit(false); }}>
              <Check className="h-4 w-4" /> Uitgevoerd
            </button>
          </div>
        </div>

        {doneOpen && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-end">
            <div className="flex-1"><label className={label}>Uitvoerdatum</label><input className={input} type="date" value={doneDate} onChange={(e) => setDoneDate(e.target.value)} /></div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50" disabled={busy || !doneDate} onClick={markDone}><Check className="h-4 w-4" /> Bevestigen</button>
            <button className={secondary} onClick={() => setDoneOpen(false)}>Annuleren</button>
          </div>
        )}
      </div>

      {edit && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={label}>Adres</label><input className={input} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
            <div><label className={label}>Telefoonnummer</label><input className={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06…" /></div>
            <div><label className={label}>Frequentie</label><input className={input} type="number" min="1" max="120" value={every} onChange={(e) => setEvery(e.target.value)} placeholder="Bijv. 2" /></div>
            <div><label className={label}>Eenheid</label><select className={input} value={unit} onChange={(e) => setUnit(e.target.value as 'weken' | 'maanden')}><option value="weken">weken</option><option value="maanden">maanden</option></select></div>
            <div><label className={label}>Laatst uitgevoerd</label><input className={input} type="date" value={lastDone} onChange={(e) => setLastDone(e.target.value)} /></div>
            <div><label className={label}>Geplande datum</label><input className={input} type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} /><p className="mt-1 text-xs text-slate-500">Overschrijft tijdelijk de berekende volgende beurt.</p></div>
            <div className="sm:col-span-2"><label className={label}>Notitie</label><textarea className={input} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Prijs, toegang, vakantie of andere bijzonderheden" /></div>
          </div>
          {adres.history?.length > 0 && <p className="mt-4 text-xs text-slate-500"><strong>Historie:</strong> {adres.history.slice().reverse().map(formatNL).join(' · ')}</p>}
          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button className={primary} disabled={busy || !address.trim()} onClick={save}>{busy ? 'Opslaan…' : 'Wijzigingen opslaan'}</button>
            <button className={secondary} onClick={() => { reset(); setEdit(false); }}><X className="h-4 w-4" /> Annuleren</button>
            <button className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" disabled={busy} onClick={remove}><Trash2 className="h-4 w-4" /> Verwijderen</button>
          </div>
        </div>
      )}
      {!edit && error && <p className="mx-4 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </article>
  );
}

function NieuwAdres({ setLijst, onClose }: { setLijst: SetLijst; onClose: () => void }) {
  const [form, setForm] = useState({ address: '', phone: '', every: '', unit: 'maanden', lastDone: '', plannedDate: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function save() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/factuur/glas-save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ item: form }) });
      const data = await json<{ item: GlasAdres }>(response);
      setLijst((current) => [...current, data.item]); onClose();
    } catch (e) { setError(e instanceof Error ? e.message : 'Toevoegen mislukt.'); }
    finally { setBusy(false); }
  }
  return (
    <section className={`${panel} border-sky-200 p-5 sm:p-6`}>
      <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">Nieuw adres</h2><p className="mt-1 text-sm text-slate-500">Een datum mag leeg blijven; het adres komt dan bij Eerste afspraak inplannen.</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose}><X className="h-5 w-5" /></button></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2"><label className={label}>Adres</label><input className={input} value={form.address} onChange={(e) => update('address', e.target.value)} /></div>
        <div><label className={label}>Telefoonnummer</label><input className={input} type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
        <div><label className={label}>Frequentie</label><input className={input} type="number" min="1" value={form.every} onChange={(e) => update('every', e.target.value)} placeholder="Bijv. 2" /></div>
        <div><label className={label}>Eenheid</label><select className={input} value={form.unit} onChange={(e) => update('unit', e.target.value)}><option value="weken">weken</option><option value="maanden">maanden</option></select></div>
        <div><label className={label}>Eerste afspraak</label><input className={input} type="date" value={form.plannedDate} onChange={(e) => update('plannedDate', e.target.value)} /></div>
        <div className="sm:col-span-2 lg:col-span-3"><label className={label}>Notitie</label><input className={input} value={form.note} onChange={(e) => update('note', e.target.value)} /></div>
      </div>
      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 flex gap-2"><button className={primary} disabled={busy || !form.address.trim()} onClick={save}>{busy ? 'Toevoegen…' : 'Adres toevoegen'}</button><button className={secondary} onClick={onClose}>Annuleren</button></div>
    </section>
  );
}

function Importeren({ setLijst, vandaag, onClose }: { setLijst: SetLijst; vandaag: Date; onClose: () => void }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<GlasAdres[] | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  function parse() { const result = parseGlasNotes(text, vandaag); setPreview(result.items); setSkipped(result.skipped); setMessage(''); setError(''); }
  async function add() {
    if (!preview?.length) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/factuur/glas-import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: preview }) });
      const data = await json<{ nieuw: number; bijgewerkt: number }>(response);
      setLijst(await json<GlasAdres[]>(await fetch('/api/factuur/glas', { cache: 'no-store' })));
      setMessage(`${data.nieuw} nieuw toegevoegd, ${data.bijgewerkt} bijgewerkt.`); setText(''); setPreview(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Importeren mislukt.'); }
    finally { setBusy(false); }
  }
  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <div className="mb-4 flex items-start justify-between"><div><h2 className="text-lg font-bold">Notitie importeren</h2><p className="mt-1 text-sm text-slate-500">Plak je bestaande notitie en controleer de gevonden adressen vóór het toevoegen.</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={onClose}><X className="h-5 w-5" /></button></div>
      <textarea className={input} rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={'0612345678 Wieringermeerpolder 4 1x per maand 3 juli\n\n0687654321 Weteringkade 240 1x per 2 maanden'} />
      <div className="mt-3 flex flex-wrap items-center gap-2"><button className={primary} disabled={!text.trim()} onClick={parse}>Notitie controleren</button>{message && <span className="text-sm font-semibold text-emerald-700">{message}</span>}</div>
      {preview && <div className="mt-5 overflow-hidden rounded-xl border border-slate-200"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Adres</th><th className="px-3 py-2">Frequentie</th><th className="px-3 py-2">Laatst gedaan</th></tr></thead><tbody>{preview.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-3 py-2 font-medium">{item.address}</td><td className="px-3 py-2">{frequentieTekst(item)}</td><td className="px-3 py-2">{formatNL(item.lastDone)}</td></tr>)}</tbody></table></div><div className="border-t border-slate-200 p-3"><button className={primary} disabled={busy || preview.length === 0} onClick={add}>{busy ? 'Importeren…' : `${preview.length} adressen toevoegen`}</button></div></div>}
      {skipped.length > 0 && <p className="mt-3 text-xs text-amber-700">Niet herkend: {skipped.join(' · ')}</p>}
      {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </section>
  );
}

function Loading() {
  return <div className="space-y-4">{[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div>;
}
