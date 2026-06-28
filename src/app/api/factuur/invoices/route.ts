import { NextResponse } from 'next/server';
import { readJson } from '@/lib/factuur/store';
import type { InvoiceLog } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Nieuwste eerst.
  return NextResponse.json((await readJson<InvoiceLog[]>('invoices', [])).slice().reverse());
}
