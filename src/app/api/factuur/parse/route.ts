import { NextResponse } from 'next/server';
import { parseNotes } from '@/lib/factuur/parse';
import { computeTotals } from '@/lib/factuur/template';
import { readJson } from '@/lib/factuur/store';
import type { Company } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const y = parseInt(body?.year, 10) || new Date().getFullYear();
  const result = parseNotes(body?.text || '', y);
  const company = await readJson<Partial<Company>>('company', {});
  const totals = computeTotals(result.items, company.btwRate || 21);
  return NextResponse.json({ ...result, totals });
}
