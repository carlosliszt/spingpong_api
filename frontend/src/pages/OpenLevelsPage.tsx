import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { balanceGroupsByRating, splitOpenLevels } from '@/features/competition-engine/useCases';
import { OpenLevelsTabs } from '@/features/competitions/components/OpenLevelsTabs';
import type { Athlete, GroupStanding } from '@/shared/types/domain';

export function OpenLevelsPage() {
  const { id } = useParams();
  const competitionId = Number(id);

  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const registrations = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });

  const competition = useMemo(
    () => (competitions.data ?? []).find((c) => c.id === competitionId),
    [competitions.data, competitionId]
  );

  const athletesById = useMemo(
    () => Object.fromEntries((athletes.data ?? []).map((a) => [a.id, a])),
    [athletes.data]
  );

  const participants = useMemo(
    () =>
      (registrations.data ?? [])
        .filter((r) => r.competicao_id === competitionId)
        .map((r) => athletesById[r.atleta_id])
        .filter((a): a is Athlete => Boolean(a)),
    [registrations.data, competitionId, athletesById]
  );

  const groupsCount = Math.max(1, Math.ceil(participants.length / 5));
  const groups = useMemo(() => balanceGroupsByRating(participants, groupsCount), [participants, groupsCount]);

  const standingsQueries = useQueries({
    queries: groups.map((g) => ({
      queryKey: ['group-standing-open', competitionId, g.id],
      queryFn: () => services.getGroupStanding(competitionId, g.id)
    }))
  });

  const standingsByGroup = useMemo(() => {
    const result: Record<string, GroupStanding[]> = {};
    groups.forEach((g, i) => {
      result[g.id] = standingsQueries[i]?.data ?? [];
    });
    return result;
  }, [groups, standingsQueries]);

  const levels = splitOpenLevels(standingsByGroup, athletesById);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        SPING_OPEN niveis A/B/C/D - competicao #{id} {competition ? `- ${competition.nome}` : ''}
      </h1>
      <OpenLevelsTabs levels={levels} />
    </div>
  );
}

