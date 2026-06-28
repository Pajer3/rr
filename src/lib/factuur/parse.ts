import type { InvoiceItem } from './types';

// Zet de notitietekst van Joshua om in factuurregels.
// Voorbeeldregels die het herkent:
//   €145 glasbewassing kantoor 13 mei
//   €76 kantoor 4 mei
//   76 schoonmaak 1 juni
// Regels zonder bedrag (zoals "7-Taxi Boute" of "507#") worden overgeslagen.

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

// "13 mei" -> {day, month}
function findDate(line: string): { day: number; month: number } | null {
  const re = /(\d{1,2})\s*(?:e|de|ste)?\s+([a-z]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const day = parseInt(m[1], 10);
    const monthName = m[2].toLowerCase();
    if (MONTHS[monthName] && day >= 1 && day <= 31) {
      return { day, month: MONTHS[monthName] };
    }
  }
  return null;
}

// "€145" / "145,50" / "76 kantoor" -> 145
function findAmount(line: string): number | null {
  // 1) bedrag achter een € (meest betrouwbaar)
  let m = line.match(/€\s*([0-9]+(?:[.,][0-9]{1,2})?)/);
  // 2) anders een getal aan het begin, MAAR alleen als er een spatie achter staat
  //    ("76 kantoor" telt; "7-Taxi Boute" telt NIET)
  if (!m) m = line.match(/^\s*([0-9]+(?:[.,][0-9]{1,2})?)(?=\s)/);
  if (!m) return null;
  const value = parseFloat(m[1].replace('.', '').replace(',', '.'));
  return isNaN(value) ? null : value;
}

function isGlas(line: string): boolean {
  return /glas/i.test(line);
}

function formatDateNL(day: number, month: number, year: number): string {
  return `${day}-${month}-${year}`;
}

export interface ParseResult {
  items: InvoiceItem[];
  skipped: string[];
}

// Hoofdfunctie. Geeft { items, skipped } terug.
export function parseNotes(text: string, year: number): ParseResult {
  const lines = String(text || '').split(/\r?\n/);
  const items: InvoiceItem[] = [];
  const skipped: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Markeringen zoals "507#" overslaan
    if (/^\d+\s*#?$/.test(line)) { skipped.push(line); continue; }

    const amount = findAmount(line);
    if (amount === null) { skipped.push(line); continue; } // o.a. "7-Taxi Boute"

    const date = findDate(line);
    const glas = isGlas(line);

    // Extra check: een echte regel heeft een €, of een datum, of een
    // dienst-woord. Zo niet, dan is het waarschijnlijk een kopregel.
    const hasEuro = /€/.test(line);
    const hasService = /(glas|schoonmaak|kantoor|periodiek|reiniging)/i.test(line);
    if (!hasEuro && !date && !hasService) { skipped.push(line); continue; }

    items.push({
      day: date ? date.day : null,
      month: date ? date.month : null,
      year,
      dateText: date ? formatDateNL(date.day, date.month, year) : '',
      type: glas ? 'glasbewassing' : 'schoonmaak',
      amount,
      sortKey: date ? date.month * 100 + date.day : 9999,
    });
  }

  // Sorteer op datum (oplopend), net als op de voorbeeldfactuur
  items.sort((a, b) => (a.sortKey ?? 9999) - (b.sortKey ?? 9999));

  return { items, skipped };
}
