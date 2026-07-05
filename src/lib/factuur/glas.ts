// Glasbewassing: adressen met een frequentie (bijv. 1x per 2 maanden) en de
// datum waarop het voor het laatst gedaan is. Hieruit rekenen we uit in welke
// week een adres weer aan de beurt is. Client-veilig (geen server-code).

export interface GlasAdres {
  id: string;
  nr: number | null;          // het eigen nummer uit de notitie
  address: string;
  every: number | null;       // om de hoeveel (bijv. 2)
  unit: 'weken' | 'maanden';  // ...weken of maanden
  lastDone: string | null;    // 'YYYY-MM-DD'
  history: string[];          // eerdere uitvoerdatums
  note?: string;
}

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

// --- datums ---
function iso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function vanIso(s: string): Date {
  const [y, m, d] = s.split('-').map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d);
}
export function formatNL(s: string | null): string {
  if (!s) return '—';
  const d = vanIso(s);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

// Volgende keer = laatst gedaan + frequentie.
export function volgendeKeer(a: GlasAdres): string | null {
  if (!a.lastDone || !a.every) return null;
  const d = vanIso(a.lastDone);
  if (a.unit === 'weken') d.setDate(d.getDate() + a.every * 7);
  else d.setMonth(d.getMonth() + a.every);
  return iso(d);
}

// Maandag van de week waar een datum in valt.
function maandagVan(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dag = (x.getDay() + 6) % 7; // ma=0 ... zo=6
  x.setDate(x.getDate() - dag);
  return x;
}

// ISO-weeknummer (zoals op kalenders).
export function weekNummer(d: Date): number {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dag = x.getUTCDay() || 7;
  x.setUTCDate(x.getUTCDate() + 4 - dag);
  const start = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  return Math.ceil((((x.getTime() - start.getTime()) / 86400000) + 1) / 7);
}

// In welke groep valt dit adres, gerekend vanaf vandaag?
//  'nu'       = deze week aan de beurt of te laat
//  'volgende' = volgende week
//  'later'    = daarna
//  'onbekend' = frequentie of laatste datum ontbreekt
export function groep(a: GlasAdres, vandaag: Date): 'nu' | 'volgende' | 'later' | 'onbekend' {
  const next = volgendeKeer(a);
  if (!next) return 'onbekend';
  const maandag = maandagVan(vandaag);
  const dezeWeekEind = new Date(maandag); dezeWeekEind.setDate(maandag.getDate() + 6);
  const volgendeWeekEind = new Date(maandag); volgendeWeekEind.setDate(maandag.getDate() + 13);
  const d = vanIso(next);
  if (d <= dezeWeekEind) return 'nu';
  if (d <= volgendeWeekEind) return 'volgende';
  return 'later';
}

export function frequentieTekst(a: GlasAdres): string {
  if (!a.every) return 'geen frequentie';
  if (a.every === 1) return a.unit === 'weken' ? '1x per week' : '1x per maand';
  return `1x per ${a.every} ${a.unit}`;
}

// --- notitie inlezen ---
export interface GlasParseResult {
  items: GlasAdres[];
  skipped: string[];
}

// Leest regels zoals:
//   "7 Nijverheidsweg Noord 130-13 Amersfoort 1x 2 maanden 13 mei"
//   "12 Vleessteeg 1 Putten 1x per maand 4 april 2 juni"
// nummer + adres + frequentie + (laatste) uitvoerdatum.
export function parseGlasNotes(text: string, vandaag: Date): GlasParseResult {
  const items: GlasAdres[] = [];
  const skipped: string[] = [];

  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\d+\s*#$/.test(line)) { skipped.push(line); continue; }

    // eigen nummer aan het begin (optioneel)
    let rest = line;
    let nr: number | null = null;
    const nrM = rest.match(/^\s*(\d{1,4})\s*[-.:]?\s+(?=\D)/);
    if (nrM) { nr = parseInt(nrM[1], 10); rest = rest.slice(nrM[0].length); }

    // frequentie: "1x 2 maanden", "1x per maand", "elke 6 weken", "om de 2 maanden"
    const freqRe = /(?:(\d+)\s*x\s*)?(?:per\s+|elke\s+|om\s+de\s+)?(\d+)?\s*(weken|week|maanden|maand)(?![a-z])/i;
    const freqM = rest.match(freqRe);
    let every: number | null = null;
    let unit: 'weken' | 'maanden' = 'maanden';
    if (freqM) {
      every = freqM[2] ? parseInt(freqM[2], 10) : 1;
      // let op: "weken" bevat het woord "week" niet (w-e-k-e-n), dus op "wek" toetsen
      unit = /^wek|^week/i.test(freqM[3]) ? 'weken' : 'maanden';
    }

    // datums: "13 mei", "4 april 2026" (kan er meerdere hebben; de laatste telt)
    const dateRe = new RegExp('(?:^|[\\s,;])(\\d{1,2})\\s+(' + MONTH_RE + ')(?![a-z])(?:\\s+(\\d{4}))?', 'gi');
    const dates: Date[] = [];
    let dm: RegExpExecArray | null;
    while ((dm = dateRe.exec(rest)) !== null) {
      const dag = parseInt(dm[1], 10);
      const maand = MONTHS[dm[2].toLowerCase()];
      if (!maand || dag < 1 || dag > 31) continue;
      let jaar = dm[3] ? parseInt(dm[3], 10) : vandaag.getFullYear();
      let d = new Date(jaar, maand - 1, dag);
      // een uitvoerdatum ligt niet in de toekomst: dan was het vorig jaar
      if (!dm[3] && d.getTime() > vandaag.getTime() + 7 * 86400000) {
        d = new Date(jaar - 1, maand - 1, dag);
      }
      dates.push(d);
    }

    // adres = het stuk vóór de frequentie (of vóór de eerste datum)
    let adresEind = rest.length;
    if (freqM && freqM.index != null) adresEind = Math.min(adresEind, freqM.index);
    const firstDate = rest.search(new RegExp('(?:^|[\\s,;])\\d{1,2}\\s+(?:' + MONTH_RE + ')(?![a-z])', 'i'));
    if (firstDate >= 0) adresEind = Math.min(adresEind, firstDate);
    const address = rest.slice(0, adresEind).replace(/[\s,;\-–]+$/, '').trim();

    if (!address) { skipped.push(line); continue; }

    dates.sort((a, b) => a.getTime() - b.getTime());
    const lastDone = dates.length ? iso(dates[dates.length - 1]) : null;

    items.push({
      id: glasSlug((nr != null ? nr + '-' : '') + address),
      nr,
      address,
      every,
      unit,
      lastDone,
      history: dates.map(iso),
    });
  }

  return { items, skipped };
}
