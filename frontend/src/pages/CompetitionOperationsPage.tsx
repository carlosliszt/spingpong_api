import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { balanceGroupsByRating } from '@/features/competition-engine/useCases';
import { Button, Card, Section, Badge, Alert, Input } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';
import type { Athlete } from '@/shared/types/domain';

const toGroupCode = (index: number) => `G${String(index + 1).padStart(2, '0')}`;

export function CompetitionOperationsPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();
  const { feedback, showSuccess, showError, clear } = useFeedback();
  const [groupMode, setGroupMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [manualGroupsCount, setManualGroupsCount] = useState(1);
  const [manualAssignments, setManualAssignments] = useState<Record<number, string>>({});

  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const registrations = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const competition = useMemo(
    () => (competitions.data ?? []).find((c) => c.id === competitionId),
    [competitions.data, competitionId]
  );

  const openConfig = useQuery({
    queryKey: ['sping-open-config-active', 'ops', competitionId],
    enabled: competition?.tipo === 'SPING_OPEN',
    queryFn: async () => {
      try {
        return await services.getActiveSpingOpenConfig();
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    }
  });

  const athletesById = useMemo(
    () => new Map((athletes.data ?? []).map((athlete) => [athlete.id, athlete])),
    [athletes.data]
  );

  const participants = useMemo(
    () =>
      (registrations.data ?? [])
        .filter((r) => r.competicao_id === competitionId)
        .map((r) => athletesById.get(r.atleta_id))
        .filter((a): a is Athlete => Boolean(a))
        .sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual)),
    [registrations.data, competitionId, athletesById]
  );

  const maxByGroup = competition?.tipo === 'SPING_OPEN'
    ? Number(openConfig.data?.atletas_por_grupo || 5)
    : 4;

  useEffect(() => {
    const suggestedCount = Math.max(1, Math.ceil(participants.length / maxByGroup));
    setManualGroupsCount(suggestedCount);
  }, [participants.length, maxByGroup]);

  const seedManualAssignments = (groupsCount = manualGroupsCount) => {
    const seededGroups = balanceGroupsByRating(participants, groupsCount);
    const nextAssignments: Record<number, string> = {};

    seededGroups.forEach((group) => {
      group.atletas.forEach((athlete) => {
        nextAssignments[athlete.id] = group.id;
      });
    });

    setManualAssignments(nextAssignments);
  };

  useEffect(() => {
    if (!participants.length) {
      setManualAssignments({});
      return;
    }

    seedManualAssignments(Math.max(1, Math.ceil(participants.length / maxByGroup)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants.length, maxByGroup]);

  const registrationCount = useMemo(
    () => (registrations.data ?? []).filter((r) => r.competicao_id === competitionId).length,
    [registrations.data, competitionId]
  );

  const competitionMatches = useMemo(
    () => (matches.data ?? []).filter((m) => m.competicao_id === competitionId),
    [matches.data, competitionId]
  );

  const manualGroupIds = useMemo(
    () => Array.from({ length: manualGroupsCount }, (_, index) => toGroupCode(index)),
    [manualGroupsCount]
  );

  const manualGroups = useMemo(
    () =>
      manualGroupIds.map((groupId) => ({
        id: groupId,
        nome: `Grupo ${groupId.replace('G', '')}`,
        atletas: participants.filter((athlete) => manualAssignments[athlete.id] === groupId)
      })),
    [manualGroupIds, participants, manualAssignments]
  );

  const unassignedParticipants = useMemo(
    () => participants.filter((athlete) => !manualAssignments[athlete.id]),
    [participants, manualAssignments]
  );

  const overflowGroups = useMemo(
    () => manualGroups.filter((group) => group.atletas.length > maxByGroup),
    [manualGroups, maxByGroup]
  );

  const singleAthleteGroups = useMemo(
    () => manualGroups.filter((group) => group.atletas.length === 1),
    [manualGroups]
  );

  const manualPayload = useMemo(
    () =>
      manualGroups
        .filter((group) => group.atletas.length > 0)
        .map((group) => ({
          id: group.id,
          athleteIds: group.atletas.map((athlete) => athlete.id)
        })),
    [manualGroups]
  );

  const manualCanGenerate =
    participants.length > 0 &&
    unassignedParticipants.length === 0 &&
    overflowGroups.length === 0 &&
    singleAthleteGroups.length === 0 &&
    manualPayload.length > 0;

  const runAction = (label: string) => ({
    onSuccess: () => {
      showSuccess(`${label} executado com sucesso!`);
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['competitions'] });
    },
    onError: (error: any) => showError(error?.response?.data?.erro || error?.response?.data?.message || `Falha ao executar ${label}`)
  });

  const generateGroupsMutation = useMutation({
    mutationFn: () => services.generateBalancedGroups({ competitionId }),
    ...runAction('Gerar grupos balanceados')
  });

  const generateGroupMatchesMutation = useMutation({
    mutationFn: (payload: { competitionId: number; groups?: Array<{ id?: string; athleteIds: number[] }> }) =>
      services.generateGroupMatches(payload),
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
              onClick={() => generateGroupMatchesMutation.mutate({ competitionId })}
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

      <Card>
        <Section
          title="🧩 Montagem Manual de Grupos"
          subtitle="Monte os grupos sem wizard e gere os jogos diretamente"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={groupMode === 'AUTO' ? 'primary' : 'secondary'}
                onClick={() => setGroupMode('AUTO')}
              >
                Modo Automático
              </Button>
              <Button
                variant={groupMode === 'MANUAL' ? 'primary' : 'secondary'}
                onClick={() => setGroupMode('MANUAL')}
              >
                Modo Manual
              </Button>
            </div>

            {groupMode === 'MANUAL' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    label="Quantidade de grupos"
                    type="number"
                    min={1}
                    max={Math.max(1, participants.length)}
                    value={manualGroupsCount}
                    onChange={(event) => {
                      const next = Number(event.target.value || 1);
                      setManualGroupsCount(Math.max(1, Math.min(Math.max(1, participants.length), next)));
                    }}
                    help={`Limite por grupo: ${maxByGroup} atletas`}
                  />
                  <div className="md:col-span-2 flex items-end gap-2">
                    <Button variant="secondary" onClick={() => seedManualAssignments()}>
                      Sugerir Balanceado
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => generateGroupMatchesMutation.mutate({ competitionId, groups: manualPayload })}
                      isLoading={generateGroupMatchesMutation.isPending}
                      disabled={!manualCanGenerate}
                    >
                      Gerar Jogos de Grupo (Manual)
                    </Button>
                  </div>
                </div>

                {(unassignedParticipants.length > 0 || overflowGroups.length > 0 || singleAthleteGroups.length > 0) && (
                  <Alert type="warning">
                    {unassignedParticipants.length > 0 && `Atletas sem grupo: ${unassignedParticipants.length}. `}
                    {overflowGroups.length > 0 && `Grupos acima do limite: ${overflowGroups.map((group) => group.id).join(', ')}. `}
                    {singleAthleteGroups.length > 0 && `Grupos com apenas 1 atleta: ${singleAthleteGroups.map((group) => group.id).join(', ')}.`}
                  </Alert>
                )}

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Atleta</th>
                        <th>Rating</th>
                        <th>Grupo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((athlete) => (
                        <tr key={athlete.id}>
                          <td>{athlete.nome}</td>
                          <td>{athlete.rating_atual}</td>
                          <td>
                            <select
                              className="select"
                              value={manualAssignments[athlete.id] || ''}
                              onChange={(event) => {
                                const value = event.target.value;
                                setManualAssignments((prev) => ({
                                  ...prev,
                                  [athlete.id]: value
                                }));
                              }}
                            >
                              <option value="">Selecionar...</option>
                              {manualGroupIds.map((groupId) => (
                                <option key={groupId} value={groupId}>
                                  {groupId}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {manualGroups.map((group) => (
                    <Card key={group.id} size="sm">
                      <p className="text-sm font-semibold text-neutral-900">
                        {group.nome} ({group.atletas.length}/{maxByGroup})
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-neutral-700">
                        {group.atletas.length === 0 ? (
                          <p className="text-neutral-500">Sem atletas</p>
                        ) : (
                          group.atletas.map((athlete) => (
                            <p key={athlete.id}>{athlete.nome}</p>
                          ))
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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
            <Link to={`/competicoes/${competitionId}/grupos/manual`}>
              <Button variant="secondary" isBlock>
                🛠️ Montar Grupos Manual
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
            <Link to={`/competicoes/${competitionId}/resultados/editar`}>
              <Button variant="secondary" isBlock>
                ✏️ Editar Resultados
              </Button>
            </Link>
            <Link to={`/competicoes/${competitionId}/resultados/editar-inline`}>
              <Button variant="secondary" isBlock>
                ⚡ Editar (Rápido)
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
            <Link to={`/competicoes/${competitionId}/mata-mata/manual`}>
              <Button variant="secondary" isBlock>
                🛠️ Inserir Mata-mata Manual
              </Button>
            </Link>
             <Link to={`/competicoes/${competitionId}/open-levels`}>
               <Button variant="secondary" isBlock>
                 📈 Níveis Open
               </Button>
             </Link>
             <Link to={`/competicoes/${competitionId}/auditoria`}>
               <Button variant="secondary" isBlock>
                 📜 Auditoria
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

