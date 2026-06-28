import type { Company, Customer, InvoiceItem, Totals } from './types';

// Bouwt de HTML van de factuur. Deze HTML wordt door Chrome naar PDF omgezet.

function escapeHtml(s: unknown): string {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
// De binnenkant (dit is wat naar Gmail gekopieerd wordt). E-mailveilige opmaak:
// tabel + inline-stijlen, blauwe accentkleur uit de huisstijl.
export function buildSignatureInner(company: Company): string {
  const blue = '#2491c2';
  const phoneDigits = String(company.phone || '').replace(/[^0-9]/g, '');
  const pretty = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
  const companyLine = `${pretty(company.name)} ${pretty(company.tagline)}`.trim();
  const logo = company.logoDataUri
    ? `<tr><td style="padding:6px 0 12px 0;"><img src="${company.logoDataUri}" width="190" alt="${escapeHtml(company.name)}" style="display:block;border:0;"></td></tr>`
    : '';

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#333;">
  <tr><td style="padding-bottom:12px;">Met vriendelijke groet,</td></tr>
  <tr><td style="font-size:15px;font-weight:bold;color:#222;padding-bottom:1px;">${escapeHtml(company.contactName)}</td></tr>
  <tr><td style="color:#666;padding-bottom:2px;">${escapeHtml(companyLine)}</td></tr>
  ${logo}
  <tr><td style="color:${blue};">${escapeHtml(company.addressLine)}</td></tr>
  <tr><td style="color:${blue};">${escapeHtml(company.postcodeCity)}</td></tr>
  <tr><td><a href="tel:${phoneDigits}" style="color:${blue};text-decoration:none;">${escapeHtml(company.phone)}</a></td></tr>
  <tr><td><a href="mailto:${escapeHtml(company.email)}" style="color:${blue};text-decoration:none;">${escapeHtml(company.email)}</a></td></tr>
  <tr><td style="padding-top:7px;color:#999;font-size:11.5px;">KvK ${escapeHtml(company.kvkNumber)} &nbsp;&middot;&nbsp; BTW ${escapeHtml(company.btwNumber)}</td></tr>
</table>`;
}

// Platte-tekst versie (voor iCloud webmail e.d. die geen logo toelaten).
export function buildSignatureText(company: Company): string {
  const pretty = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
  const companyLine = `${pretty(company.name)} ${pretty(company.tagline)}`.trim();
  return [
    'Met vriendelijke groet,',
    '',
    company.contactName,
    companyLine,
    company.addressLine,
    company.postcodeCity,
    company.phone,
    company.email,
    `KvK ${company.kvkNumber} · BTW ${company.btwNumber}`,
  ].filter((l) => l !== undefined && l !== null).join('\n');
}
