import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.FACTUUR_SMTP_USER && process.env.FACTUUR_SMTP_APP_PASSWORD),
    from: process.env.FACTUUR_FROM_EMAIL || process.env.FACTUUR_SMTP_USER || '',
  });
}
