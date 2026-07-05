import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { Company } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Werk de instellingen bij vanuit het beheerscherm. Alleen deze velden mogen
// aangepast worden; het logo en de omschrijvingen blijven onaangetast.
const TEKSTVELDEN = [
  'name', 'tagline', 'contactName', 'addressLine', 'postcodeCity', 'phone',
  'email', 'iban', 'accountHolder', 'btwNumber', 'kvkNumber', 'numberPrefix',
  'tariefLabel',
] as const;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const company = await readJson<Company>('company', {} as Company);

  for (const veld of TEKSTVELDEN) {
    if (typeof body[veld] === 'string') {
      (company as unknown as Record<string, unknown>)[veld] = body[veld].trim();
    }
  }

  if (body.nextNumber != null) {
    const n = parseInt(body.nextNumber, 10);
    if (!Number.isInteger(n) || n < 1) {
      return NextResponse.json({ error: 'Het volgende factuurnummer moet een positief getal zijn.' }, { status: 400 });
    }
    company.nextNumber = n;
  }
  if (body.btwRate != null) {
    const n = parseFloat(body.btwRate);
    if (isNaN(n) || n < 0 || n > 100) {
      return NextResponse.json({ error: 'Het BTW-percentage klopt niet.' }, { status: 400 });
    }
    company.btwRate = n;
  }
  if (body.paymentTermDays != null) {
    const n = parseInt(body.paymentTermDays, 10);
    if (!Number.isInteger(n) || n < 1) {
      return NextResponse.json({ error: 'De betaaltermijn moet een positief aantal dagen zijn.' }, { status: 400 });
    }
    company.paymentTermDays = n;
  }

  await writeJson('company', company);
  const { logoDataUri, ...rest } = company;
  void logoDataUri;
  return NextResponse.json({ ok: true, company: rest });
}
