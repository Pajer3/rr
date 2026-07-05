import { NextResponse } from 'next/server';
import { readJson } from '@/lib/factuur/store';
import type { GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readJson<GlasAdres[]>('glasadressen', []));
}
