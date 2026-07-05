import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import { glasSlug, type GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Bewaar (of werk bij) één glasbewassing-adres.
// body: { originalId?: string, item: {...} }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const it = body?.item;
  if (!it || !it.address || !String(it.address).trim()) {
    return NextResponse.json({ error: 'Adres ontbreekt.' }, { status: 400 });
  }

  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  const originalId: string = body.originalId || '';
  const idx = originalId ? lijst.findIndex((x) => x.id === originalId) : -1;
  const bestaand = idx >= 0 ? lijst[idx] : null;

  const nr = it.nr != null && it.nr !== '' ? parseInt(it.nr, 10) : null;
  const address = String(it.address).trim();
  const newId = bestaand ? bestaand.id : glasSlug((nr != null ? nr + '-' : '') + address);
  if (!bestaand && lijst.some((x) => x.id === newId)) {
    return NextResponse.json({ error: 'Dit adres staat al in de lijst.' }, { status: 400 });
  }

  const record: GlasAdres = {
    id: newId,
    nr: Number.isInteger(nr) ? nr : null,
    address,
    every: it.every != null && it.every !== '' ? Math.max(1, parseInt(it.every, 10) || 1) : null,
    unit: it.unit === 'weken' ? 'weken' : 'maanden',
    lastDone: it.lastDone || null,
    history: bestaand ? bestaand.history : [],
    note: it.note || undefined,
  };
  // Als de laatste datum handmatig veranderd is, ook in de geschiedenis zetten.
  if (record.lastDone && !record.history.includes(record.lastDone)) {
    record.history = [...record.history, record.lastDone].sort();
  }

  if (idx >= 0) lijst[idx] = record; else lijst.push(record);
  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true, item: record });
}
