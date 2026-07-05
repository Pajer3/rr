import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string = body?.id || '';
  if (!id) return NextResponse.json({ error: 'Id ontbreekt.' }, { status: 400 });

  const lijst = await readJson<GlasAdres[]>('glasadressen', []);
  const idx = lijst.findIndex((x) => x.id === id);
  if (idx < 0) return NextResponse.json({ error: 'Adres niet gevonden.' }, { status: 404 });

  lijst.splice(idx, 1);
  await writeJson('glasadressen', lijst);
  return NextResponse.json({ ok: true });
}
