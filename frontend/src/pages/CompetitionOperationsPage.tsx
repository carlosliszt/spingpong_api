import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Badge, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

export function CompetitionOperationsPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const registrations = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const competition = useMemo(
    () => (competitions.data ?? []).find((c) => c.id === competitionId),
    [competitions.data, competitionId]
  );

  const registrationCount = useMemo(
    () => (registrations.data ?? []).filter((r) => r.competicao_id === competitionId).length,
    [registrations.data, competitionId]
  );

  const competitionMatches = useMemo(
    () => (matches.data ?? []).filter((m) => m.competicao_id === competitionId),
    [matches.data, competitionId]
  );

  const runAction = (label: string) => ({
    onSuccess: () => {
      showSuccess(`${label} executado com sucesso!`);
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['competitions'] });
    },
    onError: (error: any) => showError(error?.response?.data?.message || `Falha ao executar ${label}`)
  });

  const generateGroupsMutation = useMutation({
    mutationFn: () => services.generateBalancedGroups({ competitionId }),
    ...runAction('Gerar grupos balanceados')
  });

  const generateGroupMatchesMutation = useMutation({
    mutationFn: () => services.generateGroupMatches({ competitionId }),
    ...runAction('Gerar jogos de grupo')
  });

  const finalizeGroupsMutation = useMutation({
    mutationFn: () => services.finalizeGroups({ competitionId }),
    ...runAction('Finalizar grupos')
  });

  const generateKnockoutMutation = useMutation({
    mutationFn: () => services.generateKnockout({ competitionId }),
    ...runAction('Gerar mata-mata')
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-page">⚙️ Operações da Competição</h1>
        <p className="text-neutral-600">
          {competition?.nome || `Torneio #${id}`}
        </p>
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

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Card size="sm">
          <p className="text-xs text-neutral-600">📋 Tipo</p>
          <p className="text-lg font-bold text-neutral-900">{competition?.tipo === 'SPING_OPEN' ? '🏆' : '🍔'}</p>
        </Card>
        <Card size="sm">
          <p className="text-xs text-neutral-600">Status</p>
          <Badge variant={
            competition?.status === 'PLANEJADA' ? 'neutral' :
            competition?.status === 'EM_ANDAMENTO' ? 'warning' :
            competition?.status === 'FINALIZADA' ? 'success' :
            'danger'
          }>
            {competition?.status}
          </Badge>
        </Card>
        <Card size="sm">
          <p className="text-xs text-neutral-600">👥 Inscritos</p>
          <p className="text-lg font-bold text-neutral-900">{registrationCount}</p>
        </Card>
        <Card size="sm">
          <p className="text-xs text-neutral-600">🎮 Jogos</p>
          <p className="text-lg font-bold text-neutral-900">{competitionMatches.length}</p>
        </Card>
        <Card size="sm">
          <p className="text-xs text-neutral-600">✓ Finalizados</p>
          <p className="text-lg font-bold text-success-600">
            {competitionMatches.filter(m => m.status === 'FINALIZADO' || m.status === 'W_O').length}
          </p>
        </Card>
      </div>

      {/* Automation Section */}
      <Card>
        <Section title="⚡ Automação & Ações" subtitle="Operações do sistema">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="primary"
              onClick={() => generateGroupsMutation.mutate()}
              isLoading={generateGroupsMutation.isPending}
              className="justify-center"
            >
              📊 Gerar Grupos Balanceados
            </Button>
            <Button
              variant="primary"
              onClick={() => generateGroupMatchesMutation.mutate()}
              isLoading={generateGroupMatchesMutation.isPending}
              className="justify-center"
            >
              🎮 Gerar Jogos de Grupo
            </Button>
            <Button
              variant="success"
              onClick={() => finalizeGroupsMutation.mutate()}
              isLoading={finalizeGroupsMutation.isPending}
              className="justify-center"
            >
              ✓ Finalizar Grupos
            </Button>
            <Button
              variant="primary"
              onClick={() => generateKnockoutMutation.mutate()}
              isLoading={generateKnockoutMutation.isPending}
              className="justify-center"
            >
              🏆 Gerar Mata-Mata
            </Button>
          </div>
        </Section>
      </Card>

      {/* Navigation Section */}
      <Card>
        <Section title="📍 Navegação Rápida" subtitle="Acesso direto aos módulos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link to={`/competicoes/${competitionId}/inscricoes`}>
              <Button variant="secondary" isBlock>
                📝 Inscrições
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/grupos`}>
              <Button variant="secondary" isBlock>
                📊 Ver Grupos
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/resultados`}>
              <Button variant="secondary" isBlock>
                📋 Lançar Resultados
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/resultados/consulta`}>
              <Button variant="secondary" isBlock>
                🔍 Consultar Resultados
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/mata-mata`}>
              <Button variant="secondary" isBlock>
                🏆 Ver Mata-Mata
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/open-levels`}>
              <Button variant="secondary" isBlock>
                📈 Níveis Open
              </Button>
            </Link>
          </div>
        </Section>
      </Card>

      {/* Back Button */}
      <Link to={`/competicoes`}>
        <Button variant="secondary" isBlock>
          ↩️ Voltar para Torneios
        </Button>
      </Link>
    </div>
  );
}

