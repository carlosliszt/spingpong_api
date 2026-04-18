import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Card, Section, LoadingSpinner, EmptyState } from '@/shared/components/ui';
import { CompetitionStatusBadge } from '@/shared/components/CompetitionStatusBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui';

export function DashboardPage() {
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  const activeCompetitions = competitions.data?.filter((c) => c.status === 'EM_ANDAMENTO') || [];
  const plannedCompetitions = competitions.data?.filter((c) => c.status === 'PLANEJADA') || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-page">📊 Dashboard</h1>
        <p className="text-neutral-600">Bem-vindo ao painel de gerenciamento de torneios</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card size="lg">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">👥 Atletas Cadastrados</p>
            <p className="text-3xl font-bold text-brand-600">
              {athletes.isLoading ? '...' : athletes.data?.length ?? 0}
            </p>
          </div>
        </Card>

        <Card size="lg">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">🏆 Torneios Totais</p>
            <p className="text-3xl font-bold text-neutral-900">
              {competitions.isLoading ? '...' : competitions.data?.length ?? 0}
            </p>
          </div>
        </Card>

        <Card size="lg">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">⚡ Em Andamento</p>
            <p className="text-3xl font-bold text-warning-600">
              {competitions.isLoading ? '...' : activeCompetitions.length}
            </p>
          </div>
        </Card>

        <Card size="lg">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-600">📋 Planejadas</p>
            <p className="text-3xl font-bold text-neutral-600">
              {competitions.isLoading ? '...' : plannedCompetitions.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Active Competitions */}
      <Section title="🏃 Torneios em Andamento" subtitle="Ações rápidas para operações ativas">
        {competitions.isLoading ? (
          <LoadingSpinner />
        ) : activeCompetitions.length > 0 ? (
          <div className="space-y-2">
            {activeCompetitions.map((comp) => (
              <div key={comp.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{comp.nome}</h3>
                  <p className="text-sm text-neutral-600">{comp.tipo} • {comp.data_inicio}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CompetitionStatusBadge status={comp.status} />
                  <Link to={`/competicoes/${comp.id}/grupos`}>
                    <Button variant="secondary" size="sm">Ver Grupos</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum torneio em andamento"
            description="Comece criando um novo torneio para gerenciar atletas e partidas."
            action={{ label: 'Criar Torneio', onClick: () => window.location.href = '/competicoes/wizard' }}
          />
        )}
      </Section>

      {/* Quick Actions */}
      <Section title="⚡ Ações Rápidas">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <Link to="/atletas">
            <Button variant="secondary" isBlock>
              ➕ Novo Atleta
            </Button>
          </Link>
          <Link to="/competicoes/wizard">
            <Button variant="secondary" isBlock>
              ✨ Novo Torneio
            </Button>
          </Link>
          <Link to="/jogos/resultados">
            <Button variant="secondary" isBlock>
              📝 Lançar Resultado
            </Button>
          </Link>
          <Link to="/ranking">
            <Button variant="secondary" isBlock>
              🏆 Ver Rankings
            </Button>
          </Link>
          <Link to="/historico">
            <Button variant="secondary" isBlock>
              📋 Ver Histórico
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}

