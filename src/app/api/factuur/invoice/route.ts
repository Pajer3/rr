import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson, writePdf, OUTPUT_DIR, syncDir } from '@/lib/factuur/store';
import { buildInvoiceHtml, computeTotals } from '@/lib/factuur/template';
import { htmlToPdf, slugify } from '@/lib/factuur/pdf';
import type { Company, Customer, InvoiceItem, InvoiceLog } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function formatToday() {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export async function POST(req: Request) {
  try {
    const company = await readJson<Company>('company', {} as Company);
    const customers = await readJson<Customer[]>('customers', []);
    const invoices = await readJson<InvoiceLog[]>('invoices', []);

    const body = await req.json().catch(() => ({}));
    const items: InvoiceItem[] = Array.isArray(body.items)
      ? body.items.filter((i: InvoiceItem) => i && i.amount != null)
      : [];

    if (!body.customer || !body.customer.name) {
      return NextResponse.json({ error: 'Klantnaam ontbreekt.' }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: 'Geen factuurregels.' }, { status: 400 });
    }

    const invoiceNumber: string = body.invoiceNumber || (company.numberPrefix + company.nextNumber);
    const dateText: string = body.dateText || formatToday();
    const paymentTermDays = parseInt(body.paymentTermDays, 10) || company.paymentTermDays || 30;

    const html = buildInvoiceHtml({
      company, customer: body.customer, items, invoiceNumber, dateText, paymentTermDays,
    });
    const totals = computeTotals(items, company.btwRate || 21);

    const fileName = `Factuur-${invoiceNumber}-${slugify(body.customer.name)}.pdf`;

    // PDF maken en in de database opslaan.
    const pdfBuf = await htmlToPdf(html);
    await writePdf(fileName, pdfBuf);

    // Op de eigen pc: ook lokaal opslaan + naar de sync-map (iCloud) zetten.
    let synced = false;
    let syncMap: string | null = null;
    try {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(path.join(OUTPUT_DIR, fileName), pdfBuf);
    } catch { /* op de server geen schijf — niet erg */ }
    try {
      const dir = syncDir();
      if (dir) {
        fs.writeFileSync(path.join(dir, fileName), pdfBuf);
        synced = true;
        syncMap = dir;
      }
    } catch { /* sync mislukt — PDF staat al in de database */ }

    // Verhoog het factuurnummer als dit het eerstvolgende nummer was.
    if (!body.invoiceNumber || body.invoiceNumber === company.numberPrefix + company.nextNumber) {
      company.nextNumber = (company.nextNumber || 0) + 1;
      await writeJson('company', company);
    }

    // Klant opslaan/bijwerken.
    if (body.saveCustomer) {
      const id = slugify(body.customer.name);
      const idx = customers.findIndex((c) => c.id === id);
      const record: Customer = {
        ...(idx >= 0 ? customers[idx] : {}),
        id,
        customerNo: body.customer.customerNo || (idx >= 0 ? customers[idx].customerNo : null),
        name: body.customer.name,
        addressLines: body.customer.addressLines || [],
        email: body.customer.email || (idx >= 0 ? customers[idx].email : ''),
        type: body.customer.type || (idx >= 0 ? customers[idx].type : 'zakelijk') || 'zakelijk',
      };
      if (idx >= 0) customers[idx] = record; else customers.push(record);
      await writeJson('customers', customers);
    }

    // Log (vervang bestaande met hetzelfde nummer i.p.v. dubbel toevoegen).
    const logEntry: InvoiceLog = {
      number: invoiceNumber,
      date: dateText,
      customer: body.customer.name,
      total: totals.total,
      paymentTermDays,
      file: fileName,
    };
    const existingIdx = invoices.findIndex((i) => i.number === invoiceNumber);
    if (existingIdx >= 0) invoices[existingIdx] = logEntry; else invoices.push(logEntry);
    await writeJson('invoices', invoices);

    return NextResponse.json({
      ok: true,
      invoiceNumber,
      dateText,
      totals,
      file: fileName,
      pdfUrl: '/api/factuur/pdf?file=' + encodeURIComponent(fileName),
      synced,
      syncMap,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout bij maken PDF.';
    console.error(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
