import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { InvoiceLog, InvoiceStatus } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = new Set<InvoiceStatus>(['klaar', 'verzonden', 'betaald']);

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const number = typeof body.number === 'string' ? body.number.trim() : '';
  const status = body.status as InvoiceStatus;
  if (!number || !ALLOWED.has(status)) {
    return NextResponse.json({ error: 'Ongeldig factuurnummer of status.' }, { status: 400 });
  }

  const invoices = await readJson<InvoiceLog[]>('invoices', []);
  const invoice = invoices.find((item) => item.number === number);
  if (!invoice) return NextResponse.json({ error: 'Factuur niet gevonden.' }, { status: 404 });

  invoice.status = status;
  if (status === 'betaald') invoice.paidAt = new Date().toISOString();
  else invoice.paidAt = null;
  if (status === 'klaar') { invoice.sentAt = null; invoice.recipient = ''; }
  await writeJson('invoices', invoices);
  return NextResponse.json({ ok: true, invoice });
}
