import type { Athlete, BracketEntry, BracketMatch, GroupStanding } from '@/shared/types/domain';
import type { OpenLevelsMap, SeededGroup } from './types';

type OpenLevelPositions = {
  A: number[];
  B: number[];
  C: number[];
  D: number[];
};

function nextPowerOfTwo(n: number) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

export function snakeGroupIndexes(groupsCount: number, totalSlots: number): number[] {
  const forward = Array.from({ length: groupsCount }, (_, i) => i);
  const backward = [...forward].reverse();
  const cycle = [...forward, ...backward];
  const result: number[] = [];

  while (result.length < totalSlots) {
    for (const idx of cycle) {
      if (result.length >= totalSlots) break;
      result.push(idx);
    }
  }

  return result;
}

export function balanceGroupsByRating(athletes: Athlete[], groupsCount: number): SeededGroup[] {
  const sorted = [...athletes].sort((a, b) => b.rating_atual - a.rating_atual);
  const groups: SeededGroup[] = Array.from({ length: groupsCount }, (_, i) => ({
    id: `G${String(i + 1).padStart(2, '0')}`,
    nome: `Grupo ${String(i + 1).padStart(2, '0')}`,
    atletas: []
  }));

  const indexes = snakeGroupIndexes(groupsCount, sorted.length);
  sorted.forEach((athlete, i) => groups[indexes[i]].atletas.push(athlete));

  return groups;
}

export function splitOpenLevels(
  standingsByGroup: Record<string, GroupStanding[]>,
  athletesById: Record<number, Athlete>,
  levelPositions: OpenLevelPositions = { A: [1, 2], B: [3], C: [4], D: [5] }
): OpenLevelsMap {
  const levels: OpenLevelsMap = { A: [], B: [], C: [], D: [] };

  Object.values(standingsByGroup).forEach((standing) => {
    const sorted = [...standing].sort((a, b) => {
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
      if (b.saldo_sets !== a.saldo_sets) return b.saldo_sets - a.saldo_sets;
      return b.saldo_pontos - a.saldo_pontos;
    });

    const pushLevelByPositions = (level: keyof OpenLevelsMap, positions: number[]) => {
      positions.forEach((position) => {
        const row = sorted[position - 1];
        const athlete = row ? athletesById[row.atleta_id] : undefined;
        if (athlete) {
          levels[level].push(athlete);
        }
      });
    };

    pushLevelByPositions('A', levelPositions.A || []);
    pushLevelByPositions('B', levelPositions.B || []);
    pushLevelByPositions('C', levelPositions.C || []);
    pushLevelByPositions('D', levelPositions.D || []);
  });

  return levels;
}

export function createBracketWithByes(entries: Athlete[]): BracketMatch[] {
  if (!entries.length) return [];

  const size = nextPowerOfTwo(entries.length);
  const seeds = Array.from({ length: size }, (_, i) => i + 1);
  const seededEntries: Record<number, BracketEntry> = {};

  seeds.forEach((seed, index) => {
    const athlete = entries[index];
    seededEntries[seed] = athlete ? { seed, atleta: athlete } : { seed, bye: true };
  });

  const firstRound: BracketMatch[] = [];
  for (let i = 0; i < size / 2; i += 1) {
    const aSeed = i + 1;
    const bSeed = size - i;
    firstRound.push({
      id: `R1-M${i + 1}`,
      round: 1,
      slot: i + 1,
      a: seededEntries[aSeed],
      b: seededEntries[bSeed],
      winnerSeed: seededEntries[bSeed].bye ? aSeed : seededEntries[aSeed].bye ? bSeed : undefined
    });
  }

  return firstRound;
}

