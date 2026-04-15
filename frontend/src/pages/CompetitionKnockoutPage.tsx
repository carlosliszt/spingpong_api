import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { KnockoutBracket } from '@/features/competitions/components/KnockoutBracket';
import { exportKnockoutBracketPdf } from '@/features/competitions/utils/exportKnockoutBracketPdf';

export function CompetitionKnockoutPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportFeedback, setExportFeedback] = useState('');

  const bracket = useQuery({
    queryKey: ['bracket', competitionId],
    queryFn: () => services.getBracket(competitionId),
    enabled: Number.isFinite(competitionId)
  });
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });
  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const generateMutation = useMutation({
    mutationFn: () => services.generateKnockout({ competitionId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bracket', competitionId] })
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Mata-mata da competicao #{id}</h1>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
          Gerar mata-mata
        </button>
        <button
          className="btn-secondary"
          disabled={isExportingPdf}
          onClick={async () => {
            try {
              setIsExportingPdf(true);
              setExportFeedback('');

              const competition = (competitions.data ?? []).find((c) => c.id === competitionId);
              const knockoutMatches = (matches.data ?? []).filter(
                (m) => m.competicao_id === competitionId && !String(m.fase ?? '').toUpperCase().includes('GRUPO')
              );

              const matchesWithSets = await Promise.all(
                knockoutMatches.map(async (match) => {
                  if (match.status !== 'FINALIZADO' && match.status !== 'W_O') {
                    return match;
                  }

                  try {
                    const sets = await services.getSetsByMatch(match.id);
                    return { ...match, sets };
                  } catch {
                    return match;
                  }
                })
              );

              exportKnockoutBracketPdf({
                competitionName: competition?.nome ?? `Competicao ${id}`,
                matches: matchesWithSets,
                athleteNameById: Object.fromEntries((athletes.data ?? []).map((a) => [a.id, a.nome]))
              });
            } catch (error: any) {
              setExportFeedback(error?.message || 'Falha ao exportar PDF do chaveamento.');
            } finally {
              setIsExportingPdf(false);
            }
          }}
        >
          {isExportingPdf ? 'Exportando PDF...' : 'Exportar chaveamento (PDF)'}
        </button>
      </div>
      {exportFeedback ? <p className="text-sm text-red-700">{exportFeedback}</p> : null}
      {bracket.data?.length ? (
        <KnockoutBracket matches={bracket.data} />
      ) : (
        <section className="card text-sm text-slate-600">Sem chave gerada para esta competicao.</section>
      )}
    </div>
  );
}
