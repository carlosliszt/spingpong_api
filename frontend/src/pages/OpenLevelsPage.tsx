import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { balanceGroupsByRating, splitOpenLevels } from '@/features/competition-engine/useCases';
import { OpenLevelsTabs } from '@/features/competitions/components/OpenLevelsTabs';
import { Button, Card, Section } from '@/shared/components/ui';
import type { Athlete, GroupStanding } from '@/shared/types/domain';
import type { OpenLevel } from '@/features/competition-engine/types';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-page">📈 Níveis SPING OPEN A/B/C/D</h1>
          <p className="text-neutral-600">
            {competition ? competition.nome : `Torneio #${id}`}
          </p>
        </div>
        <Link to={`/competicoes/${competitionId}/operacoes`}>
          <Button variant="secondary">↩️ Voltar</Button>
        </Link>
      </div>

      {/* Levels Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {(['A', 'B', 'C', 'D'] as const).map((level) => {
          const safeLevel = level as keyof typeof levels;
          return (
            <Card size="sm" key={level}>
              <div className="space-y-1">
                <p className="text-xs text-neutral-600">Nível {level}</p>
                <p className="text-2xl font-bold text-brand-600">{levels[safeLevel]?.length ?? 0}</p>
                <p className="text-xs text-neutral-500">atletas</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Levels Content */}
      <Card>
        <Section title="Visualização por Nível" subtitle="Distribuição dos atletas">
          <OpenLevelsTabs levels={levels} />
        </Section>
      </Card>
    </div>
  );
}

