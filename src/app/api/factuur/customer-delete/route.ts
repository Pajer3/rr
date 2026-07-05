import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { Customer } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Verwijder een opgeslagen klant. De al gemaakte facturen blijven gewoon bestaan.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string = body?.id || '';
  if (!id) return NextResponse.json({ error: 'Klant-id ontbreekt.' }, { status: 400 });

  const customers = await readJson<Customer[]>('customers', []);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx < 0) return NextResponse.json({ error: 'Klant niet gevonden.' }, { status: 404 });

  customers.splice(idx, 1);
  await writeJson('customers', customers);
  return NextResponse.json({ ok: true });
}
