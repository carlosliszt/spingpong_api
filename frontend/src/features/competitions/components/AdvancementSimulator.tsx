import type { GroupStanding, Athlete } from '@/shared/types/domain';
import { splitOpenLevels } from '@/features/competition-engine/useCases';

export function AdvancementSimulator({ standingsByGroup, athletes }: { standingsByGroup: Record<string, GroupStanding[]>; athletes: Athlete[] }) {
  const athletesById = Object.fromEntries(athletes.map((a) => [a.id, a]));
  const levels = splitOpenLevels(standingsByGroup, athletesById);

  return (
    <section className="card" aria-label="Simulador de avancos">
      <h3 className="mb-3 text-lg font-semibold">Simulacao de avancos (SPING_OPEN)</h3>
      <div className="grid gap-2 md:grid-cols-4">
        {Object.entries(levels).map(([level, levelAthletes]) => (
          <div key={level} className="rounded-md border border-slate-200 p-2">
            <div className="font-medium">Nivel {level}</div>
            <div className="text-sm text-slate-600">{levelAthletes.length} atletas</div>
          </div>
        ))}
      </div>
    </section>
  );
}

