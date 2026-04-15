import type { Match } from '@/shared/types/domain';

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

export function exportGroupMatchStubsPdf(args: {
  competitionName: string;
  matches: Match[];
}) {
  const sortedMatches = [...args.matches].sort((a, b) => {
    const phaseCompare = String(a.fase || '').localeCompare(String(b.fase || ''));
    if (phaseCompare !== 0) return phaseCompare;
    return a.id - b.id;
  });

  const sections = sortedMatches
    .map((match) => {
      const athleteA = escapeHtml(String(match.atleta_a_nome ?? `Atleta ${match.atleta_a_id}`));
      const athleteB = escapeHtml(String(match.atleta_b_nome ?? `Atleta ${match.atleta_b_id}`));
      const phase = escapeHtml(String(match.fase || '-'));
      const group = escapeHtml(String(match.grupo_id ?? '-'));
      const schedule = escapeHtml(formatDateTime(match.data_hora_prevista));

      return `
        <section class="page">
          <h1>${escapeHtml(args.competitionName)}</h1>
          <h2>Canhoto de jogo - ID ${match.id}</h2>
          <p><strong>Fase:</strong> ${phase}</p>
          <p><strong>Grupo:</strong> ${group}</p>
          <p><strong>Horario previsto:</strong> ${schedule}</p>

          <div class="scoreline">
            <span class="athlete">${athleteA}</span>
            <span class="sets">___, ___, ___, ___, ___ x ___, ___, ___, ___, ___</span>
            <span class="athlete athlete-right">${athleteB}</span>
          </div>

          <div class="footer-fields">
            <p><strong>Vencedor:</strong> ____________________________________________</p>
            <p><strong>Observacoes:</strong> _________________________________________</p>
            <p>______________________________________________________________</p>
          </div>
        </section>`;
    })
    .join('');

  const html = `
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Canhotos de jogos - ${escapeHtml(args.competitionName)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; }
          .page { page-break-after: always; min-height: 95vh; padding: 24px; box-sizing: border-box; }
          .page:last-child { page-break-after: auto; }
          h1 { margin: 0 0 10px; font-size: 22px; }
          h2 { margin: 0 0 14px; font-size: 18px; }
          p { margin: 0 0 8px; font-size: 14px; }
          .scoreline { margin-top: 28px; padding: 16px; border: 1px solid #cbd5e1; }
          .athlete { font-size: 18px; font-weight: bold; display: block; margin-bottom: 10px; }
          .athlete-right { margin-top: 10px; margin-bottom: 0; }
          .sets { font-size: 16px; letter-spacing: 0.3px; }
          .footer-fields { margin-top: 36px; }
        </style>
      </head>
      <body>
        ${sections || '<section class="page"><h1>Sem jogos para exportar.</h1></section>'}
      </body>
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

