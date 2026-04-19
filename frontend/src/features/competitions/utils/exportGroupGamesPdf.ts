import type { Match } from '@/shared/types/domain';
import type { SeededGroup } from '@/features/competition-engine/types';

type StandingRow = {
  atleta_id: number;
  nome_atleta?: string;
  vitorias: number;
  derrotas: number;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function exportGroupGamesPdf(args: {
  competitionName: string;
  groups: SeededGroup[];
  standingsByGroup: Record<string, StandingRow[]>;
  matches: Match[];
}) {
  const { competitionName, groups, standingsByGroup, matches } = args;

  const sections = groups
    .map((group, index) => {
      // Filtrar jogos por FASE (GRUPO_G01, GRUPO_G02, etc.) em vez de by atletas
      // Isso garante que pegamos TODOS os jogos do grupo, não apenas os que matcheiam os IDs locais
      const groupMatches = matches.filter(
        (m) => {
          const faseUpper = String(m.fase || '').toUpperCase();
          const groupIdFromPhase = group.id.toUpperCase();
          return faseUpper.includes(`GRUPO_${groupIdFromPhase}`);
        }
      );

      const standings = standingsByGroup[group.id] ?? [];

      const standingsRows = standings.length
        ? standings
            .map(
              (row, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(String(row.nome_atleta ?? row.atleta_id))}</td>
                  <td>${row.vitorias}</td>
                  <td>${row.derrotas}</td>
                </tr>`
            )
            .join('')
        : group.atletas
            .map(
              (athlete, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${escapeHtml(athlete.nome)}</td>
                  <td></td>
                  <td></td>
                </tr>`
            )
            .join('');

      const gameRows = groupMatches
        .map(
          (game, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>
                ${escapeHtml(String(game.atleta_a_nome ?? game.atleta_a_id))}
                &nbsp;&nbsp;___, ___, ___, ___, ___&nbsp;&nbsp;x&nbsp;&nbsp;___, ___, ___, ___, ___&nbsp;&nbsp;
                ${escapeHtml(String(game.atleta_b_nome ?? game.atleta_b_id))}
              </td>
            </tr>`
        )
        .join('');

      return `
        <section class="page">
          <h1>${escapeHtml(competitionName)} - Grupo ${String(index + 1).padStart(2, '0')}</h1>

          <h2>Classificacao do grupo</h2>
          <table>
            <thead>
              <tr><th>#</th><th>Jogador</th><th>V</th><th>D</th></tr>
            </thead>
            <tbody>${standingsRows}</tbody>
          </table>

          <h2>Jogos do grupo (melhor de 5)</h2>
          <table>
            <thead>
              <tr>
                <th>Jogo</th><th>Linha para preenchimento (melhor de 5)</th>
              </tr>
            </thead>
            <tbody>${gameRows || '<tr><td colspan="2">Sem jogos gerados para este grupo.</td></tr>'}</tbody>
          </table>
        </section>`;
    })
    .join('');

  const html = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Exportacao de grupos - ${escapeHtml(competitionName)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; }
          .page { page-break-after: always; margin: 20px 0; }
          .page:last-child { page-break-after: auto; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          h2 { font-size: 14px; margin: 14px 0 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>${sections}</body>
    </html>`;

  const printWindow = window.open('', '_blank', 'width=1200,height=900');
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

