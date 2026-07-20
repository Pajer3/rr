import type { Company, Customer, InvoiceItem, Totals } from './types';

// Bouwt de HTML van de factuur. Deze HTML wordt door Chrome naar PDF omgezet.

function escapeHtml(s: unknown): string {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Nederlands geldformaat: hele bedragen als "€76,-", anders "€94,29"
export function money(value: number): string {
  const v = Math.round(value * 100) / 100;
  if (Number.isInteger(v)) {
    return '€' + v.toLocaleString('nl-NL') + ',-';
  }
  const parts = v.toFixed(2).split('.');
  const whole = parseInt(parts[0], 10).toLocaleString('nl-NL');
  return '€' + whole + ',' + parts[1];
}

export function computeTotals(items: InvoiceItem[], btwRate: number): Totals {
  const subtotal = items.reduce((sum, it) => sum + Number(it.amount || 0), 0);
  const btw = Math.round(subtotal * (btwRate / 100) * 100) / 100;
  const total = Math.round((subtotal + btw) * 100) / 100;
  return { subtotal, btw, total };
}

function renderRows(items: InvoiceItem[], company: Company): string {
  return items.map((it) => {
    const desc = company.descriptions[it.type || 'schoonmaak'] || company.descriptions.schoonmaak;
    const descHtml = escapeHtml(desc).replace(/\n/g, '<br>');
    return `
      <tr>
        <td class="c-date">${escapeHtml(it.dateText || '')}</td>
        <td class="c-desc">${descHtml}</td>
        <td class="c-tarief">${escapeHtml(company.tariefLabel || '')}</td>
        <td class="c-amount">${money(Number(it.amount || 0))}</td>
      </tr>`;
  }).join('');
}

export interface InvoiceOpts {
  company: Company;
  customer: Customer;
  items: InvoiceItem[];
  invoiceNumber: string;
  dateText: string;
  paymentTermDays?: number;
}

export function buildInvoiceHtml(opts: InvoiceOpts): string {
  const { company, customer, items, invoiceNumber, dateText } = opts;
  const paymentTermDays = opts.paymentTermDays || company.paymentTermDays || 30;
  const btwRate = company.btwRate || 21;
  const { subtotal, btw, total } = computeTotals(items, btwRate);

  const customerLines = (customer.addressLines || [])
    .map((l) => escapeHtml(l)).join('<br>');

  const emailLink = escapeHtml(company.email);

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 210mm; height: 297mm; position: relative;
    font-family: Arial, Helvetica, sans-serif; color: #222;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* ---- Zijbalk ---- */
  .sidebar {
    position: absolute; top: 0; left: 0; width: 56mm; height: 297mm;
    background: #36393d; color: #ffffff;
  }
  .sidebar .accent-v {
    position: absolute; top: 0; right: 0; width: 3mm; height: 297mm;
    background: #2ba6dd;
  }
  .logo { padding: 20mm 8mm 0 8mm; }
  .logo .brand {
    font-size: 26pt; font-weight: 800; letter-spacing: 1px; color: #57c4ec;
    line-height: 1;
  }
  .logo .brand-img { display: block; width: 40mm; height: auto; }
  .logo .tagline {
    font-size: 7.5pt; letter-spacing: 2px; color: #ffffff; margin-top: 2.5mm;
  }
  .contact {
    position: absolute; top: 92mm; left: 8mm; right: 10mm;
    font-size: 8.5pt; line-height: 1.7; color: #f1f1f1;
  }
  .contact .name { font-weight: 700; margin-bottom: 5mm; }
  .contact .email a { color: #57c4ec; text-decoration: underline; }
  .contact .meta { margin-top: 5mm; }

  /* ---- Hoofdgedeelte ---- */
  .main {
    position: absolute; top: 0; left: 56mm; right: 0; min-height: 297mm;
    padding: 14mm 12mm 11mm 12mm; display: flex; flex-direction: column;
  }
  .title { text-align: right; font-size: 40pt; font-weight: 400; letter-spacing: 2px; color: #2f2f2f; margin: 0 0 8mm 0; }

  .billto {
    border: 1px solid #9a9a9a; padding: 4mm 5mm; width: 78mm; min-height: 30mm;
    font-size: 9pt; line-height: 1.6;
  }
  .billto .lbl { margin-bottom: 3mm; }

  table.lines { width: 100%; border-collapse: collapse; margin-top: 12mm; }
  table.lines thead th {
    background: #36393d; color: #fff; font-size: 8.5pt; letter-spacing: 1px;
    text-align: left; padding: 2.4mm 3mm;
  }
  table.lines thead th.c-amount { text-align: right; }
  table.lines tbody td { font-size: 8.5pt; padding: 2.6mm 3mm; vertical-align: top; }
  table.lines tbody tr { page-break-inside: avoid; }
  td.c-date { width: 24mm; }
  td.c-desc { line-height: 1.4; }
  td.c-tarief { width: 26mm; }
  td.c-amount { width: 22mm; text-align: right; white-space: nowrap; }

  /* duwt totalen + voettekst naar onderen als er ruimte over is */
  .spacer { flex: 1 1 auto; min-height: 8mm; }

  .totals { width: 70mm; margin-left: auto; margin-top: 8mm; font-size: 9.5pt; }
  .totals .row { display: flex; justify-content: space-between; padding: 2.4mm 3mm; }
  .totals .row .lab { color: #333; }
  .totals .row.total { background: #d9d9d9; font-weight: 700; }

  .footer {
    margin-top: 10mm; text-align: center; font-size: 8pt; font-weight: 700;
    line-height: 1.6; color: #1a1a1a;
  }
</style>
</head>
<body>
  <div class="sidebar">
    <div class="accent-v"></div>
    <div class="logo">
      ${company.logoDataUri
        ? `<img class="brand-img" src="${company.logoDataUri}" alt="${escapeHtml(company.name)}">`
        : `<div class="brand">${escapeHtml(company.name)}</div>`}
      <div class="tagline">${escapeHtml(company.tagline)}</div>
    </div>
    <div class="contact">
      <div class="name">${escapeHtml(company.contactName)}</div>
      <div>${escapeHtml(company.addressLine)}</div>
      <div>${escapeHtml(company.postcodeCity)}</div>
      <div>Telefoon ${escapeHtml(company.phone)}</div>
      <div class="email"><a href="mailto:${emailLink}">${emailLink}</a></div>
      <div class="meta">Factuur # ${escapeHtml(invoiceNumber)}</div>
      <div>DATUM: ${escapeHtml(dateText)}</div>
    </div>
  </div>

  <div class="main">
    <div class="title">FACTUUR</div>
    <div class="billto">
      <div class="lbl">Aan:</div>
      <div><strong>${escapeHtml(customer.name)}</strong></div>
      <div style="margin-top:3mm">${customerLines}</div>
    </div>

    <table class="lines">
      <thead>
        <tr>
          <th class="c-omschr" colspan="3">OMSCHRIJVING</th>
          <th class="c-amount">BEDRAG</th>
        </tr>
      </thead>
      <tbody>
        ${renderRows(items, company)}
      </tbody>
    </table>

    <div class="spacer"></div>

    <div class="totals">
      <div class="row"><span class="lab">Subtotaal</span><span>${money(subtotal)}</span></div>
      <div class="row"><span class="lab">${btwRate}% BTW</span><span>${money(btw)}</span></div>
      <div class="row total"><span class="lab">TOTAAL</span><span>${money(total)}</span></div>
    </div>

    <div class="footer">
      WIJ VERZOEKEN U VRIENDELIJK HET BEDRAG VAN ${money(total)} BINNEN ${paymentTermDays} DAGEN OVER TE MAKEN<br>
      NAAR BANKREKENING ${escapeHtml(company.iban)}<br>
      T.N.V. ${escapeHtml(company.accountHolder)}<br>
      ONDER VERMELDING VAN HET FACTUUR NUMMER ${escapeHtml(invoiceNumber)}#<br>
      BTW NR. ${escapeHtml(company.btwNumber)}&nbsp;&nbsp;KVK NR. ${escapeHtml(company.kvkNumber)}
    </div>
  </div>
</body>
</html>`;
}

// ---- E-mailhandtekening ----
// E-mailveilige tabelopmaak met vaste Frisspits-terugvalwaarden. Gegevens uit
// Beheer blijven leidend, zodat latere wijzigingen automatisch worden verwerkt.
const SIGNATURE_DEFAULTS = {
  contactName: 'Joshua Ramos',
  companyLine: 'Frisspits Schoonmaakdiensten',
  addressLine: 'Weteringkade 241',
  postcodeCity: '3826 AW AMERSFOORT',
  phone: '(06)51891004',
  email: 'info@frisspits.nl',
  kvkNumber: '92185509',
  btwNumber: 'NL004850387B82',
  logo: 'https://www.frisspits.nl/factuur-logo.png',
};

function signatureValue(value: unknown, fallback: string): string {
  const result = String(value || '').trim();
  return result || fallback;
}

function signatureCompanyLine(): string {
  return SIGNATURE_DEFAULTS.companyLine;
}

export function buildSignatureInner(company: Partial<Company>, logoSrc?: string): string {
  const blue = '#119bc5';
  const contactName = signatureValue(company.contactName, SIGNATURE_DEFAULTS.contactName);
  const companyLine = signatureCompanyLine();
  const addressLine = signatureValue(company.addressLine, SIGNATURE_DEFAULTS.addressLine);
  const postcodeCity = signatureValue(company.postcodeCity, SIGNATURE_DEFAULTS.postcodeCity);
  const phone = signatureValue(company.phone, SIGNATURE_DEFAULTS.phone);
  const email = signatureValue(company.email, SIGNATURE_DEFAULTS.email);
  const kvkNumber = signatureValue(company.kvkNumber, SIGNATURE_DEFAULTS.kvkNumber);
  const btwNumber = signatureValue(company.btwNumber, SIGNATURE_DEFAULTS.btwNumber);
  const phoneDigits = phone.replace(/[^0-9+]/g, '');
  const mapQuery = encodeURIComponent(`${addressLine}, ${postcodeCity}`);
  const logo = logoSrc || company.logoDataUri || SIGNATURE_DEFAULTS.logo;

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#111111;">
  <tr><td style="padding:0 0 15px 0;font-size:14px;line-height:1.4;">Met vriendelijke groet,</td></tr>
  <tr><td style="padding:0 0 1px 0;font-size:18px;line-height:1.25;font-weight:700;color:#111111;">${escapeHtml(contactName)}</td></tr>
  <tr><td style="padding:0 0 10px 0;font-size:14px;line-height:1.35;color:#666666;">${escapeHtml(companyLine)}</td></tr>
  <tr><td style="padding:0 0 12px 0;"><img src="${escapeHtml(logo)}" width="210" alt="Frisspits" style="display:block;width:210px;max-width:100%;height:auto;border:0;"></td></tr>
  <tr><td><a href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" style="color:${blue};text-decoration:underline;">${escapeHtml(addressLine)}</a></td></tr>
  <tr><td style="padding-bottom:4px;"><a href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" style="color:${blue};text-decoration:underline;">${escapeHtml(postcodeCity)}</a></td></tr>
  <tr><td><a href="tel:${escapeHtml(phoneDigits)}" style="color:${blue};text-decoration:none;">${escapeHtml(phone)}</a></td></tr>
  <tr><td style="padding-bottom:10px;"><a href="mailto:${escapeHtml(email)}" style="color:${blue};text-decoration:none;">${escapeHtml(email)}</a></td></tr>
  <tr><td style="color:#999999;font-size:11px;line-height:1.4;">KvK <span style="text-decoration:underline;">${escapeHtml(kvkNumber)}</span> &nbsp;&middot;&nbsp; BTW ${escapeHtml(btwNumber)}</td></tr>
</table>`;
}

// Volledige HTML-versie voor automatisch verzonden factuurmails.
export function buildInvoiceEmailHtml(message: string, company: Partial<Company>, logoSrc?: string): string {
  const body = escapeHtml(message).replace(/\r?\n/g, '<br>');
  return `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"></head>
<body style="margin:0;padding:24px;background:#ffffff;color:#222222;-webkit-text-size-adjust:100%;">
  <div style="max-width:680px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222222;">${body}</div>
  <div style="margin-top:32px;">${buildSignatureInner(company, logoSrc)}</div>
</body>
</html>`;
}

// Platte-tekst versie als een mailprogramma HTML of afbeeldingen niet toont.
export function buildSignatureText(company: Partial<Company>): string {
  const contactName = signatureValue(company.contactName, SIGNATURE_DEFAULTS.contactName);
  const addressLine = signatureValue(company.addressLine, SIGNATURE_DEFAULTS.addressLine);
  const postcodeCity = signatureValue(company.postcodeCity, SIGNATURE_DEFAULTS.postcodeCity);
  const phone = signatureValue(company.phone, SIGNATURE_DEFAULTS.phone);
  const email = signatureValue(company.email, SIGNATURE_DEFAULTS.email);
  const kvkNumber = signatureValue(company.kvkNumber, SIGNATURE_DEFAULTS.kvkNumber);
  const btwNumber = signatureValue(company.btwNumber, SIGNATURE_DEFAULTS.btwNumber);
  return [
    'Met vriendelijke groet,',
    '',
    contactName,
    signatureCompanyLine(),
    addressLine,
    postcodeCity,
    phone,
    email,
    `KvK ${kvkNumber} · BTW ${btwNumber}`,
  ].join('\n');
}
