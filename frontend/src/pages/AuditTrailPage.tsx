import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section } from '@/shared/components/ui';
import { formatHistoryDate, getStatusLabel } from '@/shared/utils/auditTrail';

export function AuditTrailPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  const resultHistoryQuery = useQuery({ queryKey: ['result-history'], queryFn: services.getResultHistory });
  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const athletesMap = useMemo(
    () => Object.fromEntries((athletesQuery.data ?? []).map((a) => [a.id, a.nome])),
    [athletesQuery.data]
  );

  const filteredHistory = useMemo(() => {
    let items = resultHistoryQuery.data ?? [];
    if (competitionIdFromRoute) {
      items = items.filter((h) => h.competicao_id === competitionIdFromRoute);
    }
    return items.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  }, [resultHistoryQuery.data, competitionIdFromRoute]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">📜 Auditoria de Alterações</h1>
        <p className="text-neutral-600">
          Histórico de todas as alterações de resultados realizadas
        </p>
      </div>

      <Card>
        <Section title="Histórico de Mudanças" subtitle={`Total: ${filteredHistory.length} registros`}>
          {filteredHistory.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">Nenhuma alteração registrada</p>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((record) => (
                <div key={record.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-600">Jogo ID:</p>
                        <p className="font-mono text-sm font-semibold">{record.jogo_id}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-600">Data/Hora:</p>
                        <p className="text-sm font-semibold">{formatHistoryDate(record.created_at)}</p>
                      </div>
                    </div>

                    {/* Changes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-600">Status:</p>
                        <div className="flex gap-1 items-center">
                          <span className="text-xs px-2 py-1 bg-neutral-100 rounded">
                            {getStatusLabel(record.status_anterior ?? record.status_novo)}
                          </span>
                          <span className="text-neutral-500">→</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 rounded">
                            {getStatusLabel(record.status_novo)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-600">Vencedor:</p>
                        <div className="flex gap-1 items-center text-xs">
                          <span className="px-2 py-1 bg-neutral-100 rounded">
                            {athletesMap[record.vencedor_anterior_id ?? 0] || 'N/A'}
                          </span>
                          <span className="text-neutral-500">→</span>
                          <span className="px-2 py-1 bg-success-100 rounded font-semibold text-success-700">
                            {athletesMap[record.vencedor_novo_id ?? 0] || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2">
                      <div className="space-y-1 text-xs">
                        {record.motivo && (
                          <p className="text-neutral-700">
                            <span className="text-neutral-600">Motivo:</span> {record.motivo}
                          </p>
                        )}
                        <p className="text-neutral-600">
                          Alterado por: <span className="font-semibold">Admin #{record.alterado_por}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </Card>

      {/* Back Button */}
      <Link to={competitionIdFromRoute ? `/competicoes/${competitionIdFromRoute}/operacoes` : '/competicoes'}>
        <Button variant="secondary" isBlock>
          ↩️ Voltar
        </Button>
      </Link>
    </div>
  );
}

