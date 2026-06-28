import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { OUTPUT_DIR } from '@/lib/factuur/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Opent (alleen op Windows) de map met de PDF en selecteert het bestand.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const file = path.basename(body?.file || '');
  const full = path.join(OUTPUT_DIR, file);
  if (!fs.existsSync(full)) {
    return NextResponse.json({ error: 'Bestand niet gevonden.' }, { status: 404 });
  }
  try {
    execFile('explorer.exe', ['/select,', full], () => {});
  } catch {
    /* niet op Windows -> stil negeren */
  }
  return NextResponse.json({ ok: true });
}
