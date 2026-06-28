import { NextResponse } from 'next/server';
import { wachtwoordKlopt, zetWachtwoord } from '@/lib/factuur/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const huidig: string = body?.huidig || '';
  const nieuw: string = body?.nieuw || '';

  if (!(await wachtwoordKlopt(huidig))) {
    return NextResponse.json({ error: 'Je huidige wachtwoord klopt niet.' }, { status: 401 });
  }
  if (typeof nieuw !== 'string' || nieuw.length < 6) {
    return NextResponse.json({ error: 'Kies een nieuw wachtwoord van minstens 6 tekens.' }, { status: 400 });
  }
  await zetWachtwoord(nieuw);
  return NextResponse.json({ ok: true });
}
