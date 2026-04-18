import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Card, Section, Badge, LoadingSpinner, EmptyState } from '@/shared/components/ui';
import { useState } from 'react';

export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'resultados' | 'rating'>('resultados');
  const resultados = useQuery({ queryKey: ['history-results'], queryFn: services.getResultHistory });
  const rating = useQuery({ queryKey: ['history-rating'], queryFn: services.getRatingHistory });

  const getStatusColor = (status: string) => {
    if (status === 'FINALIZADO') return 'success';
    if (status === 'CANCELADO') return 'danger';
    if (status === 'W_O') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-page">📋 Histórico e Auditoria</h1>
        <p className="text-neutral-600">Visualize registros de mudanças (somente leitura)</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('resultados')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'resultados'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          📝 Resultados ({resultados.data?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('rating')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'rating'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          ⭐ Rating/Ranking ({rating.data?.length ?? 0})
        </button>
      </div>

      {/* Results Tab */}
      {activeTab === 'resultados' && (
        <Card>
          <Section title="Histórico de Resultados" subtitle="Mudanças em status e vencedores de jogos">
            {resultados.isLoading ? (
              <LoadingSpinner />
            ) : resultados.data?.length === 0 ? (
              <EmptyState
                icon="📝"
                title="Nenhum registro de resultado"
                description="Ainda não há histórico de mudanças em resultados"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Jogo</th>
                      <th>Status</th>
                      <th>Vencedor</th>
                      <th>Motivo</th>
                      <th>Alterado por</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.data?.map((r) => (
                      <tr key={r.id}>
                        <td className="text-neutral-600">#{r.id}</td>
                        <td className="font-medium">Jogo #{r.jogo_id}</td>
                        <td>
                          <div className="flex flex-col gap-1 text-xs">
                            <Badge variant="neutral">{r.status_anterior ?? '-'}</Badge>
                            <span className="text-neutral-400">↓</span>
                            <Badge variant={getStatusColor(r.status_novo)}>
                              {r.status_novo}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="text-neutral-600">{r.vencedor_anterior_nome ? `${r.vencedor_anterior_nome}` : '-'}</span>
                            {r.vencedor_anterior_id !== r.vencedor_novo_id && (
                              <>
                                <span className="text-neutral-400">→</span>
                                <span className="font-semibold text-brand-600">{r.vencedor_novo_nome}</span>
                              </>
                            )}
                          </div>
                        </td>
                         <td className="text-xs text-neutral-600">{r.motivo ?? '-'}</td>
                         <td className="text-xs text-neutral-600">{r.alterado_por ?? '-'}</td>
                         <td className="text-xs text-neutral-500">{r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </Section>
         </Card>
       )}

       {/* Rating Tab */}
       {activeTab === 'rating' && (
         <Card>
           <Section title="Histórico de Rating & Ranking" subtitle="Mudanças de pontuação dos atletas">
             {rating.isLoading ? (
               <LoadingSpinner />
             ) : rating.data?.length === 0 ? (
               <EmptyState
                 icon="⭐"
                 title="Nenhum registro de rating"
                 description="Ainda não há histórico de mudanças em rating/ranking"
               />
             ) : (
               <div className="overflow-x-auto">
                 <table className="table w-full text-sm">
                   <thead>
                     <tr>
                       <th>Atleta</th>
                       <th>Jogo</th>
                       <th>Rating</th>
                       <th>PT.RAK</th>
                       <th>Motivo</th>
                       <th>Alterado por</th>
                       <th>Data</th>
                     </tr>
                   </thead>
                   <tbody>
                      {rating.data?.map((r) => (
                        <tr key={r.id}>
                          <td className="font-medium">{r.atleta_nome || `Atleta ${r.atleta_id}`}</td>
                          <td className="text-neutral-600">{r.jogo_id ? `Jogo #${r.jogo_id}` : '-'}</td>
                         <td>
                           <div className="flex flex-col gap-1 text-xs">
                             <span className="text-neutral-600">{r.rating_anterior}</span>
                             <span className={`font-semibold ${r.rating_novo > r.rating_anterior ? 'text-success-600' : 'text-danger-600'}`}>
                               {r.rating_novo > r.rating_anterior ? '↑' : '↓'} {r.rating_novo}
                             </span>
                           </div>
                         </td>
                         <td>
                           <div className="flex flex-col gap-1 text-xs">
                             <span className="text-neutral-600">{r.ranking_anterior ?? '-'}</span>
                             {r.ranking_anterior !== r.ranking_novo && (
                               <span className="font-semibold text-brand-600">→ {r.ranking_novo}</span>
                             )}
                           </div>
                         </td>
                         <td className="text-xs text-neutral-600">{r.motivo ?? '-'}</td>
                         <td className="text-xs text-neutral-600">{r.alterado_por ?? '-'}</td>
                         <td className="text-xs text-neutral-500">{r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </Card>
      )}
    </div>
  );
}
