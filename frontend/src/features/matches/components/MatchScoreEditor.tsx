import { useState } from 'react';
import type { MatchSet } from '@/shared/types/domain';

type Props = {
  initialSets?: MatchSet[];
  jogoId: number;
  onSave: (sets: MatchSet[]) => void;
};

export function MatchScoreEditor({ initialSets = [], jogoId, onSave }: Props) {
  const [sets, setSets] = useState<MatchSet[]>(
    initialSets.length ? initialSets : [{ jogo_id: jogoId, numero_set: 1, pontos_a: 0, pontos_b: 0 }]
  );

  const updateSet = (index: number, field: 'pontos_a' | 'pontos_b', value: number) => {
    const copy = [...sets];
    copy[index] = { ...copy[index], [field]: value };
    setSets(copy);
  };

  return (
    <div className="space-y-3" aria-label="Editor de placar por sets">
      {sets.map((set, i) => (
        <div key={set.numero_set} className="grid grid-cols-3 gap-2">
          <span className="text-sm">Set {set.numero_set}</span>
          <input className="input" type="number" value={set.pontos_a} onChange={(e) => updateSet(i, 'pontos_a', Number(e.target.value))} />
          <input className="input" type="number" value={set.pontos_b} onChange={(e) => updateSet(i, 'pontos_b', Number(e.target.value))} />
        </div>
      ))}
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => setSets((s) => [...s, { jogo_id: jogoId, numero_set: s.length + 1, pontos_a: 0, pontos_b: 0 }])}>
          Adicionar set
        </button>
        <button className="btn-primary" onClick={() => onSave(sets)}>
          Salvar placar
        </button>
      </div>
    </div>
  );
}

