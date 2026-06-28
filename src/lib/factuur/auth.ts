import crypto from 'crypto';
import { readJson, writeJson } from './store';

// Naam van de inlog-cookie en helpers voor de beveiliging.
export const COOKIE_NAME = 'frisspits_factuur';

// Het wachtwoord wordt versleuteld (gehasht) in de database bewaard, onder de
// sleutel 'wachtwoord-hash'. Niemand kan het wachtwoord eruit aflezen.

// De geheime sessietoken staat in de instellingen (FACTUUR_SESSIE_TOKEN).
export function sessieToken(): string {
  return process.env.FACTUUR_SESSIE_TOKEN || '';
}

// Controleer of de meegegeven cookiewaarde geldig is.
export function isIngelogd(cookieValue: string | undefined): boolean {
  const token = sessieToken();
  return !!token && cookieValue === token;
}

// Versleutel een wachtwoord met scrypt en een willekeurig zout.
function maakHash(wachtwoord: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(wachtwoord, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

// Vergelijk een ingevoerd wachtwoord met de opgeslagen hash (tijd-constant).
export async function wachtwoordKlopt(ingevoerd: string): Promise<boolean> {
  const stored = await readJson<string>('wachtwoord-hash', '');
  if (!stored || typeof ingevoerd !== 'string' || !ingevoerd) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  let verwacht: Buffer;
  let afgeleid: Buffer;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    verwacht = Buffer.from(hashHex, 'hex');
    afgeleid = crypto.scryptSync(ingevoerd, salt, verwacht.length);
  } catch {
    return false;
  }
  return afgeleid.length === verwacht.length && crypto.timingSafeEqual(afgeleid, verwacht);
}

// Sla een nieuw wachtwoord (versleuteld) op in de database.
export async function zetWachtwoord(nieuw: string): Promise<void> {
  await writeJson('wachtwoord-hash', maakHash(nieuw));
}
