import { describe, expect, it } from 'vitest';
import { balanceGroupsByRating, createBracketWithByes, snakeGroupIndexes, splitOpenLevels } from '../useCases';
import type { Athlete, GroupStanding } from '@/shared/types/domain';

const athletes: Athlete[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nome: `Atleta ${i + 1}`,
  rating_atual: 3000 - i * 100,
  faixa_rating: 'A',
  ativo: 1
}));

describe('competition engine', () => {
  it('should generate snake indexes', () => {
    expect(snakeGroupIndexes(4, 10)).toEqual([0, 1, 2, 3, 3, 2, 1, 0, 0, 1]);
  });

  it('should balance groups by rating', () => {
    const groups = balanceGroupsByRating(athletes, 4);
    expect(groups[0].atletas[0].id).toBe(1);
    expect(groups[1].atletas[0].id).toBe(2);
    expect(groups[2].atletas[0].id).toBe(3);
    expect(groups[3].atletas[0].id).toBe(4);
  });

  it('should split SPING_OPEN levels A/B/C/D', () => {
    const standingsByGroup: Record<string, GroupStanding[]> = {
      'G01': [
        { grupo_id: 'G01', atleta_id: 1, vitorias: 4, derrotas: 0, saldo_sets: 8, saldo_pontos: 20 },
        { grupo_id: 'G01', atleta_id: 2, vitorias: 3, derrotas: 1, saldo_sets: 5, saldo_pontos: 10 },
        { grupo_id: 'G01', atleta_id: 3, vitorias: 2, derrotas: 2, saldo_sets: 1, saldo_pontos: 0 },
        { grupo_id: 'G01', atleta_id: 4, vitorias: 1, derrotas: 3, saldo_sets: -3, saldo_pontos: -8 },
        { grupo_id: 'G01', atleta_id: 5, vitorias: 0, derrotas: 4, saldo_sets: -7, saldo_pontos: -18 }
      ]
    };

    const byId = Object.fromEntries(athletes.map((a) => [a.id, a]));
    const levels = splitOpenLevels(standingsByGroup, byId);

    expect(levels.A.map((a) => a.id)).toEqual([1, 2]);
    expect(levels.B.map((a) => a.id)).toEqual([3]);
    expect(levels.C.map((a) => a.id)).toEqual([4]);
    expect(levels.D.map((a) => a.id)).toEqual([5]);
  });

  it('should create bracket with bye', () => {
    const bracket = createBracketWithByes(athletes.slice(0, 6));
    expect(bracket).toHaveLength(4);
    expect(bracket.some((m) => m.a?.bye || m.b?.bye)).toBe(true);
  });
});

