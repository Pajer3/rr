import { NextResponse } from 'next/server';
import path from 'path';
import { readPdf } from '@/lib/factuur/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Levert een (beveiligde) factuur-PDF uit de database.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file') || '';
  const safe = path.basename(file); // voorkomt pad-trucs
  if (!safe.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Ongeldig bestand.' }, { status: 400 });
  }
  const buf = await readPdf(safe);
  if (!buf) {
    return NextResponse.json({ error: 'Bestand niet gevonden.' }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safe}"`,
      'Cache-Control': 'no-store',
    },
  });
}
