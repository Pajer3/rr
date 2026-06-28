import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import { slugify } from '@/lib/factuur/pdf';
import type { Customer } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name: string = body?.name || '';
  const message: string = body?.message || '';
  if (!name) return NextResponse.json({ error: 'Klantnaam ontbreekt.' }, { status: 400 });

  const customers = await readJson<Customer[]>('customers', []);
  const id = slugify(name);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx >= 0) {
    customers[idx].emailMessage = message;
  } else {
    customers.push({ id, name, addressLines: [], email: '', type: 'zakelijk', emailMessage: message });
  }
  await writeJson('customers', customers);
  return NextResponse.json({ ok: true });
}
