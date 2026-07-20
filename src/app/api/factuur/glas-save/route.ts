import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import { glasSlug, type GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const geldigeDatum = (value: unknown): string | null => {
  const text = typeof value === 'string' ? value.trim() : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const it = body?.item;
  if (!it || !String(it.address || '').trim()) {
    return NextResponse.json({ error: 'Adres ontbreekt.' }, { status: 400 });
  }

  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  const originalId = typeof body.originalId === 'string' ? body.originalId : '';
  const idx = originalId ? lijst.findIndex((x) => x.id === originalId) : -1;
  const bestaand = idx >= 0 ? lijst[idx] : null;
  const address = String(it.address).trim();
  const id = bestaand?.id || glasSlug(address);
  if (!bestaand && lijst.some((x) => x.id === id)) {
    return NextResponse.json({ error: 'Dit adres staat al in de lijst.' }, { status: 409 });
  }

  const every = it.every != null && String(it.every).trim() !== '' ? parseInt(String(it.every), 10) : null;
  if (every != null && (!Number.isInteger(every) || every < 1 || every > 120)) {
    return NextResponse.json({ error: 'Vul een geldige frequentie tussen 1 en 120 in.' }, { status: 400 });
  }

  const lastDone = geldigeDatum(it.lastDone);
  const plannedDate = geldigeDatum(it.plannedDate);
  const history = Array.isArray(bestaand?.history) ? [...bestaand.history] : [];
  if (lastDone && !history.includes(lastDone)) history.push(lastDone);

  const record: GlasAdres = {
    id,
    phone: String(it.phone || '').trim() || null,
    address,
    every,
    unit: it.unit === 'weken' ? 'weken' : 'maanden',
    lastDone,
    plannedDate,
    history: Array.from(new Set(history)).sort(),
    note: String(it.note || '').trim() || undefined,
  };

  if (idx >= 0) lijst[idx] = record; else lijst.push(record);
  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true, item: record });
}
