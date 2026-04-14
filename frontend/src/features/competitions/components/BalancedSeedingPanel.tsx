import { balanceGroupsByRating } from '@/features/competition-engine/useCases';
import type { Athlete } from '@/shared/types/domain';
import { GroupBuilderPreview } from './GroupBuilderPreview';

export function BalancedSeedingPanel({ athletes, groupsCount }: { athletes: Athlete[]; groupsCount: number }) {
  const groups = balanceGroupsByRating(athletes, groupsCount);

  return (
    <section className="space-y-3" aria-label="Painel de seeding balanceado">
      <div className="card bg-brand-50 text-sm text-brand-700">
        Seeding snake aplicado por rating para equilibrar cabecas de chave e distribuicao dos atletas.
      </div>
      <GroupBuilderPreview groups={groups} />
    </section>
  );
}

