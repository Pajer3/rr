import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/factuur/store';
import type { GlasAdres } from '@/lib/factuur/glas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIGRATION_KEY = 'glas_correcties_2026_07_20';

function matches(address: string, name: string) {
  return address.trim().toLocaleLowerCase('nl-NL').includes(name.toLocaleLowerCase('nl-NL'));
}

// Eenmalige verwerking van de gegevens die door de beheerder zijn bevestigd.
// Daarna kunnen alle velden vrij via het scherm worden aangepast.
async function applyConfirmedCorrections(list: GlasAdres[]) {
  if (await readJson<boolean>(MIGRATION_KEY, false)) return list;

  const firstAppointments = [
    ['Streeksel 8', 2],
    ['Laakboulevard 146', 3],
    ['Hoornplantsoen 46', 3],
    ['Marconistraat 42a', 3],
    ['Sint Pietersberg 8', 3],
    ['Lient 69', 2],
  ] as const;

  for (const [name, every] of firstAppointments) {
    const item = list.find((entry) => matches(entry.address, name));
    if (item) {
      item.every = every;
      item.unit = 'maanden';
      item.plannedDate = null;
    }
  }

  const finnmark = list.find((entry) => matches(entry.address, 'Finnmark 7'));
  if (finnmark) {
    finnmark.every = 2;
    finnmark.unit = 'maanden';
    finnmark.lastDone = null;
    finnmark.plannedDate = null;
    finnmark.note = (finnmark.note || '€32').replace(/€\s*32\s*i\b/gi, '€32');
  }

  const bergenboulevard = list.find((entry) => matches(entry.address, 'Bergenboulevard 34'));
  if (bergenboulevard) {
    bergenboulevard.every = 2;
    bergenboulevard.unit = 'maanden';
    bergenboulevard.lastDone = '2026-07-03';
    bergenboulevard.plannedDate = null;
    bergenboulevard.history = Array.from(new Set([...(bergenboulevard.history || []), '2026-07-03'])).sort();
  }

  await writeJson('glasadressen', list);
  await writeJson(MIGRATION_KEY, true);
  return list;
}

export async function GET() {
  try {
    const list = await readJson<GlasAdres[]>('glasadressen', []);
    return NextResponse.json(await applyConfirmedCorrections(list));
  } catch (error) {
    console.error('Glasbewassingsgegevens laden mislukt:', error);
    return NextResponse.json({ error: 'De glasbewassingsgegevens konden niet worden geladen.' }, { status: 500 });
  }
}
