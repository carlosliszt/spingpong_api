import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { getRatingBand } from '@/shared/lib/rating';
import { Card, Section, Button } from '@/shared/components/ui';

type SortField = 'rating' | 'ranking' | 'vitorias' | 'partidas';
type SortOrder = 'asc' | 'desc';

export function RankingPage() {
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeTab, setActiveTab] = useState<'rating' | 'ranking'>('rating');

  const athletesQuery = useQuery({
    queryKey: ['athletes'],
    queryFn: services.getAthletes
  });

  // Dados ordenados por rating
  const ratingRanking = useMemo(() => {
    if (!athletesQuery.data) return [];

    const sorted = [...athletesQuery.data]
      .filter((a) => a.ativo)
      .sort((a, b) => Number(b.rating_atual) - Number(a.rating_atual))
      .map((a, idx) => ({
        ...a,
        rating_posicao: idx + 1
      }));

    return sorted;
  }, [athletesQuery.data]);

  // Dados ordenados por ranking_posicao (PT.RAK)
  const rankingPoints = useMemo(() => {
    if (!athletesQuery.data) return [];

    const sorted = [...athletesQuery.data]
      .filter((a) => a.ativo && (a.ranking_posicao ?? 0) > 0)
      .sort((a, b) => Number(b.ranking_posicao ?? 0) - Number(a.ranking_posicao ?? 0))
      .map((a, idx) => ({
        ...a,
        posicao_ranking: idx + 1
      }));

    return sorted;
  }, [athletesQuery.data]);

  // Dados baseado na aba ativa
  const displayData = activeTab === 'rating' ? ratingRanking : rankingPoints;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!displayData) return [];

    const dataToSort = [...displayData];

    switch (sortField) {
      case 'rating':
        return dataToSort.sort((a, b) =>
          sortOrder === 'desc'
            ? Number(b.rating_atual) - Number(a.rating_atual)
            : Number(a.rating_atual) - Number(b.rating_atual)
        );
      case 'ranking':
        return dataToSort.sort((a, b) =>
          sortOrder === 'desc'
            ? Number(b.ranking_posicao ?? 0) - Number(a.ranking_posicao ?? 0)
            : Number(a.ranking_posicao ?? 0) - Number(b.ranking_posicao ?? 0)
        );
      case 'vitorias':
        return dataToSort.sort((a, b) =>
          sortOrder === 'desc'
            ? (b.vitorias ?? 0) - (a.vitorias ?? 0)
            : (a.vitorias ?? 0) - (b.vitorias ?? 0)
        );
      case 'partidas':
        return dataToSort.sort((a, b) =>
          sortOrder === 'desc'
            ? (b.partidas_jogadas ?? 0) - (a.partidas_jogadas ?? 0)
            : (a.partidas_jogadas ?? 0) - (b.partidas_jogadas ?? 0)
        );
      default:
        return dataToSort;
    }
  }, [displayData, sortField, sortOrder]);

  const SortButton = ({
    field,
    label,
    active
  }: {
    field: SortField;
    label: string;
    active: boolean;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`px-3 py-2 text-sm font-medium rounded transition-all flex items-center gap-1 ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
      }`}
    >
      {label}
      {active && (sortOrder === 'desc' ? ' ↓' : ' ↑')}
    </button>
  );

  if (athletesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">🏆 Ranking & Rating</h1>
        <p className="text-neutral-600 mt-1">
          Visualize as colocações dos atletas por pontuação
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('rating')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'rating'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          ⭐ PT.RAT (Rating)
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ranking'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          📊 PT.RAK (Ranking)
        </button>
      </div>

      {/* Ordenação */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-neutral-600 self-center">Ordenar por:</span>
          <SortButton field="rating" label="Rating" active={sortField === 'rating'} />
          <SortButton field="ranking" label="Ranking" active={sortField === 'ranking'} />
          <SortButton field="vitorias" label="Vitórias" active={sortField === 'vitorias'} />
          <SortButton field="partidas" label="Partidas" active={sortField === 'partidas'} />
        </div>
      </Card>

      {/* Tabela */}
      <Card>
        <Section
          title={activeTab === 'rating' ? '⭐ Ranking por Rating (PT.RAT)' : '📊 Ranking por Pontos (PT.RAK)'}
          subtitle={`${sortedData.length} atletas ativos`}
        >
          {sortedData.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-lg">Nenhum atleta encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-4 py-3 text-left font-semibold text-neutral-900">
                      {activeTab === 'rating' ? 'Pos. Rating' : 'Pos. Ranking'}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-900">Atleta</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">PT.RAT</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">Faixa</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">PT.RAK</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">Vitórias</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">Derrotas</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">Partidas</th>
                    <th className="px-4 py-3 text-center font-semibold text-neutral-900">Taxa Win</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((athlete, idx) => {
                    const partidas = athlete.partidas_jogadas ?? 0;
                    const vitoria = athlete.vitorias ?? 0;
                    const derrota = athlete.derrotas ?? 0;
                    const winRate = partidas > 0 ? ((vitoria / partidas) * 100).toFixed(1) : '0.0';
                    const faixa = getRatingBand(Number(athlete.rating_atual));
                    const posicao = activeTab === 'rating'
                      ? (athlete as any).rating_posicao
                      : (athlete as any).posicao_ranking;

                    return (
                      <tr
                        key={athlete.id}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600">
                              {posicao}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900">{athlete.nome}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50">
                            <span className="font-bold text-blue-900">{Number(athlete.rating_atual).toFixed(0)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 font-semibold text-purple-900">
                            {faixa}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50">
                            <span className="font-bold text-emerald-900">{athlete.ranking_posicao ?? 0}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success-50">
                            <span className="font-bold text-success-900">{vitoria}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-danger-50">
                            <span className="font-bold text-danger-900">{derrota}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-neutral-900">
                          {partidas}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold ${
                              Number(winRate) >= 50
                                ? 'bg-success-100 text-success-900'
                                : 'bg-warning-100 text-warning-900'
                            }`}
                          >
                            {winRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">👥 Total Atletas</p>
            <p className="text-3xl font-bold text-neutral-900">{sortedData.length}</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">⭐ Rating Máximo</p>
            <p className="text-3xl font-bold text-brand-600">
              {sortedData.length > 0
                ? Number(Math.max(...sortedData.map(a => Number(a.rating_atual)))).toFixed(0)
                : '-'}
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">📊 Ranking Máximo</p>
            <p className="text-3xl font-bold text-emerald-600">
              {sortedData.length > 0
                ? Math.max(...sortedData.map(a => a.ranking_posicao ?? 0))
                : '-'}
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">🎮 Total Partidas</p>
            <p className="text-3xl font-bold text-neutral-900">
              {sortedData.reduce((sum, a) => sum + (a.partidas_jogadas ?? 0), 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Legenda */}
      <Card>
        <Section title="📖 Legenda" subtitle="Entenda as colunas">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900">PT.RAT (Rating)</h4>
              <p className="text-sm text-neutral-600">
                Pontuação ELO-like. Reflete o skill do atleta. Atualizado a cada jogo finalizado.
              </p>
              <p className="text-sm text-neutral-600">
                <strong>Faixas:</strong> A (3300+) até O (&lt;251)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900">PT.RAK (Ranking)</h4>
              <p className="text-sm text-neutral-600">
                Pontos acumulados em torneios. Atualizado ao fim de cada mata-mata.
              </p>
              <p className="text-sm text-neutral-600">
                <strong>Fonte:</strong> Final +20/+14, Semi +10, Quartas +7, Oitavas +5
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900">Faixa</h4>
              <p className="text-sm text-neutral-600">
                Categoria visual baseada no rating. Facilita visualização rápida do nível.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-neutral-900">Taxa Win</h4>
              <p className="text-sm text-neutral-600">
                Porcentagem de vitórias = (Vitórias / Partidas) × 100%
              </p>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}

