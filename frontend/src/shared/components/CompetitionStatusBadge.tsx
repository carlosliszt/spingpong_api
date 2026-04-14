import type { CompetitionStatus } from '@/shared/types/domain';

const STATUS_STYLE: Record<CompetitionStatus, string> = {
  PLANEJADA: 'bg-slate-100 text-slate-700',
  EM_ANDAMENTO: 'bg-amber-100 text-amber-700',
  FINALIZADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-rose-100 text-rose-700'
};

export function CompetitionStatusBadge({ status }: { status: CompetitionStatus }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`} aria-label={`Status ${status}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

