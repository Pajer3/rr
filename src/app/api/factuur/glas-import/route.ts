import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Voeg ingelezen adressen toe aan de lijst. Bestaat een adres al (zelfde id of
// zelfde nummer), dan worden de frequentie en datums bijgewerkt in plaats van
// dat er een dubbel bij komt.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const items: GlasAdres[] = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) return NextResponse.json({ error: 'Geen adressen om toe te voegen.' }, { status: 400 });

  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  let nieuw = 0;
  let bijgewerkt = 0;

  for (const it of items) {
    if (!it || !it.address) continue;
    const idx = lijst.findIndex((x) =>
      x.id === it.id || (it.nr != null && x.nr != null && x.nr === it.nr),
    );
    if (idx >= 0) {
      const oud = lijst[idx];
      const history = Array.from(new Set([...(oud.history || []), ...(it.history || [])])).sort();
      lijst[idx] = {
        ...oud,
        nr: it.nr ?? oud.nr,
        address: it.address || oud.address,
        every: it.every ?? oud.every,
        unit: it.unit || oud.unit,
        lastDone: [oud.lastDone, it.lastDone].filter(Boolean).sort().pop() || null,
        history,
      };
      bijgewerkt++;
    } else {
      lijst.push({ ...it, history: it.history || [] });
      nieuw++;
    }
  }

  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true, nieuw, bijgewerkt, totaal: lijst.length });
}
