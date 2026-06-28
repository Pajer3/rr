import { NextResponse } from 'next/server';
import { readJson } from '@/lib/factuur/store';
import type { Company } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const company = await readJson<Partial<Company>>('company', {});
  // Logo is groot (base64) en niet nodig in de browser -> weglaten.
  const { logoDataUri, ...rest } = company as Company;
  void logoDataUri;
  return NextResponse.json(rest);
}
