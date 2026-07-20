import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import { vandaagIso, type GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = typeof body?.id === 'string' ? body.id : '';
  if (!id) return NextResponse.json({ error: 'Id ontbreekt.' }, { status: 400 });

  const datum = /^\d{4}-\d{2}-\d{2}$/.test(body?.date || '') ? body.date : vandaagIso();
  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  const item = lijst.find((x) => x.id === id);
  if (!item) return NextResponse.json({ error: 'Adres niet gevonden.' }, { status: 404 });

  item.lastDone = datum;
  item.plannedDate = null;
  const history = Array.isArray(item.history) ? item.history : [];
  item.history = Array.from(new Set([...history, datum])).sort();
  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true, item });
}
