import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

export function HistoryPage() {
  const resultados = useQuery({ queryKey: ['history-results'], queryFn: services.getResultHistory });
  const rating = useQuery({ queryKey: ['history-rating'], queryFn: services.getRatingHistory });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Historico / Auditoria (somente leitura)</h1>

      <section className="card overflow-x-auto">
        <h2 className="mb-2 font-semibold">Historico de resultados</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>ID</th>
              <th>Jogo</th>
              <th>Status anterior</th>
              <th>Status novo</th>
              <th>Vencedor anterior</th>
              <th>Vencedor novo</th>
              <th>Alterado por</th>
              <th>Motivo</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {resultados.data?.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td>{r.id}</td>
                <td>{r.jogo_id}</td>
                <td>{r.status_anterior ?? '-'}</td>
                <td>{r.status_novo}</td>
                <td>{r.vencedor_anterior_id ?? '-'}</td>
                <td>{r.vencedor_novo_id ?? '-'}</td>
                <td>{r.alterado_por}</td>
                <td>{r.motivo ?? '-'}</td>
                <td>{r.created_at ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="mb-2 font-semibold">Historico de rating/ranking</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th>ID</th>
              <th>Atleta</th>
              <th>Jogo</th>
              <th>Rating anterior</th>
              <th>Rating novo</th>
              <th>Ranking anterior</th>
              <th>Ranking novo</th>
              <th>Motivo</th>
              <th>Alterado por</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {rating.data?.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td>{r.id}</td>
                <td>{r.atleta_id}</td>
                <td>{r.jogo_id ?? '-'}</td>
                <td>{r.rating_anterior}</td>
                <td>{r.rating_novo}</td>
                <td>{r.ranking_anterior ?? '-'}</td>
                <td>{r.ranking_novo ?? '-'}</td>
                <td>{r.motivo ?? '-'}</td>
                <td>{r.alterado_por ?? '-'}</td>
                <td>{r.created_at ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
