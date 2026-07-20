// Glasbewassing: adressen met een frequentie, uitvoerhistorie en optioneel een
// handmatig geplande volgende afspraak. Client-veilig (geen server-code).

export interface GlasAdres {
  id: string;
  phone: string | null;
  address: string;
  every: number | null;
  unit: 'weken' | 'maanden';
  lastDone: string | null;
  plannedDate?: string | null;
  history: string[];
  note?: string;
}

export type GlasGroep = 'achterstallig' | 'dezeWeek' | 'volgende' | 'later' | 'inplannen';

const MONTHS: Record<string, number> = {
  jan: 1, januari: 1,
  feb: 2, februari: 2,
  mrt: 3, maart: 3, mar: 3,
  apr: 4, april: 4,
  mei: 5,
  jun: 6, juni: 6,
  jul: 7, juli: 7,
  aug: 8, augustus: 8,
  sep: 9, sept: 9, september: 9,
  okt: 10, oktober: 10, oct: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};
const MONTH_RE = 'januari|februari|maart|april|juni|juli|augustus|september|oktober|november|december|jan|feb|mrt|mar|apr|mei|jun|jul|aug|sept|sep|okt|oct|nov|dec';

export function glasSlug(s: string): string {
  return String(s || 'adres').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'adres';
}

function iso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function vandaagIso(d = new Date()): string {
  return iso(d);
}

export function vanIso(s: string): Date {
  const [y, m, d] = s.split('-').map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d);
}

export function formatNL(s: string | null | undefined): string {
  if (!s) return '—';
  const d = vanIso(s);
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

// Een handmatig geplande datum gaat voor op de berekende datum. Zo kan ook een
// nieuwe klant zonder uitvoerhistorie alvast worden ingepland.
export function volgendeKeer(a: GlasAdres): string | null {
  if (a.plannedDate) return a.plannedDate;
  if (!a.lastDone || !a.every) return null;
  const d = vanIso(a.lastDone);
  if (a.unit === 'weken') d.setDate(d.getDate() + a.every * 7);
  else d.setMonth(d.getMonth() + a.every);
  return iso(d);
}

function maandagVan(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dag = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dag);
  return x;
}

export function weekNummer(d: Date): number {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dag = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - dag);
  const start = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  return Math.ceil((((x.getTime() - start.getTime()) / 86400000) + 1) / 7);
}

export function groep(a: GlasAdres, vandaag: Date): GlasGroep {
  const next = volgendeKeer(a);
  if (!next) return 'inplannen';
  const maandag = maandagVan(vandaag);
  const dezeWeekEind = new Date(maandag); dezeWeekEind.setDate(maandag.getDate() + 6);
  const volgendeWeekEind = new Date(maandag); volgendeWeekEind.setDate(maandag.getDate() + 13);
  const d = vanIso(next);
  if (d < maandag) return 'achterstallig';
  if (d <= dezeWeekEind) return 'dezeWeek';
  if (d <= volgendeWeekEind) return 'volgende';
  return 'later';
}

export function frequentieTekst(a: Pick<GlasAdres, 'every' | 'unit'>): string {
  if (!a.every) return 'Frequentie ontbreekt';
  if (a.unit === 'maanden' && a.every === 12) return 'Jaarlijks';
  if (a.every === 1) return a.unit === 'weken' ? 'Iedere week' : 'Iedere maand';
  return `Iedere ${a.every} ${a.unit}`;
}

export interface GlasParseResult {
  items: GlasAdres[];
  skipped: string[];
}

function schoon(s: string): string {
  return s.replace(/[​-‏‪-‮⁦-⁩﻿]/g, '').replace(/ /g, ' ');
}

const PHONE_RE = /(?:\+31|0031)[\s\-]?6[\s\-]?(?:\d[\s\-]?){8}|06[\s\-]?(?:\d[\s\-]?){8}/;
const FREQ_RE = /(?:(?<!\d)(\d{1,2})\s*(?:x|keer)\s*)?(?:per\s+|elke\s+|om\s+de\s+)?(\d{1,2})?\s*(weken|week|maanden|maand|kwartaal|jaar)(?![a-z])/gi;
const DATE_SRC = '(?:^|[\\s,;:.€(])(\\d{1,2})\\s*(' + MONTH_RE + ')(?![a-z])(?:\\s*(\\d{4}))?';

function vindDatums(tekst: string, vandaag: Date): Date[] {
  const re = new RegExp(DATE_SRC, 'gi');
  const uit: Date[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(tekst)) !== null) {
    const dag = parseInt(m[1], 10);
    const maand = MONTHS[m[2].toLowerCase()];
    if (!maand || dag < 1 || dag > 31) continue;
    const jaar = m[3] ? parseInt(m[3], 10) : vandaag.getFullYear();
    let d = new Date(jaar, maand - 1, dag);
    if (!m[3] && d.getTime() > vandaag.getTime() + 7 * 86400000) d = new Date(jaar - 1, maand - 1, dag);
    uit.push(d);
  }
  return uit;
}

function schuif(vanaf: Date, every: number, unit: 'weken' | 'maanden', richting: -1 | 1): Date {
  const d = new Date(vanaf.getFullYear(), vanaf.getMonth(), vanaf.getDate());
  if (unit === 'weken') d.setDate(d.getDate() + richting * every * 7);
  else d.setMonth(d.getMonth() + richting * every);
  return d;
}

