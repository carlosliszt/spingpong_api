import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Badge, EmptyState, LoadingSpinner } from '@/shared/components/ui';

export function MatchesPage() {
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const athleteById = useMemo(
    () => new Map((athletes.data ?? []).map((a) => [a.id, a.nome])),
    [athletes.data]
  );

  const getStatusColor = (status: string) => {
    if (status === 'FINALIZADO') return 'success';
    if (status === 'CANCELADO') return 'danger';
    if (status === 'W_O') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-page">🎮 Todos os Jogos</h1>
          <p className="text-neutral-600">Visualize e gerencie jogos do sistema</p>
        </div>
        <Link to="/jogos/resultados">
          <Button variant="primary">📝 Lançar Resultado</Button>
        </Link>
      </div>

      {/* Content */}
      <Card>
        <Section title="Lista de Jogos" subtitle={`Total: ${matches.data?.length ?? 0} jogos`}>
          {matches.isLoading ? (
            <LoadingSpinner />
          ) : matches.data?.length === 0 ? (
            <EmptyState
              icon="🎮"
              title="Nenhum jogo"
              description="Crie um torneio e gere os jogos"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Competição</th>
                    <th>Fase</th>
                    <th>Atletas</th>
                    <th>Vencedor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.data?.map((m) => (
                    <tr key={m.id}>
                      <td className="text-neutral-600">#{m.id}</td>
                      <td className="font-medium">{m.competicao_nome ?? `Competição ${m.competicao_id}`}</td>
                      <td className="text-xs"><Badge variant="neutral">{m.fase}</Badge></td>
                      <td>
                        <div className="flex flex-col gap-1 text-xs">
                          <div>
                            <Link to="/atletas" className="text-brand-600 hover:text-brand-700 font-medium">
                              {m.atleta_a_nome ?? athleteById.get(m.atleta_a_id) ?? `Atleta ${m.atleta_a_id}`}
                            </Link>
                          </div>
                          <div className="text-neutral-600">vs</div>
                          <div>
                            <Link to="/atletas" className="text-brand-600 hover:text-brand-700 font-medium">
                              {m.atleta_b_nome ?? athleteById.get(m.atleta_b_id) ?? `Atleta ${m.atleta_b_id}`}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        {m.vencedor_nome ? (
                          <span className="font-semibold text-success-600">
                            {m.vencedor_nome}
                          </span>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={getStatusColor(m.status)}>
                          {m.status}
                        </Badge>
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
