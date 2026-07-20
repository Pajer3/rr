import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Alle gegevens staan in Neon Postgres. Lokaal bewaren we factuur-PDF's
// daarnaast in een uitvoermap zodat openen en iCloud-synchronisatie werken.
export const OUTPUT_DIR = path.join(process.cwd(), 'factuur-output');

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL ontbreekt — de databaseverbinding is niet ingesteld.');
  return neon(url);
}

let schemaKlaar = false;
async function ensureSchema() {
  if (schemaKlaar) return;
  const sql = db();
  await sql`CREATE TABLE IF NOT EXISTS app_data (key text PRIMARY KEY, value jsonb NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS pdfs (
    filename text PRIMARY KEY,
    data_base64 text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  schemaKlaar = true;
}

// Databasefouten worden bewust doorgegeven. Een lege fallback bij een storing
// zou echte gegevens kunnen verbergen en bij een volgende opslag overschrijven.
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  await ensureSchema();
  const sql = db();
  const rows = (await sql`SELECT value FROM app_data WHERE key = ${key}`) as { value: T }[];
  if (rows.length === 0) return fallback;
  return rows[0].value;
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  await ensureSchema();
  const sql = db();
  await sql`INSERT INTO app_data (key, value) VALUES (${key}, ${JSON.stringify(value)}::jsonb)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}

export async function readPdf(filename: string): Promise<Buffer | null> {
  await ensureSchema();
  const sql = db();
  const rows = (await sql`SELECT data_base64 FROM pdfs WHERE filename = ${filename}`) as { data_base64: string }[];
  if (rows.length === 0) return null;
  return Buffer.from(rows[0].data_base64, 'base64');
}

export async function writePdf(filename: string, buf: Buffer): Promise<void> {
  await ensureSchema();
  const sql = db();
  const b64 = buf.toString('base64');
  await sql`INSERT INTO pdfs (filename, data_base64) VALUES (${filename}, ${b64})
            ON CONFLICT (filename) DO UPDATE SET data_base64 = EXCLUDED.data_base64`;
}

export function syncDir(): string | null {
  const candidates: string[] = [];
  if (process.env.FACTUUR_ICLOUD_MAP) candidates.push(process.env.FACTUUR_ICLOUD_MAP);
  const userHome = process.env.USERPROFILE || process.env.HOME || '';
  if (userHome) {
    candidates.push(path.join(userHome, 'iCloudDrive', 'Frisspits facturen'));
    candidates.push(path.join(userHome, 'iCloud Drive', 'Frisspits facturen'));
  }
  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir)) return dir;
      const base = path.dirname(dir);
      if (fs.existsSync(base)) {
        fs.mkdirSync(dir, { recursive: true });
        return dir;
      }
    } catch { /* Probeer de volgende map. */ }
  }
  return null;
}
