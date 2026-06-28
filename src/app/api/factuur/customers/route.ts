import { NextResponse } from 'next/server';
import { readJson } from '@/lib/factuur/store';
import type { Customer } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readJson<Customer[]>('customers', []));
}