function opruimen(s: string): string {
  return s.replace(new RegExp(DATE_SRC, 'gi'), ' ').replace(/§[dv]w§/g, ' ')
    .replace(/\s+/g, ' ').replace(/^[\s,;:.\-–—€?]+|[\s,;:.\-–—€?]+$/g, '').trim();
}

interface FreqMatch { index: number; end: number; every: number; unit: 'weken' | 'maanden' }

function vindFrequenties(tekst: string): FreqMatch[] {
  const uit: FreqMatch[] = [];
  FREQ_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FREQ_RE.exec(tekst)) !== null) {
    let every = m[2] ? parseInt(m[2], 10) : 1;
    let unit: 'weken' | 'maanden' = 'maanden';
    const woord = m[3].toLowerCase();
    if (woord.startsWith('wek') || woord === 'week') unit = 'weken';
    else if (woord === 'kwartaal') every *= 3;
    else if (woord === 'jaar') every *= 12;
    uit.push({ index: m.index, end: m.index + m[0].length, every: Math.max(1, every), unit });
  }
  return uit;
}

function knippunt(tussen: string): number {
  const nl = tussen.lastIndexOf('\n');
  if (nl >= 0) return nl + 1;
  const punt = tussen.lastIndexOf('.');
  if (punt >= 0) return punt + 1;
  const re = new RegExp(DATE_SRC, 'gi');
  let laatste = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tussen)) !== null) laatste = m.index + m[0].length;
  return laatste >= 0 ? laatste : tussen.length;
}

export function parseGlasNotes(text: string, vandaag: Date): GlasParseResult {
  const items: GlasAdres[] = [];
  const skipped: string[] = [];
  const blokken: string[][] = [];
  let huidig: string[] = [];
  for (const raw of schoon(String(text || '')).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { if (huidig.length) { blokken.push(huidig); huidig = []; } continue; }
    if (PHONE_RE.test(line) && huidig.length) { blokken.push(huidig); huidig = []; }
    huidig.push(line);
  }
  if (huidig.length) blokken.push(huidig);

  const voegToe = (item: GlasAdres) => {
    const bestaand = items.find((x) => x.id === item.id);
    if (bestaand) {
      bestaand.history = Array.from(new Set([...bestaand.history, ...item.history])).sort();
      bestaand.lastDone = [bestaand.lastDone, item.lastDone].filter(Boolean).sort().pop() || null;
      if (item.every) { bestaand.every = item.every; bestaand.unit = item.unit; }
    } else items.push(item);
  };

  for (const blok of blokken) {
    let tekst = blok.join('\n');
    let phone: string | null = null;
    const pm = tekst.match(PHONE_RE);
    if (pm) { phone = pm[0].replace(/[\s\-]/g, ''); tekst = tekst.replace(pm[0], ' '); }
    tekst = tekst.replace(/deze\s+week/gi, '§dw§').replace(/volgende\s+week/gi, '§vw§');
    const freqs = vindFrequenties(tekst);
    const stukken: { van: number; tot: number; freq: FreqMatch | null }[] = [];
    if (freqs.length <= 1) stukken.push({ van: 0, tot: tekst.length, freq: freqs[0] || null });
    else {
      let van = 0;
      for (let k = 0; k < freqs.length; k++) {
        const eind = k + 1 < freqs.length ? freqs[k].end + knippunt(tekst.slice(freqs[k].end, freqs[k + 1].index)) : tekst.length;
        stukken.push({ van, tot: eind, freq: freqs[k] }); van = eind;
      }
    }

    let hoofdAdres = '';
    for (let k = 0; k < stukken.length; k++) {
      const st = stukken[k];
      const seg = tekst.slice(st.van, st.tot);
      const dezeWeek = /§dw§/.test(seg);
      const volgendeWeek = /§vw§/.test(seg);
      const datums = vindDatums(seg, vandaag).sort((a, b) => a.getTime() - b.getTime());
      const every = st.freq ? st.freq.every : null;
      const unit = st.freq ? st.freq.unit : 'maanden';
      let lastDone: string | null = datums.length ? iso(datums[datums.length - 1]) : null;
      const history = datums.map(iso);
      if ((dezeWeek || volgendeWeek) && every) {
        const doel = dezeWeek ? vandaag : schuif(vandaag, 1, 'weken', 1);
        lastDone = iso(schuif(doel, every, unit, -1));
        if (!history.includes(lastDone)) history.push(lastDone);
        history.sort();
      }

      if (k === 0) {
        let voorFreq = st.freq ? tekst.slice(st.van, st.freq.index) : seg;
        const naFreq = st.freq ? tekst.slice(st.freq.end, st.tot) : '';
        let prijs = '';
        voorFreq = voorFreq.replace(/€\s?\d\S*/g, (m) => { prijs = m.trim(); return ' '; });
        hoofdAdres = opruimen(voorFreq);
        if (!hoofdAdres) { skipped.push(blok.join(' | ')); break; }
        const note = [opruimen(naFreq), prijs].filter(Boolean).join(' · ');
        voegToe({ id: glasSlug(hoofdAdres), phone, address: hoofdAdres, every, unit, lastDone, plannedDate: null, history, note: note || undefined });
      } else {
        const zonderFreq = tekst.slice(st.van, st.freq!.index) + ' ' + tekst.slice(st.freq!.end, st.tot);
        const omschrijving = opruimen(zonderFreq) || 'extra';
        const address = `${hoofdAdres} — ${omschrijving}`;
        voegToe({ id: glasSlug(address), phone, address, every, unit, lastDone, plannedDate: null, history, note: undefined });
      }
    }
  }
  return { items, skipped };
}
