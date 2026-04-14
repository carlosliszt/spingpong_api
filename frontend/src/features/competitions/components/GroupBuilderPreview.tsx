import type { SeededGroup } from '@/features/competition-engine/types';

export function GroupBuilderPreview({ groups }: { groups: SeededGroup[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {groups.map((group) => (
        <section key={group.id} className="card" aria-label={`Preview ${group.nome}`}>
          <h4 className="mb-2 font-semibold">{group.nome}</h4>
          <ol className="space-y-1 text-sm">
            {group.atletas.map((athlete, i) => (
              <li key={athlete.id} className="flex justify-between border-b border-slate-100 py-1">
                <span>{i + 1}. {athlete.nome}</span>
                <span>{athlete.rating_atual}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

