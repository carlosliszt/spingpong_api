import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Card, Section, Select, Badge, EmptyState, LoadingSpinner } from '@/shared/components/ui';

function phaseLabel(phase: string) {
  const upper = String(phase || '').toUpperCase();
  if (upper.startsWith('GRUPO_')) return 'GRUPO';
  if (upper.includes('OITAVAS')) return 'OITAVAS';
  if (upper.includes('QUARTAS')) return 'QUARTAS';
  if (upper.includes('SEMI')) return 'SEMI_FINAL';
  if (upper.endsWith('FINAL')) return 'FINAL';
  return upper;
}

export function MatchResultsViewPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  if (!competitionIdFromRoute) {
    return (
      <Card>
        <Section title="Resultados por Torneio">
          <EmptyState
            icon="📊"
            title="Acesso exclusivo por torneio"
            description="Acesse esta página através da tela de operações do torneio"
          />
        </Section>
      </Card>
    );
  }

  const [phaseFilter, setPhaseFilter] = useState('TODAS');
  const [athleteFilter, setAthleteFilter] = useState<number>(0);

  const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });
  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const finishedMatches = useMemo(() => {
    const all = matchesQuery.data ?? [];
    const filteredByCompetition = competitionIdFromRoute
      ? all.filter((m) => m.competicao_id === competitionIdFromRoute)
      : all;

    return filteredByCompetition.filter((m) => m.status === 'FINALIZADO' || m.status === 'W_O');
  }, [matchesQuery.data, competitionIdFromRoute]);

  const phaseOptions = useMemo(() => {
    const labels = Array.from(new Set(finishedMatches.map((m) => phaseLabel(m.fase))));
    return ['TODAS', ...labels];
  }, [finishedMatches]);

  const filteredMatches = useMemo(() => {
    return finishedMatches.filter((m) => {
      const byPhase = phaseFilter === 'TODAS' || phaseLabel(m.fase) === phaseFilter;
      const byAthlete =
        !athleteFilter ||
        m.atleta_a_id === athleteFilter ||
        m.atleta_b_id === athleteFilter ||
        m.vencedor_id === athleteFilter;

      return byPhase && byAthlete;
    });
  }, [finishedMatches, phaseFilter, athleteFilter]);

  const setsQueries = useQueries({
    queries: filteredMatches.map((m) => ({
      queryKey: ['sets-by-match', m.id],
      queryFn: () => services.getSetsByMatch(m.id)
    }))
  });

  const setScoreByMatch = useMemo(() => {
    const result: Record<number, string> = {};

    filteredMatches.forEach((match, index) => {
      const sets = setsQueries[index]?.data ?? [];
      let a = 0;
      let b = 0;
      for (const set of sets) {
        const pa = Number(set.pontos_atleta_a ?? set.pontos_a ?? 0);
        const pb = Number(set.pontos_atleta_b ?? set.pontos_b ?? 0);
        if (pa > pb) a += 1;
        if (pb > pa) b += 1;
      }
      result[match.id] = sets.length ? `${a}-${b}` : '-';
    });

    return result;
  }, [filteredMatches, setsQueries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-page">📊 Resultados de Jogos</h1>
        <p className="text-neutral-600">Torneio #{competitionIdFromRoute}</p>
      </div>

      {/* Filters */}
      <Card>
        <Section title="🔍 Filtros" subtitle="Refine sua busca">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              label="Fase"
              options={phaseOptions.map((phase) => ({ value: phase, label: phase }))}
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
            />

            <Select
              label="Atleta"
              options={[
                { value: '', label: 'Todos' },
                ...(athletesQuery.data ?? []).map((a) => ({ value: a.id, label: a.nome }))
              ]}
              value={athleteFilter || ''}
              onChange={(e) => setAthleteFilter(e.target.value ? Number(e.target.value) : 0)}
            />

            <div className="flex items-end">
              <div className="p-3 bg-brand-50 rounded-lg flex-1">
                <p className="text-xs text-neutral-600">Resultados encontrados</p>
                <p className="text-2xl font-bold text-brand-600">{filteredMatches.length}</p>
              </div>
            </div>
          </div>
        </Section>
      </Card>

      {/* Results Table */}
      <Card>
        <Section title="Resultados" subtitle={`${filteredMatches.length} jogos`}>
          {matchesQuery.isLoading ? (
            <LoadingSpinner />
          ) : filteredMatches.length === 0 ? (
            <EmptyState
              icon="📊"
              title="Nenhum resultado"
              description="Não encontramos resultados com os filtros selecionados"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fase</th>
                    <th>Atleta A</th>
                    <th>Atleta B</th>
                    <th>Sets</th>
                    <th>Vencedor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((m) => (
                    <tr key={m.id}>
                      <td className="text-neutral-600">#{m.id}</td>
                      <td><Badge variant="neutral">{phaseLabel(m.fase)}</Badge></td>
                      <td>
                        <Link to="/atletas" className="text-brand-600 hover:text-brand-700 font-medium">
                          {m.atleta_a_nome ?? `#${m.atleta_a_id}`}
                        </Link>
                      </td>
                      <td>
                        <Link to="/atletas" className="text-brand-600 hover:text-brand-700 font-medium">
                          {m.atleta_b_nome ?? `#${m.atleta_b_id}`}
                        </Link>
                      </td>
                      <td className="font-semibold text-center">{setScoreByMatch[m.id] ?? '-'}</td>
                      <td className="font-semibold text-success-600">
                        {m.vencedor_nome ?? (m.vencedor_id ? `Atleta ${m.vencedor_id}` : '-')}
                      </td>
                      <td>
                        <Badge variant="success">{m.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Card>
    </div>
  );
}

