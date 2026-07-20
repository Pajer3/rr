import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import fs from 'fs';
import path from 'path';
import { readJson, readPdf, writeJson } from '@/lib/factuur/store';
import { buildInvoiceEmailHtml, buildSignatureText } from '@/lib/factuur/template';
import type { Company, InvoiceLog } from '@/lib/factuur/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function storeInSentMailbox(rawMessage: Buffer, user: string, password: string) {
  const client = new ImapFlow({
    host: process.env.FACTUUR_IMAP_HOST || 'imap.mail.me.com',
    port: Number(process.env.FACTUUR_IMAP_PORT || 993),
    secure: true,
    auth: { user, pass: password },
    logger: false,
  });

  try {
    await client.connect();
    const mailboxes = await client.list();
    const sentMailbox = mailboxes.find((mailbox) => mailbox.specialUse === '\\Sent');
    if (!sentMailbox) throw new Error('De speciale iCloud-map Verstuurd is niet gevonden.');

    const appended = await client.append(sentMailbox.path, rawMessage, ['\\Seen'], new Date());
    if (!appended) throw new Error('iCloud heeft de kopie voor Verstuurd niet opgeslagen.');
  } finally {
    if (client.usable) await client.logout().catch(() => client.close());
    else client.close();
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const number = typeof body.number === 'string' ? body.number.trim() : '';
  const to = typeof body.to === 'string' ? body.to.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.replace(/[\r\n]+/g, ' ').trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!number) return NextResponse.json({ error: 'Factuurnummer ontbreekt.' }, { status: 400 });
  if (!EMAIL.test(to)) return NextResponse.json({ error: 'Vul een geldig e-mailadres in.' }, { status: 400 });
  if (!subject || subject.length > 180) return NextResponse.json({ error: 'Controleer het onderwerp.' }, { status: 400 });
  if (!message || message.length > 10_000) return NextResponse.json({ error: 'Controleer het bericht.' }, { status: 400 });

  const user = process.env.FACTUUR_SMTP_USER || '';
  const password = process.env.FACTUUR_SMTP_APP_PASSWORD || '';
  const fromEmail = process.env.FACTUUR_FROM_EMAIL || user;
  if (!user || !password || !fromEmail) {
    return NextResponse.json({ error: 'Automatisch verzenden is nog niet geconfigureerd.' }, { status: 503 });
  }

  const invoices = await readJson<InvoiceLog[]>('invoices', []);
  const invoice = invoices.find((item) => item.number === number);
  if (!invoice) return NextResponse.json({ error: 'Factuur niet gevonden.' }, { status: 404 });
  const pdf = await readPdf(invoice.file);
  if (!pdf) return NextResponse.json({ error: 'De PDF van deze factuur is niet gevonden.' }, { status: 404 });
  const company = await readJson<Company>('company', {} as Company);
  const logoPath = path.join(process.cwd(), 'public', 'factuur-logo.png');
  const logoCid = 'frisspits-logo@frisspits.nl';
  const hasInlineLogo = fs.existsSync(logoPath);
  const html = buildInvoiceEmailHtml(
    message,
    company,
    hasInlineLogo ? `cid:${logoCid}` : 'https://www.frisspits.nl/factuur-logo.png',
  );
  const text = `${message}\n\n${buildSignatureText(company)}`;

  const transporter = nodemailer.createTransport({
    host: process.env.FACTUUR_SMTP_HOST || 'smtp.mail.me.com',
    port: Number(process.env.FACTUUR_SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user, pass: password },
  });

  const mail = {
    from: `${company.name || 'Frisspits'} <${fromEmail}>`,
    replyTo: fromEmail,
    to,
    subject,
    text,
    html,
    attachments: [
      { filename: invoice.file, content: pdf, contentType: 'application/pdf' },
      ...(hasInlineLogo ? [{
        filename: 'frisspits-logo.png',
        path: logoPath,
        cid: logoCid,
        contentType: 'image/png',
        contentDisposition: 'inline' as const,
      }] : []),
    ],
  };

  let rawMessage: Buffer;
  try {
    const compiler = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
      newline: 'unix',
    });
    const compiled = await compiler.sendMail(mail) as { message: Buffer | string };
    rawMessage = Buffer.isBuffer(compiled.message)
      ? compiled.message
      : Buffer.from(compiled.message);

    await transporter.sendMail({
      envelope: { from: fromEmail, to: [to] },
      raw: rawMessage,
    });
  } catch (error) {
    console.error('Factuurmail verzenden mislukt:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'iCloud Mail kon het bericht niet verzenden. Controleer de mailinstellingen.' }, { status: 502 });
  }

  let sentCopyStored = true;
  try {
    await storeInSentMailbox(rawMessage, user, password);
  } catch (error) {
    sentCopyStored = false;
    console.error('Kopie in iCloud Verstuurd opslaan mislukt:', error instanceof Error ? error.message : error);
  }

  invoice.status = 'verzonden';
  invoice.sentAt = new Date().toISOString();
  invoice.recipient = to;
  await writeJson('invoices', invoices);
  return NextResponse.json({ ok: true, invoice, sentCopyStored });
}
