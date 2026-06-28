// Gedeelde logica voor het factuurbericht (gebruikt door de maak- en
// verstuurpagina). Bevat geen server-code, dus veilig in de browser te laden.

import type { Company, Customer } from './types';

// Nederlands geldformaat: hele bedragen als "€76,-", anders "€94,29"
export function money(v: number): string {
  v = Math.round(v * 100) / 100;
  if (Number.isInteger(v)) return '€' + v.toLocaleString('nl-NL') + ',-';
  const p = v.toFixed(2).split('.');
  return '€' + parseInt(p[0], 10).toLocaleString('nl-NL') + ',' + p[1];
}

// Standaard factuurbericht (placeholders worden automatisch ingevuld) — kort en netjes.
// Géén afsluiting/"Met vriendelijke groet" hier: dat staat in je e-mailhandtekening.
export const DEFAULT_MESSAGE =
`Beste {klant},

Hierbij ontvangt u factuur {nummer}. Wij verzoeken u vriendelijk het bedrag van {totaal} binnen {termijn} dagen over te maken naar {iban} t.n.v. {tnv}, o.v.v. factuurnummer {nummer}.`;

export interface Vals {
  klant: string;
  nummer: string;
  totaal: string;
  termijn: number | string;
  iban: string;
  tnv: string;
  contactpersoon: string;
  telefoon: string;
}

const PH: (keyof Vals)[] = ['klant', 'nummer', 'totaal', 'termijn', 'iban', 'tnv', 'contactpersoon', 'telefoon'];

function splitJoin(s: string, find: string, repl: string): string {
  return find ? String(s).split(find).join(repl) : s;
}

// {placeholder} -> echte waarde
export function fillTemplate(tpl: string, vals: Vals): string {
  let out = tpl;
  PH.forEach((k) => { out = splitJoin(out, '{' + k + '}', vals[k] != null ? String(vals[k]) : ''); });
  return out;
}

// echte waarde -> {placeholder}, zodat het bericht herbruikbaar wordt opgeslagen
export function templatize(text: string, vals: Vals): string {
  let out = text;
  out = splitJoin(out, vals.totaal, '{totaal}');
  out = splitJoin(out, vals.iban, '{iban}');
  out = splitJoin(out, vals.nummer, '{nummer}');
  out = splitJoin(out, vals.termijn + ' dagen', '{termijn} dagen');
  out = splitJoin(out, vals.klant, '{klant}');
  out = splitJoin(out, vals.contactpersoon, '{contactpersoon}');
  out = splitJoin(out, vals.telefoon, '{telefoon}');
  out = splitJoin(out, vals.tnv, '{tnv}');
  return out;
}

// Bouw het e-mailonderwerp (net en netjes met hoofdletter)
export function buildSubject(company: Partial<Company>, invoiceNumber: string): string {
  const pretty = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
  return `Factuur ${invoiceNumber} - ${pretty(company.name)} ${pretty(company.tagline)}`.trim();
}

// Bouw de ingevulde waarden voor het bericht
export function buildVals(
  company: Partial<Company>,
  customer: Pick<Customer, 'name'>,
  invoiceNumber: string,
  total: number,
  termDays: number,
): Vals {
  return {
    klant: customer.name,
    nummer: invoiceNumber,
    totaal: money(total),
    termijn: termDays,
    iban: company.iban || '',
    tnv: company.accountHolder || '',
    contactpersoon: company.contactName || '',
    telefoon: company.phone || '',
  };
}
