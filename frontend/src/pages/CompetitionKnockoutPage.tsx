import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { KnockoutBracket } from '@/features/competitions/components/KnockoutBracket';

export function CompetitionKnockoutPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();

  const bracket = useQuery({
    queryKey: ['bracket', competitionId],
    queryFn: () => services.getBracket(competitionId),
    enabled: Number.isFinite(competitionId)
  });

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
      </div>
      {bracket.data?.length ? (
        <KnockoutBracket matches={bracket.data} />
      ) : (
        <section className="card text-sm text-slate-600">Sem chave gerada para esta competicao.</section>
      )}
    </div>
  );
}
