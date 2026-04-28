import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Input, Select, Alert } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';
import { recordMatchResultChange } from '@/shared/utils/auditTrail';

type ResultSetForm = {
  numero_set: number;
  pontos_a: number;
  pontos_b: number;
};

const BEST_OF_FIVE = [1, 2, 3, 4, 5];

export function EditMatchResultPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  const qc = useQueryClient();
  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);
  const [sets, setSets] = useState<ResultSetForm[]>(
    BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 }))
  );
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const selectableMatches = useMemo(() => {
    const finished = (matchesQuery.data ?? []).filter((m) => m.status === 'FINALIZADO');
    return competitionIdFromRoute ? finished.filter((m) => m.competicao_id === competitionIdFromRoute) : finished;
  }, [matchesQuery.data, competitionIdFromRoute]);

  const selectedMatch = useMemo(
    () => selectableMatches.find((m) => m.id === selectedMatchId),
    [selectableMatches, selectedMatchId]
  );

  // Load sets when a match is selected
  useMemo(async () => {
    if (selectedMatchId && selectedMatch?.sets) {
      const loaded = selectedMatch.sets.map((s) => ({
        numero_set: s.numero_set,
        pontos_a: s.pontos_a ?? 0,
        pontos_b: s.pontos_b ?? 0
      }));
      setSets(loaded.length ? loaded : BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 })));
    }
  }, [selectedMatchId, selectedMatch?.sets]);

  const mutation = useMutation({
    mutationFn: async () => {
      const played = sets.filter((s) => s.pontos_a !== s.pontos_b && (s.pontos_a > 0 || s.pontos_b > 0));
      const winsA = played.filter((s) => s.pontos_a > s.pontos_b).length;
      const winsB = played.filter((s) => s.pontos_b > s.pontos_a).length;

      if (played.length < 3 || Math.max(winsA, winsB) !== 3 || played.length > 5) {
        throw new Error('Jogo melhor de 5: informe de 3 a 5 sets e um vencedor com 3 sets ganhos.');
      }

      const oldMatch = selectedMatch!;
      const updatedMatch = await services.updateMatchResult({
        jogoId: selectedMatchId,
        sets: played.map((set) => ({ ...set, jogo_id: selectedMatchId }))
      });

      // Registra mudança no histórico
      await recordMatchResultChange(oldMatch, updatedMatch);

      return updatedMatch;
    },
    onSuccess: () => {
      showSuccess('Resultado alterado com sucesso!');
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['bracket'] });
      setSelectedMatchId(0);
      setSets(BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 })));
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || error?.message || 'Falha ao alterar resultado');
    }
  });

  const updateSet = (index: number, key: 'pontos_a' | 'pontos_b', value: number) => {
    setSets((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const winsA = sets.filter((s) => s.pontos_a > s.pontos_b && (s.pontos_a > 0 || s.pontos_b > 0)).length;
  const winsB = sets.filter((s) => s.pontos_b > s.pontos_a && (s.pontos_a > 0 || s.pontos_b > 0)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">✏️ Editar Resultado</h1>
        <p className="text-neutral-600">
          {competitionIdFromRoute ? `Edite resultados do Torneio #${competitionIdFromRoute}` : 'Edite resultados de qualquer jogo finalizados'}
        </p>
      </div>

      {feedback && (
        <Alert
          type={feedback.type === 'success' ? 'success' : 'danger'}
          onClose={clear}
        >
          {feedback.msg}
        </Alert>
      )}

      {/* Match Selection */}
      <Card>
        <Section title="1️⃣ Selecione o Jogo" subtitle="Escolha um jogo já finalizado para editar o resultado">
          <Select
            label="Jogo Finalizado"
            value={selectedMatchId || ''}
            onChange={(e) => setSelectedMatchId(Number(e.target.value))}
            options={[
              { value: '', label: 'Selecione um jogo...' },
              ...selectableMatches.map((m) => ({
                value: m.id,
                label: `${m.atleta_a_nome || `Atleta ${m.atleta_a_id}`} vs ${m.atleta_b_nome || `Atleta ${m.atleta_b_id}`} (${m.fase})`
              }))
            ]}
          />

          {selectedMatch ? (
            <div className="mt-4 p-4 rounded-lg bg-brand-50 border border-brand-200">
              <p className="text-sm font-medium text-neutral-700 mb-2">Jogadores:</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-brand-600 font-medium">
                    {selectedMatch.atleta_a_nome || `Atleta ${selectedMatch.atleta_a_id}`}
                  </span>
                </div>
                <span className="text-neutral-600 mx-3 font-semibold">vs</span>
                <div className="flex-1 text-right">
                  <span className="text-brand-600 font-medium">
                    {selectedMatch.atleta_b_nome || `Atleta ${selectedMatch.atleta_b_id}`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-2">Fase: <strong>{selectedMatch.fase}</strong></p>
              <p className="text-xs text-neutral-600">Status: <strong>{selectedMatch.status}</strong></p>
            </div>
          ) : null}
        </Section>
      </Card>

      {/* Score Entry */}
      {selectedMatch ? (
        <Card>
          <Section title="2️⃣ Altere o Placar" subtitle="Melhor de 5 sets - Mínimo 3 sets disputados">
            <div className="space-y-3">
              {sets.map((set, i) => (
                <div key={set.numero_set} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="form-label">Set {set.numero_set}</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder={selectedMatch.atleta_a_nome || `Atleta A`}
                        value={set.pontos_a}
                        onChange={(e) => updateSet(i, 'pontos_a', Number(e.target.value))}
                      />
                      <div className="flex-center text-lg font-bold text-neutral-600">×</div>
                      <Input
                        type="number"
                        min="0"
                        placeholder={selectedMatch.atleta_b_nome || `Atleta B`}
                        value={set.pontos_b}
                        onChange={(e) => updateSet(i, 'pontos_b', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Score Summary */}
              <div className="mt-6 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <p className="text-sm font-medium text-neutral-700 mb-3">Resumo do Placar:</p>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-neutral-900">{winsA}</p>
                    <p className="text-xs text-neutral-600">Sets ganhos</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-neutral-900">{winsB}</p>
                    <p className="text-xs text-neutral-600">Sets ganhos</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </Card>
      ) : null}

      {/* Submit Button */}
      {selectedMatch ? (
        <div className="sticky bottom-4">
          <Button
            variant="primary"
            isBlock
            isLoading={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="py-3 text-base"
          >
            ✏️ Atualizar Resultado do Jogo
          </Button>
        </div>
      ) : null}

      {/* Back Button */}
      <Link to={competitionIdFromRoute ? `/competicoes/${competitionIdFromRoute}/operacoes` : '/competicoes'}>
        <Button variant="secondary" isBlock>
          ↩️ Voltar
        </Button>
      </Link>
    </div>
  );
}

