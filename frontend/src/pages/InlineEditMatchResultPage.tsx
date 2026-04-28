import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Input, Alert, Modal } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';
import { recordMatchResultChange } from '@/shared/utils/auditTrail';
import type { Match } from '@/shared/types/domain';

type ResultSetForm = {
  numero_set: number;
  pontos_a: number;
  pontos_b: number;
};

const BEST_OF_FIVE = [1, 2, 3, 4, 5];

export function InlineEditMatchResultPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  const qc = useQueryClient();
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [sets, setSets] = useState<ResultSetForm[]>(
    BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 }))
  );

  const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const finishedMatches = useMemo(() => {
    const finished = (matchesQuery.data ?? []).filter((m) => m.status === 'FINALIZADO');
    return competitionIdFromRoute ? finished.filter((m) => m.competicao_id === competitionIdFromRoute) : finished;
  }, [matchesQuery.data, competitionIdFromRoute]);

  const editingMatch = useMemo(
    () => finishedMatches.find((m) => m.id === editingMatchId),
    [finishedMatches, editingMatchId]
  );

  // Load sets when modal opens
  const openEditModal = (match: Match) => {
    setEditingMatchId(match.id);
    const loaded = (match.sets ?? []).map((s) => ({
      numero_set: s.numero_set,
      pontos_a: s.pontos_a ?? 0,
      pontos_b: s.pontos_b ?? 0
    }));
    setSets(loaded.length ? loaded : BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 })));
  };

  const closeEditModal = () => {
    setEditingMatchId(null);
    setSets(BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 })));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!editingMatchId) throw new Error('Nenhum jogo selecionado');

      const played = sets.filter((s) => s.pontos_a !== s.pontos_b && (s.pontos_a > 0 || s.pontos_b > 0));
      const winsA = played.filter((s) => s.pontos_a > s.pontos_b).length;
      const winsB = played.filter((s) => s.pontos_b > s.pontos_a).length;

      if (played.length < 3 || Math.max(winsA, winsB) !== 3 || played.length > 5) {
        throw new Error('Jogo melhor de 5: informe de 3 a 5 sets e um vencedor com 3 sets ganhos.');
      }

      const oldMatch = editingMatch!;
      const updatedMatch = await services.updateMatchResult({
        jogoId: editingMatchId,
        sets: played.map((set) => ({ ...set, jogo_id: editingMatchId }))
      });

      // Registra mudança no histórico
      await recordMatchResultChange(oldMatch, updatedMatch);

      return updatedMatch;
    },
    onSuccess: () => {
      showSuccess('Resultado alterado com sucesso!');
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['bracket'] });
      closeEditModal();
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
        <h1 className="heading-page">📋 Editar Resultados (Inline)</h1>
        <p className="text-neutral-600">
          Clique em qualquer jogo finalizado para editar o resultado
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

      {/* Results Table */}
      <Card>
        <Section title="Resultados Finalizados" subtitle={`Total: ${finishedMatches.length} jogos`}>
          {finishedMatches.length === 0 ? (
            <p className="text-neutral-600 text-center py-8">Nenhum jogo finalizado encontrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left px-4 py-2 font-semibold text-neutral-700">Fase</th>
                    <th className="text-left px-4 py-2 font-semibold text-neutral-700">Atleta A</th>
                    <th className="text-center px-4 py-2 font-semibold text-neutral-700">Resultado</th>
                    <th className="text-left px-4 py-2 font-semibold text-neutral-700">Atleta B</th>
                    <th className="text-center px-4 py-2 font-semibold text-neutral-700">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {finishedMatches.map((match) => {
                    const winsA = (match.sets ?? []).filter((s) => (s.pontos_a ?? 0) > (s.pontos_b ?? 0)).length;
                    const winsB = (match.sets ?? []).filter((s) => (s.pontos_b ?? 0) > (s.pontos_a ?? 0)).length;

                    return (
                      <tr key={match.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition">
                        <td className="px-4 py-3 text-xs font-medium text-neutral-600">{match.fase}</td>
                        <td className="px-4 py-3 font-medium text-neutral-900">
                          {match.atleta_a_nome || `Atleta ${match.atleta_a_id}`}
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          <span className="bg-brand-100 text-brand-700 px-2 py-1 rounded text-xs font-bold">
                            {winsA} × {winsB}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900">
                          {match.atleta_b_nome || `Atleta ${match.atleta_b_id}`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                            onClick={() => openEditModal(match)}
                          >
                            ✏️ Editar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Card>

      {/* Back Button */}
      <Link to={competitionIdFromRoute ? `/competicoes/${competitionIdFromRoute}/operacoes` : '/competicoes'}>
        <Button variant="secondary" isBlock>
          ↩️ Voltar
        </Button>
      </Link>

      {/* Edit Modal */}
      <Modal
        isOpen={editingMatchId !== null}
        onClose={closeEditModal}
        title={
          editingMatch
            ? `✏️ Editar: ${editingMatch.atleta_a_nome || `Atleta ${editingMatch.atleta_a_id}`} vs ${editingMatch.atleta_b_nome || `Atleta ${editingMatch.atleta_b_id}`}`
            : 'Editar Resultado'
        }
        actions={[
          {
            label: 'Cancelar',
            onClick: closeEditModal,
            variant: 'secondary'
          },
          {
            label: mutation.isPending ? 'Salvando...' : '💾 Salvar Alterações',
            onClick: () => mutation.mutate(),
            variant: 'primary'
          }
        ]}
      >
        {editingMatch && (
          <div className="space-y-4">
            {/* Match Info */}
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
              <p className="text-xs text-neutral-600 mb-2">Informações do Jogo:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-neutral-600">Fase:</p>
                  <p className="font-semibold">{editingMatch.fase}</p>
                </div>
                <div>
                  <p className="text-neutral-600">Status:</p>
                  <p className="font-semibold">{editingMatch.status}</p>
                </div>
              </div>
            </div>

            {/* Sets Editor */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-neutral-700">Placar (Melhor de 5)</p>
              {sets.map((set, i) => (
                <div key={set.numero_set} className="flex items-end gap-2">
                  <div className="text-xs font-semibold text-neutral-600 w-12">Set {set.numero_set}</div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Pts A"
                    value={set.pontos_a}
                    onChange={(e) => updateSet(i, 'pontos_a', Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-center font-bold text-neutral-600 w-8">×</div>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Pts B"
                    value={set.pontos_b}
                    onChange={(e) => updateSet(i, 'pontos_b', Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>

            {/* Score Summary */}
            <div className="p-3 bg-brand-50 rounded border border-brand-200">
              <p className="text-xs text-brand-700 font-semibold mb-2">Resumo:</p>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-700">{winsA}</p>
                  <p className="text-xs text-brand-600">{editingMatch.atleta_a_nome || `Atleta A`}</p>
                </div>
                <p className="text-neutral-600 font-bold">sets</p>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-700">{winsB}</p>
                  <p className="text-xs text-brand-600">{editingMatch.atleta_b_nome || `Atleta B`}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}



