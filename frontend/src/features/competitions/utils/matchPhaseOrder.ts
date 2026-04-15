import type { Match } from '@/shared/types/domain';

type CanonicalPhase = 'GRUPO' | 'OITAVAS' | 'QUARTAS' | 'SEMI' | 'FINAL' | 'OUTROS';

type PhaseMeta = {
  canonical: CanonicalPhase;
  rank: number;
  levelRank: number;
  groupOrder: number;
};

function toInt(value: string | undefined) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function detectLevelRank(phase: string) {
  if (phase.includes('NIVEL_A') || phase.includes('LEVEL_A')) return 1;
  if (phase.includes('NIVEL_B') || phase.includes('LEVEL_B')) return 2;
  if (phase.includes('NIVEL_C') || phase.includes('LEVEL_C')) return 3;
  if (phase.includes('NIVEL_D') || phase.includes('LEVEL_D')) return 4;
  return 9;
}

function detectGroupOrder(phase: string) {
  const groupMatch = phase.match(/GRUPO[_\s-]?(\d+)/);
  return toInt(groupMatch?.[1]);
}

export function getPhaseMeta(rawPhase?: string | null): PhaseMeta {
  const phase = String(rawPhase ?? '').toUpperCase();
  const levelRank = detectLevelRank(phase);
  const groupOrder = detectGroupOrder(phase);

  if (phase.includes('GRUPO')) {
    return { canonical: 'GRUPO', rank: 10, levelRank, groupOrder };
  }
  if (phase.includes('OITAVAS') || phase.includes('ROUND_OF_16')) {
    return { canonical: 'OITAVAS', rank: 20, levelRank, groupOrder };
  }
  if (phase.includes('QUARTAS') || phase.includes('ROUND_OF_8')) {
    return { canonical: 'QUARTAS', rank: 30, levelRank, groupOrder };
  }
  if (phase.includes('SEMI')) {
    return { canonical: 'SEMI', rank: 40, levelRank, groupOrder };
  }
  if (phase.endsWith('FINAL') || phase === 'FINAL') {
    return { canonical: 'FINAL', rank: 50, levelRank, groupOrder };
  }

  return { canonical: 'OUTROS', rank: 60, levelRank, groupOrder };
}

export function compareMatchesByPhaseRound(a: Match, b: Match) {
  const phaseA = getPhaseMeta(a.fase);
  const phaseB = getPhaseMeta(b.fase);

  if (phaseA.levelRank !== phaseB.levelRank) return phaseA.levelRank - phaseB.levelRank;
  if (phaseA.rank !== phaseB.rank) return phaseA.rank - phaseB.rank;
  if (phaseA.groupOrder !== phaseB.groupOrder) return phaseA.groupOrder - phaseB.groupOrder;

  const roundA = Number(a.rodada ?? 0);
  const roundB = Number(b.rodada ?? 0);
  if (roundA !== roundB) return roundA - roundB;

  return a.id - b.id;
}

export function formatPhaseLabel(rawPhase?: string | null) {
  const meta = getPhaseMeta(rawPhase);
  if (meta.canonical === 'GRUPO' && meta.groupOrder > 0) return `GRUPO ${meta.groupOrder}`;

  if (meta.canonical === 'GRUPO') return 'GRUPO';
  if (meta.canonical === 'OITAVAS') return 'OITAVAS DE FINAL';
  if (meta.canonical === 'QUARTAS') return 'QUARTAS DE FINAL';
  if (meta.canonical === 'SEMI') return 'SEMIFINAL';
  if (meta.canonical === 'FINAL') return 'FINAL';

  return String(rawPhase ?? 'OUTROS');
}

