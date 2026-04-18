import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { KnockoutBracket } from '@/features/competitions/components/KnockoutBracket';
import { exportKnockoutBracketPdf } from '@/features/competitions/utils/exportKnockoutBracketPdf';
import { Button, Card, Section, Alert, Badge, EmptyState } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

export function CompetitionKnockoutPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const { feedback, showSuccess, showError, clear } = useFeedback();

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bracket', competitionId] });
      showSuccess('Mata-mata gerado com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao gerar mata-mata')
  });

  const competition = (competitions.data ?? []).find((c) => c.id === competitionId);
  const knockoutMatches = (matches.data ?? []).filter(
    (m) => m.competicao_id === competitionId && !String(m.fase ?? '').toUpperCase().includes('GRUPO')
  );

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);

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

      showSuccess('PDF exportado com sucesso!');
    } catch (error: any) {
      showError(error?.message || 'Falha ao exportar PDF do chaveamento');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-page">🏆 Mata-Mata da Competição</h1>
          <p className="text-neutral-600">
            {competition ? `${competition.nome}` : `Torneio #${id}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/competicoes/${id}/operacoes`}>
            <Button variant="secondary">↩️ Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert
          type={feedback.type === 'success' ? 'success' : 'danger'}
          onClose={clear}
        >
          {feedback.msg}
        </Alert>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-900">Gerar Mata-Mata</p>
              <p className="text-sm text-neutral-600">Crie o chaveamento eliminatório</p>
            </div>
            <Button
              variant="primary"
              onClick={() => generateMutation.mutate()}
              isLoading={generateMutation.isPending}
            >
              ✨ Gerar
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-neutral-900">Exportar Chaveamento</p>
              <p className="text-sm text-neutral-600">Baixe em PDF com resultados</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleExportPdf}
              isLoading={isExportingPdf}
              disabled={!knockoutMatches.length}
            >
              📥 PDF
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats */}
      {bracket.data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card size="sm">
            <div className="space-y-1">
              <p className="text-xs text-neutral-600">🎮 Jogos Totais</p>
              <p className="text-2xl font-bold text-neutral-900">{knockoutMatches.length}</p>
            </div>
          </Card>
          <Card size="sm">
            <div className="space-y-1">
              <p className="text-xs text-neutral-600">✓ Finalizados</p>
              <p className="text-2xl font-bold text-success-600">
                {knockoutMatches.filter(m => m.status === 'FINALIZADO' || m.status === 'W_O').length}
              </p>
            </div>
          </Card>
          <Card size="sm">
            <div className="space-y-1">
              <p className="text-xs text-neutral-600">⏳ Pendentes</p>
              <p className="text-2xl font-bold text-warning-600">
                {knockoutMatches.filter(m => m.status !== 'FINALIZADO' && m.status !== 'W_O').length}
              </p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Bracket */}
      <Card>
        <Section title="Chaveamento" subtitle={bracket.isLoading ? 'Carregando...' : undefined}>
          {bracket.isLoading ? (
            <div className="flex-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
            </div>
          ) : bracket.data?.length ? (
            <KnockoutBracket matches={bracket.data} />
          ) : (
            <EmptyState
              icon="🏆"
              title="Nenhuma chave gerada"
              description="Clique em 'Gerar' acima para criar o chaveamento eliminatório"
            />
          )}
        </Section>
      </Card>
    </div>
  );
}
