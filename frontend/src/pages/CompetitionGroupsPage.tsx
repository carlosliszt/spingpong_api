import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { balanceGroupsByRating } from '@/features/competition-engine/useCases';
import { AdvancementSimulator } from '@/features/competitions/components/AdvancementSimulator';
import { GroupObservationBoard } from '@/features/competitions/components/GroupObservationBoard';
import { exportGroupGamesPdf } from '@/features/competitions/utils/exportGroupGamesPdf';
import { Button, Card, Section, Badge, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';
import type { Athlete, GroupStanding } from '@/shared/types/domain';

const FINISHED_STATUS = new Set(['FINALIZADO', 'W_O']);

export function CompetitionGroupsPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const { feedback, showSuccess, clear } = useFeedback();

  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const registrations = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const competition = useMemo(
    () => (competitions.data ?? []).find((c) => c.id === competitionId),
    [competitions.data, competitionId]
  );

  const athletesById = useMemo(
    () => new Map((athletes.data ?? []).map((a) => [a.id, a])),
    [athletes.data]
  );

  const participants = useMemo(() => {
    const regAthletes = (registrations.data ?? [])
      .filter((r) => r.competicao_id === competitionId)
      .map((r) => athletesById.get(r.atleta_id))
      .filter((a): a is Athlete => Boolean(a));

    return regAthletes;
  }, [registrations.data, competitionId, athletesById]);

  const groupsCount = useMemo(() => {
    const total = participants.length;
    const maxByGroup = competition?.tipo === 'SPING_OPEN' ? 5 : 4;
    return Math.max(1, Math.ceil(total / maxByGroup));
  }, [participants.length, competition?.tipo]);

  const groups = useMemo(() => balanceGroupsByRating(participants, groupsCount), [participants, groupsCount]);

  const standingsQueries = useQueries({
    queries: groups.map((g) => ({
      queryKey: ['group-standing', competitionId, g.id],
      queryFn: () => services.getGroupStanding(competitionId, g.id)
    }))
  });

  const standingsByGroup = useMemo(() => {
    const map: Record<string, GroupStanding[]> = {};
    groups.forEach((g, i) => {
      map[g.id] = standingsQueries[i]?.data ?? [];
    });
    return map;
  }, [groups, standingsQueries]);

  const groupMatches = useMemo(
    () =>
      (matches.data ?? []).filter(
        (m) => m.competicao_id === competitionId && m.fase.toUpperCase().includes('GRUPO')
      ),
    [matches.data, competitionId]
  );

  const allRoundsFinished =
    groupMatches.length > 0 && groupMatches.every((m) => FINISHED_STATUS.has(m.status));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-page">📊 Grupos da Competição</h1>
          <p className="text-neutral-600">
            {competition ? `${competition.nome} (${competition.tipo})` : `Torneio #${id}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/competicoes/${id}/operacoes`}>
            <Button variant="secondary">↩️ Voltar</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              exportGroupGamesPdf({
                competitionName: competition?.nome ?? `Competicao ${id}`,
                groups,
                standingsByGroup,
                matches: groupMatches
              });
              showSuccess('PDF exportado com sucesso!');
            }}
          >
            📥 Exportar PDF
          </Button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert type="success" onClose={clear}>
          {feedback.msg}
        </Alert>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card size="sm">
          <div className="space-y-1">
            <p className="text-xs text-neutral-600">👥 Atletas Inscritos</p>
            <p className="text-2xl font-bold text-neutral-900">{participants.length}</p>
          </div>
        </Card>
        <Card size="sm">
          <div className="space-y-1">
            <p className="text-xs text-neutral-600">📦 Grupos Criados</p>
            <p className="text-2xl font-bold text-brand-600">{groupsCount}</p>
          </div>
        </Card>
        <Card size="sm">
          <div className="space-y-1">
            <p className="text-xs text-neutral-600">🎮 Jogos</p>
            <p className="text-2xl font-bold text-neutral-900">{groupMatches.length}</p>
          </div>
        </Card>
        <Card size="sm">
          <div className="space-y-1">
            <p className="text-xs text-neutral-600">✓ Status</p>
            <Badge variant={allRoundsFinished ? 'success' : 'warning'}>
              {allRoundsFinished ? '✓ Finalizado' : '⏳ Em Andamento'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <GroupObservationBoard
        competitionName={competition?.nome ?? `Competição ${id}`}
        competitionType={competition?.tipo ?? 'SPING_FOODS'}
        groups={groups}
        standingsByGroup={standingsByGroup}
        allRoundsFinished={allRoundsFinished}
      />

      {/* Advancement Simulator */}
      <Card>
        <AdvancementSimulator standingsByGroup={standingsByGroup} athletes={participants} />
      </Card>
    </div>
  );
}
