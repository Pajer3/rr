import { NextResponse } from 'next/server';
import { COOKIE_NAME, sessieToken, wachtwoordKlopt } from '@/lib/factuur/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let wachtwoord = '';
  try {
    const body = await req.json();
    wachtwoord = body?.wachtwoord || '';
  } catch {
    /* lege body */
  }

  if (!(await wachtwoordKlopt(wachtwoord))) {
    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessieToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dagen
  });
  return res;
}
