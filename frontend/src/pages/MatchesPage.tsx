import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

export function MatchesPage() {
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const athleteById = useMemo(
    () => new Map((athletes.data ?? []).map((a) => [a.id, a.nome])),
    [athletes.data]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jogos (visualizacao)</h1>
        <Link className="btn-primary" to="/jogos/resultados">Inserir resultado</Link>
      </div>

      <section className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>ID</th>
              <th>Competicao</th>
              <th>Fase</th>
              <th>Rodada</th>
              <th>Atleta A</th>
              <th>Atleta B</th>
              <th>Vencedor</th>
              <th>Status</th>
              <th>Previsto</th>
            </tr>
          </thead>
          <tbody>
            {matches.data?.map((m) => (
              <tr key={m.id} className="border-t border-slate-100">
                <td>{m.id}</td>
                <td>{m.competicao_nome ?? m.competicao_id}</td>
                <td>{m.fase}</td>
                <td>{m.rodada ?? '-'}</td>
                <td><Link className="text-brand-700 hover:underline" to="/atletas">{m.atleta_a_nome ?? athleteById.get(m.atleta_a_id) ?? m.atleta_a_id}</Link></td>
                <td><Link className="text-brand-700 hover:underline" to="/atletas">{m.atleta_b_nome ?? athleteById.get(m.atleta_b_id) ?? m.atleta_b_id}</Link></td>
                <td>{m.vencedor_nome ?? (m.vencedor_id ? athleteById.get(m.vencedor_id) : '-') ?? '-'}</td>
                <td>{m.status}</td>
                <td>{m.data_hora_prevista ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
