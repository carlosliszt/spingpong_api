import type { GroupStanding } from '@/shared/types/domain';

export function GroupStandingsTable({ standings }: { standings: GroupStanding[] }) {
  return (
    <div className="card overflow-x-auto" aria-label="Classificacao do grupo">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th>Atleta</th>
            <th>V</th>
            <th>D</th>
            <th>Saldo Sets</th>
            <th>Saldo Pontos</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.atleta_id} className="border-t border-slate-100">
              <td>{row.nome_atleta ?? row.atleta_id}</td>
              <td>{row.vitorias}</td>
              <td>{row.derrotas}</td>
              <td>{row.saldo_sets}</td>
              <td>{row.saldo_pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

