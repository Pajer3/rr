import { NextResponse } from 'next/server';
import { readJson } from '@/lib/factuur/store';
import { buildSignatureInner, buildSignatureText } from '@/lib/factuur/template';
import type { Company } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const company = await readJson<Company>('company', {} as Company);
  return NextResponse.json({
    innerHtml: buildSignatureInner(company),
    plainText: buildSignatureText(company),
  });
}
