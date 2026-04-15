import type { Match } from '@/shared/types/domain';
import { compareMatchesByPhaseRound, formatPhaseLabel, getPhaseMeta } from './matchPhaseOrder';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function buildScore(match: Match) {
  const sets = match.sets ?? [];
  if (!sets.length) return '-';

  let aWins = 0;
  let bWins = 0;
  for (const set of sets) {
    const a = Number(set.pontos_atleta_a ?? set.pontos_a ?? 0);
    const b = Number(set.pontos_atleta_b ?? set.pontos_b ?? 0);
    if (a > b) aWins += 1;
    if (b > a) bWins += 1;
  }

  return `${aWins}-${bWins}`;
}

function formatMatchStatus(status?: string) {
  const upper = String(status ?? '').toUpperCase();
  if (upper === 'FINALIZADO') return 'FINALIZADO';
  if (upper === 'W_O') return 'W.O.';
  if (upper === 'EM_ANDAMENTO') return 'EM ANDAMENTO';
  if (upper === 'CANCELADO') return 'CANCELADO';
  return 'AGENDADO';
}

function parseByeIds(observacoes?: string | null) {
  const text = String(observacoes ?? '');
  const match = text.match(/BYE_IDS:([0-9,]+)/);
  if (!match) return [] as number[];

  return match[1]
    .split(',')
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function normalizeStatus(status?: string) {
  return String(status ?? '').toUpperCase();
}

function resolveAthleteName(
  athleteId?: number | null,
  athleteName?: string | null,
  athleteNameById?: Record<number, string>
) {
  if (athleteName) return athleteName;
  if (athleteId && athleteNameById?.[athleteId]) return athleteNameById[athleteId];
  if (athleteId) return `Atleta ${athleteId}`;
  return 'A DEFINIR';
}

function splitMatchScore(match: Match): { a: string; b: string } {
  const upperStatus = normalizeStatus(match.status);
  if (upperStatus === 'W_O' && match.vencedor_id) {
    const winnerIsA = Number(match.vencedor_id) === Number(match.atleta_a_id);
    return { a: winnerIsA ? '3' : '--', b: winnerIsA ? '--' : '3' };
  }

  const score = buildScore(match);
  if (score === '-') return { a: '--', b: '--' };
  const [a, b] = score.split('-');
  return { a: a || '--', b: b || '--' };
}

function detectOpenCategory(match: Match): 'A' | 'B' | 'C' | 'D' | null {
  const phase = String(match.fase ?? '').toUpperCase();
  const obs = String(match.observacoes ?? '').toUpperCase();

  const fromPhase = phase.match(/OPEN_([ABCD])_/);
  if (fromPhase?.[1]) return fromPhase[1] as 'A' | 'B' | 'C' | 'D';

  const fromObs = obs.match(/NIVEL_([ABCD])/);
  if (fromObs?.[1]) return fromObs[1] as 'A' | 'B' | 'C' | 'D';

  return null;
}

export function exportKnockoutBracketPdf(args: {
  competitionName: string;
  matches: Match[];
  athleteNameById?: Record<number, string>;
}) {
  const knockoutMatches = args.matches
    .filter((m) => !String(m.fase ?? '').toUpperCase().includes('GRUPO'))
    .sort(compareMatchesByPhaseRound);

  function buildColumns(pageMatches: Match[]) {
    const phases = Array.from(
      pageMatches.reduce((acc, match) => {
        const label = formatPhaseLabel(match.fase);
        if (!acc.has(label)) acc.set(label, [] as Match[]);
        acc.get(label)?.push(match);
        return acc;
      }, new Map<string, Match[]>())
    ).sort((a, b) => {
      const rankA = getPhaseMeta(a[1][0]?.fase).rank;
      const rankB = getPhaseMeta(b[1][0]?.fase).rank;
      return rankA - rankB;
    });

    return phases
      .map(([phase, phaseMatches]) => {
      const byeIds = Array.from(new Set(phaseMatches.flatMap((m) => parseByeIds(m.observacoes)))).sort((a, b) => a - b);

      const byeCards = byeIds
        .map(
          (athleteId, index) => {
            const athleteLabel = escapeHtml(args.athleteNameById?.[athleteId] ?? `Atleta ${athleteId}`);
            return `
            <article class="match-card bye-card">
              <div class="meta">BYE #${index + 1}</div>
              <div class="duel-row"><span class="athlete-name">${athleteLabel}</span><strong class="score-cell">--</strong></div>
              <div class="duel-row"><span class="athlete-name">BYE</span><strong class="score-cell">--</strong></div>
              <div class="sub-meta">Classificado automaticamente</div>
            </article>`;
          }
        )
        .join('');

        const cards = phaseMatches
        .sort(compareMatchesByPhaseRound)
        .map((match) => {
          const athleteAName = resolveAthleteName(match.atleta_a_id, match.atleta_a_nome, args.athleteNameById);
          const athleteBName = resolveAthleteName(match.atleta_b_id, match.atleta_b_nome, args.athleteNameById);
          const athleteA = escapeHtml(athleteAName);
          const athleteB = escapeHtml(athleteBName);
          const score = splitMatchScore(match);
          const hasDefinedPlayers = Boolean(match.atleta_a_id) || Boolean(match.atleta_b_id);
          const when = escapeHtml(formatDateTime(match.data_hora_prevista));
          const round = Number(match.rodada ?? 0) || '-';
          const winnerId = Number(match.vencedor_id || 0);
          const winnerIsA = winnerId > 0 && winnerId === Number(match.atleta_a_id);
          const winnerIsB = winnerId > 0 && winnerId === Number(match.atleta_b_id);
          const rowAClass = winnerIsA ? 'duel-row row-winner' : winnerIsB ? 'duel-row row-loser' : 'duel-row';
          const rowBClass = winnerIsB ? 'duel-row row-winner' : winnerIsA ? 'duel-row row-loser' : 'duel-row';
          const scoreAClass = winnerIsA ? 'score-cell score-win' : winnerIsB ? 'score-cell score-lose' : 'score-cell';
          const scoreBClass = winnerIsB ? 'score-cell score-win' : winnerIsA ? 'score-cell score-lose' : 'score-cell';
          const statusLabel = escapeHtml(formatMatchStatus(match.status));

          return `
            <article class="match-card">
              <div class="meta">Jogo #${match.id} - Rodada ${round}</div>
              <div class="${rowAClass}"><span class="athlete-name">${athleteA}</span><strong class="${scoreAClass}">${escapeHtml(score.a)}</strong></div>
              <div class="${rowBClass}"><span class="athlete-name">${athleteB}</span><strong class="${scoreBClass}">${escapeHtml(score.b)}</strong></div>
              <div class="result-line">${hasDefinedPlayers ? statusLabel : 'A DEFINIR'}</div>
              <div class="sub-meta">${when}</div>
            </article>`;
        })
        .join('');

      return `
        <section class="phase-column">
          <h2>${escapeHtml(phase)}</h2>
          ${byeCards}${cards || (!byeCards ? '<p class="empty">Sem jogos nesta fase.</p>' : '')}
        </section>`;
      })
      .join('');
  }

  const hasOpenCategories = knockoutMatches.some((m) => Boolean(detectOpenCategory(m)));
  const categoryOrder: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  const pages = hasOpenCategories
    ? categoryOrder
        .map((category) => {
          const categoryMatches = knockoutMatches.filter((m) => detectOpenCategory(m) === category);
          if (!categoryMatches.length) return '';

          const columns = buildColumns(categoryMatches);
          return `
            <section class="page">
              <h1>Chaveamento - ${escapeHtml(args.competitionName)} - Categoria ${category}</h1>
              ${columns ? `<div class="board">${columns}</div>` : '<p>Nenhum jogo de mata-mata encontrado.</p>'}
            </section>`;
        })
        .filter(Boolean)
        .join('')
    : `
      <section class="page">
        <h1>Chaveamento - ${escapeHtml(args.competitionName)}</h1>
        ${buildColumns(knockoutMatches) ? `<div class="board">${buildColumns(knockoutMatches)}</div>` : '<p>Nenhum jogo de mata-mata encontrado.</p>'}
      </section>`;

  const html = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Chaveamento - ${escapeHtml(args.competitionName)}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; }
          h1 { margin: 0 0 12px; font-size: 20px; }
          .page { page-break-after: always; }
          .page:last-child { page-break-after: auto; }
          .board {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            align-items: start;
          }
          .phase-column { border: 1px solid #cbd5e1; padding: 8px; border-radius: 6px; }
          .phase-column h2 {
            margin: 0 0 10px;
            font-size: 14px;
            text-transform: uppercase;
            background: #f1f5f9;
            padding: 6px;
            border: 1px solid #cbd5e1;
          }
          .match-card {
            border: 1px solid #94a3b8;
            margin-bottom: 8px;
            padding: 4px;
            page-break-inside: avoid;
            background: #ffffff;
          }
          .bye-card { background: #f8fafc; border-style: dashed; }
          .meta { font-size: 11px; color: #334155; margin-bottom: 4px; }
          .duel-row {
            display: grid;
            grid-template-columns: 1fr 30px;
            align-items: center;
            min-height: 20px;
            font-size: 12px;
            border-bottom: 1px solid #d1d5db;
            background: #dbe7e8;
          }
          .duel-row:last-of-type { border-bottom: none; }
          .row-winner { background: #72b5ac; }
          .row-loser { background: #b7bdc2; }
          .athlete-name { padding: 2px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .score-cell {
            text-align: center;
            color: #334155;
            border-left: 1px solid #94a3b8;
            font-size: 12px;
            min-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .score-win { color: #0a7a1a; }
          .score-lose { color: #b91c1c; }
          .result-line { font-size: 11px; margin-top: 4px; padding: 0 2px; color: #334155; }
          .sub-meta { font-size: 11px; color: #475569; margin-top: 4px; }
          .empty { font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        ${pages || '<section class="page"><h1>Chaveamento</h1><p>Nenhum jogo de mata-mata encontrado.</p></section>'}
      </body>
    </html>`;

  const printWindow = window.open('', '_blank', 'width=1400,height=900');
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

