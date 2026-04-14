import { useState } from 'react';
import type { OpenLevelsMap } from '@/features/competition-engine/types';
import { createBracketWithByes } from '@/features/competition-engine/useCases';
import { KnockoutBracket } from './KnockoutBracket';

const TABS = ['A', 'B', 'C', 'D'] as const;

export function OpenLevelsTabs({ levels }: { levels: OpenLevelsMap }) {
  const [active, setActive] = useState<(typeof TABS)[number]>('A');
  const bracket = createBracketWithByes(levels[active]);

  return (
    <section className="space-y-3" aria-label="Niveis SPING_OPEN">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button key={tab} className={active === tab ? 'btn-primary' : 'btn-secondary'} onClick={() => setActive(tab)}>
            Nivel {tab}
          </button>
        ))}
      </div>
      <KnockoutBracket title={`Chave Nivel ${active}`} matches={bracket} />
    </section>
  );
}

