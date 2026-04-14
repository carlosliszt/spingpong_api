import { useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { CompetitionStatusBadge } from '@/shared/components/CompetitionStatusBadge';

export function DashboardPage() {
  const athletes = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Atletas ativos</p><p className="text-2xl font-bold">{athletes.data?.length ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Competicoes</p><p className="text-2xl font-bold">{competitions.data?.length ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Em andamento</p><p className="text-2xl font-bold">{competitions.data?.filter((c) => c.status === 'EM_ANDAMENTO').length ?? 0}</p></div>
      </div>
      <section className="card">
        <h2 className="mb-3 text-lg font-semibold">Status das competicoes</h2>
        <div className="space-y-2">
          {competitions.data?.map((comp) => (
            <div key={comp.id} className="flex items-center justify-between rounded-md border border-slate-100 p-2">
              <span>{comp.nome}</span>
              <CompetitionStatusBadge status={comp.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

