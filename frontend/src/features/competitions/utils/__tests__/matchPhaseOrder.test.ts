import { describe, expect, it } from 'vitest';
import type { Match } from '@/shared/types/domain';
import { compareMatchesByPhaseRound, formatPhaseLabel } from '../matchPhaseOrder';

function makeMatch(partial: Partial<Match>): Match {
  return {
    id: partial.id ?? 1,
    competicao_id: partial.competicao_id ?? 1,
    fase: partial.fase ?? 'GRUPO_1',
    atleta_a_id: partial.atleta_a_id ?? 1,
    atleta_b_id: partial.atleta_b_id ?? 2,
    status: partial.status ?? 'AGENDADO',
    rodada: partial.rodada,
    ...partial
  };
}

describe('match phase order', () => {
  it('ordena por fase operacional e rodada', () => {
    const matches: Match[] = [
      makeMatch({ id: 5, fase: 'QUARTAS_DE_FINAL', rodada: 2 }),
      makeMatch({ id: 1, fase: 'GRUPO_2', rodada: 2 }),
      makeMatch({ id: 2, fase: 'GRUPO_1', rodada: 1 }),
      makeMatch({ id: 4, fase: 'QUARTAS_DE_FINAL', rodada: 1 }),
      makeMatch({ id: 6, fase: 'FINAL', rodada: 1 })
    ];

    const ordered = [...matches].sort(compareMatchesByPhaseRound);
    expect(ordered.map((m) => m.id)).toEqual([2, 1, 4, 5, 6]);
  });

  it('normaliza labels principais de fase', () => {
    expect(formatPhaseLabel('oitavas_de_final')).toBe('OITAVAS DE FINAL');
    expect(formatPhaseLabel('semi_final')).toBe('SEMIFINAL');
    expect(formatPhaseLabel('grupo_3')).toBe('GRUPO 3');
  });
});

