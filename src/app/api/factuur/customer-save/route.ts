import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import { slugify } from '@/lib/factuur/pdf';
import type { Customer } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Bewaar (of werk bij) een klant vanuit het beheerscherm.
// body: { originalId?: string, customer: {...} }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const c = body?.customer;
  if (!c || !c.name || !String(c.name).trim()) {
    return NextResponse.json({ error: 'Klantnaam ontbreekt.' }, { status: 400 });
  }

  const customers = await readJson<Customer[]>('customers', []);
  const newId = slugify(c.name);
  const originalId: string = body.originalId || '';

  // Als de naam verandert, mag het nieuwe id niet botsen met een andere klant.
  const botst = customers.some((x) => x.id === newId && x.id !== originalId);
  if (botst) {
    return NextResponse.json({ error: 'Er bestaat al een klant met deze naam.' }, { status: 400 });
  }

  const idx = originalId ? customers.findIndex((x) => x.id === originalId) : -1;
  const bestaand = idx >= 0 ? customers[idx] : {};
  const record: Customer = {
    ...bestaand,
    id: newId,
    name: String(c.name).trim(),
    email: c.email != null ? String(c.email).trim() : (bestaand as Customer).email || '',
    addressLines: Array.isArray(c.addressLines)
      ? c.addressLines.map((s: string) => String(s).trim()).filter(Boolean)
      : (bestaand as Customer).addressLines || [],
    type: c.type === 'particulier' ? 'particulier' : 'zakelijk',
    customerNo: c.customerNo != null && c.customerNo !== '' ? c.customerNo : (bestaand as Customer).customerNo ?? null,
    emailMessage: c.emailMessage != null ? c.emailMessage : (bestaand as Customer).emailMessage,
  };

  if (idx >= 0) customers[idx] = record; else customers.push(record);
  await writeJson('customers', customers);
  return NextResponse.json({ ok: true, customer: record });
}
