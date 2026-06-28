import fs from 'fs';
import puppeteer from 'puppeteer-core';

// Zoekt een geïnstalleerde Chrome of Edge op de pc (voor lokaal gebruik).
function findChrome(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean) as string[];
  for (const c of candidates) {
    try { if (fs.existsSync(c)) return c; } catch { /* negeer */ }
  }
  return null;
}

// Draait deze code op een server (Vercel/Lambda) i.p.v. op de pc?
function isServerless(): boolean {
  return !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_REGION);
}

// Zet HTML om naar een A4 PDF. Geeft de PDF terug als bytes; schrijft hem ook
// naar een bestand als outPath is meegegeven (lokaal gebruik).
export async function htmlToPdf(html: string, outPath?: string): Promise<Buffer> {
  let browser;
  if (isServerless()) {
    // Op de server: meegeleverde Chromium gebruiken.
    const chromium = (await import('@sparticuz/chromium')).default;
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Op de pc: de geïnstalleerde Chrome/Edge gebruiken.
    const executablePath = findChrome();
    if (!executablePath) {
      throw new Error('Geen Chrome of Edge gevonden. Installeer Google Chrome of stel CHROME_PATH in.');
    }
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const buf = Buffer.from(pdf);
    if (outPath) {
      try { fs.writeFileSync(outPath, buf); } catch { /* op server geen schijf, niet erg */ }
    }
    return buf;
  } finally {
    await browser.close();
  }
}

export function slugify(s: string): string {
  return String(s || 'klant').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'klant';
}
