import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { balanceGroupsByRating } from '@/features/competition-engine/useCases';
import { AdvancementSimulator } from '@/features/competitions/components/AdvancementSimulator';
import { GroupObservationBoard } from '@/features/competitions/components/GroupObservationBoard';
import { exportGroupGamesPdf } from '@/features/competitions/utils/exportGroupGamesPdf';
import type { Athlete, GroupStanding } from '@/shared/types/domain';

const FINISHED_STATUS = new Set(['FINALIZADO', 'W_O']);

export function CompetitionGroupsPage() {
  const { id } = useParams();
  const competitionId = Number(id);

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Grupos da competicao #{id} {competition ? `- ${competition.nome}` : ''}
        </h1>
        <button
          className="btn-secondary"
          onClick={() =>
            exportGroupGamesPdf({
              competitionName: competition?.nome ?? `Competicao ${id}`,
              groups,
              standingsByGroup,
              matches: groupMatches
            })
          }
        >
          Exportar grupos/jogos para PDF
        </button>
      </div>

      <GroupObservationBoard
        competitionName={competition?.nome ?? `Competicao ${id}`}
        competitionType={competition?.tipo ?? 'SPING_FOODS'}
        groups={groups}
        standingsByGroup={standingsByGroup}
        allRoundsFinished={allRoundsFinished}
      />

      <AdvancementSimulator standingsByGroup={standingsByGroup} athletes={participants} />
    </div>
  );
}
