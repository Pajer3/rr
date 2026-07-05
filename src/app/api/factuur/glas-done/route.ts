import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function vandaagIso() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Meld een adres als uitgevoerd (vandaag, of op een gekozen datum).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string = body?.id || '';
  if (!id) return NextResponse.json({ error: 'Id ontbreekt.' }, { status: 400 });

  const datum: string = /^\d{4}-\d{2}-\d{2}$/.test(body?.date || '') ? body.date : vandaagIso();

  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  const item = lijst.find((x) => x.id === id);
  if (!item) return NextResponse.json({ error: 'Adres niet gevonden.' }, { status: 404 });

  item.lastDone = datum;
  if (!item.history.includes(datum)) item.history = [...item.history, datum].sort();

  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true, item });
}
