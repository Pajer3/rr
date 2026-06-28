import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Alle gegevens staan in de online database (Neon Postgres):
//  - app_data: bedrijfsgegevens, klanten, facturenlijst, wachtwoord-hash (als JSON)
//  - pdfs:     de factuur-PDF's (als base64-tekst)
// Lokaal (op de pc) bewaren we de PDF's daarnaast ook in deze map, zodat
// "Toon in map" en de iCloud-synchronisatie kunnen werken.
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

// Lees een waarde (object/array/tekst) uit de database, of de fallback.
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    await ensureSchema();
    const sql = db();
    const rows = (await sql`SELECT value FROM app_data WHERE key = ${key}`) as { value: T }[];
    if (rows.length === 0) return fallback;
    return rows[0].value;
  } catch (e) {
    console.error('readJson(' + key + ') mislukt:', e);
    return fallback;
  }
}

// Sla een waarde op (maakt aan of werkt bij).
export async function writeJson(key: string, value: unknown): Promise<void> {
  await ensureSchema();
  const sql = db();
  await sql`INSERT INTO app_data (key, value) VALUES (${key}, ${JSON.stringify(value)}::jsonb)
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
}

// Haal een PDF op uit de database.
export async function readPdf(filename: string): Promise<Buffer | null> {
  try {
    await ensureSchema();
    const sql = db();
    const rows = (await sql`SELECT data_base64 FROM pdfs WHERE filename = ${filename}`) as { data_base64: string }[];
    if (rows.length === 0) return null;
    return Buffer.from(rows[0].data_base64, 'base64');
  } catch (e) {
    console.error('readPdf mislukt:', e);
    return null;
  }
}

// Bewaar een PDF in de database.
export async function writePdf(filename: string, buf: Buffer): Promise<void> {
  await ensureSchema();
  const sql = db();
  const b64 = buf.toString('base64');
  await sql`INSERT INTO pdfs (filename, data_base64) VALUES (${filename}, ${b64})
            ON CONFLICT (filename) DO UPDATE SET data_base64 = EXCLUDED.data_base64`;
}

// Zoekt de map waar facturen ook naartoe gekopieerd worden zodat ze naar je
// telefoon synchroniseren (iCloud, of een andere sync-map die je instelt).
// Werkt alleen op je eigen pc; op de server is er geen sync-map (geeft null).
export function syncDir(): string | null {
  const candidates: string[] = [];
  if (process.env.FACTUUR_ICLOUD_MAP) candidates.push(process.env.FACTUUR_ICLOUD_MAP);
  const home = process.env.USERPROFILE || process.env.HOME || '';
  if (home) {
    candidates.push(path.join(home, 'iCloudDrive', 'Frisspits facturen'));
    candidates.push(path.join(home, 'iCloud Drive', 'Frisspits facturen'));
  }
  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir)) return dir;
      const base = path.dirname(dir);
      if (fs.existsSync(base)) { fs.mkdirSync(dir, { recursive: true }); return dir; }
    } catch {
      /* negeer en probeer de volgende */
    }
  }
  return null;
}
