import { useState } from 'react';
import { Button, Input, Card, Section } from '@/shared/components/ui';
import type { MatchSet } from '@/shared/types/domain';

type Props = {
  initialSets?: MatchSet[];
  jogoId: number;
  athleteAName?: string;
  athleteBName?: string;
  onSave: (sets: MatchSet[]) => void;
};

const BEST_OF_FIVE = [1, 2, 3, 4, 5];

export function MatchScoreEditor({
  initialSets = [],
  jogoId,
  athleteAName = 'Atleta A',
  athleteBName = 'Atleta B',
  onSave
}: Props) {
  const [sets, setSets] = useState<MatchSet[]>(
    initialSets.length
      ? initialSets
      : BEST_OF_FIVE.map((n) => ({ jogo_id: jogoId, numero_set: n, pontos_a: 0, pontos_b: 0 }))
  );

  const updateSet = (index: number, field: 'pontos_a' | 'pontos_b', value: number) => {
    const copy = [...sets];
    copy[index] = { ...copy[index], [field]: value };
    setSets(copy);
  };

  const winsA = sets.filter((s) => (s.pontos_a ?? 0) > (s.pontos_b ?? 0) && ((s.pontos_a ?? 0) > 0 || (s.pontos_b ?? 0) > 0)).length;
  const winsB = sets.filter((s) => (s.pontos_b ?? 0) > (s.pontos_a ?? 0) && ((s.pontos_a ?? 0) > 0 || (s.pontos_b ?? 0) > 0)).length;

  return (
    <Card>
      <Section title="🎮 Editor de Placar" subtitle="Melhor de 5 sets">
        <div className="space-y-4">
          {/* Sets Grid */}
          <div className="space-y-2">
            {sets.map((set, i) => (
              <div key={set.numero_set} className="grid grid-cols-6 gap-2 items-end">
                <div className="text-sm font-semibold text-neutral-600">Set {set.numero_set}</div>
                <Input
                  type="number"
                  min="0"
                  placeholder="Pontos"
                  value={set.pontos_a ?? 0}
                  onChange={(e) => updateSet(i, 'pontos_a', Number(e.target.value))}
                  aria-label={`${athleteAName} - Set ${set.numero_set}`}
                />
                <div className="text-center text-lg font-bold text-neutral-600">×</div>
                <Input
                  type="number"
                  min="0"
                  placeholder="Pontos"
                  value={set.pontos_b ?? 0}
                  onChange={(e) => updateSet(i, 'pontos_b', Number(e.target.value))}
                  aria-label={`${athleteBName} - Set ${set.numero_set}`}
                />
                <div className="text-right">
                  {(set.pontos_a ?? 0) > (set.pontos_b ?? 0) && ((set.pontos_a ?? 0) > 0 || (set.pontos_b ?? 0) > 0) && (
                    <span className="text-xs font-semibold text-success-600">✓ A</span>
                  )}
                  {(set.pontos_b ?? 0) > (set.pontos_a ?? 0) && ((set.pontos_a ?? 0) > 0 || (set.pontos_b ?? 0) > 0) && (
                    <span className="text-xs font-semibold text-success-600">✓ B</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Score Summary */}
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-neutral-600">{athleteAName}</p>
                <p className="text-2xl font-bold text-neutral-900">{winsA}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Sets</p>
                <p className="text-lg text-neutral-600">de</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">{athleteBName}</p>
                <p className="text-2xl font-bold text-neutral-900">{winsB}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setSets((s) => [...s, { jogo_id: jogoId, numero_set: s.length + 1, pontos_a: 0, pontos_b: 0 }])}
              className="flex-1"
            >
              ➕ Adicionar Set
            </Button>
            <Button
              variant="primary"
              onClick={() => onSave(sets)}
              className="flex-1"
            >
              💾 Salvar Placar
            </Button>
          </div>
        </div>
      </Section>
    </Card>
  );
}

