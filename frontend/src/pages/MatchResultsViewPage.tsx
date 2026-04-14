import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

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
      <section className="card text-sm text-slate-700">
        Esta consulta de resultados e exclusiva por torneio. Acesse via tela de operacoes da competicao.
      </section>
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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Resultados de jogos - Torneio #{competitionIdFromRoute}</h1>

      <section className="card grid gap-2 md:grid-cols-3">
        <label className="text-sm text-slate-600">
          Fase
          <select className="input mt-1" value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
            {phaseOptions.map((phase) => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          Atleta
          <select className="input mt-1" value={athleteFilter || ''} onChange={(e) => setAthleteFilter(e.target.value ? Number(e.target.value) : 0)}>
            <option value="">Todos</option>
            {(athletesQuery.data ?? []).map((a) => (
              <option key={a.id} value={a.id}>{a.nome}</option>
            ))}
          </select>
        </label>

        <div className="text-sm text-slate-600 flex items-end">Resultados encontrados: {filteredMatches.length}</div>
      </section>

      <section className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>ID</th>
              <th>Competicao</th>
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
              <tr key={m.id} className="border-t border-slate-100">
                <td>{m.id}</td>
                <td>{m.competicao_nome ?? m.competicao_id}</td>
                <td>{m.fase}</td>
                <td><Link className="text-brand-700 hover:underline" to="/atletas">{m.atleta_a_nome ?? m.atleta_a_id}</Link></td>
                <td><Link className="text-brand-700 hover:underline" to="/atletas">{m.atleta_b_nome ?? m.atleta_b_id}</Link></td>
                <td>{setScoreByMatch[m.id] ?? '-'}</td>
                <td>{m.vencedor_nome ?? m.vencedor_id ?? '-'}</td>
                <td>{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

