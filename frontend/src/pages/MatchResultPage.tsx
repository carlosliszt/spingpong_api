import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

type ResultSetForm = {
  numero_set: number;
  pontos_a: number;
  pontos_b: number;
};

const BEST_OF_FIVE = [1, 2, 3, 4, 5];

export function MatchResultPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  const qc = useQueryClient();
  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);
  const [sets, setSets] = useState<ResultSetForm[]>(
    BEST_OF_FIVE.map((n) => ({ numero_set: n, pontos_a: 0, pontos_b: 0 }))
  );
  const [feedback, setFeedback] = useState('');

  const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const selectableMatches = useMemo(() => {
    const pending = (matchesQuery.data ?? []).filter((m) => m.status !== 'FINALIZADO' && m.status !== 'CANCELADO');
    return competitionIdFromRoute ? pending.filter((m) => m.competicao_id === competitionIdFromRoute) : pending;
  }, [matchesQuery.data, competitionIdFromRoute]);

  const selectedMatch = useMemo(
    () => selectableMatches.find((m) => m.id === selectedMatchId),
    [selectableMatches, selectedMatchId]
  );

  const mutation = useMutation({
    mutationFn: () => {
      const played = sets.filter((s) => s.pontos_a !== s.pontos_b && (s.pontos_a > 0 || s.pontos_b > 0));
      const winsA = played.filter((s) => s.pontos_a > s.pontos_b).length;
      const winsB = played.filter((s) => s.pontos_b > s.pontos_a).length;

      if (played.length < 3 || Math.max(winsA, winsB) !== 3 || played.length > 5) {
        throw new Error('Jogo melhor de 5: informe de 3 a 5 sets e um vencedor com 3 sets ganhos.');
      }

      return services.registerMatchResult({
        jogoId: selectedMatchId,
        sets: played.map((set) => ({ ...set, jogo_id: selectedMatchId }))
      });
    },
    onSuccess: () => {
      setFeedback('Resultado registrado com sucesso.');
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['history-results'] });
      qc.invalidateQueries({ queryKey: ['history-rating'] });
    },
    onError: (error: any) => setFeedback(error?.response?.data?.message || error?.message || 'Falha ao registrar resultado')
  });

  const updateSet = (index: number, key: 'pontos_a' | 'pontos_b', value: number) => {
    setSets((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Lancamento de resultado {competitionIdFromRoute ? `- Torneio #${competitionIdFromRoute}` : 'de jogo'}
      </h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">Selecionar jogo pendente</h2>
        <select
          className="input"
          value={selectedMatchId || ''}
          onChange={(e) => setSelectedMatchId(Number(e.target.value))}
        >
          <option value="">Selecione um jogo pendente</option>
          {selectableMatches.map((m) => (
            <option key={m.id} value={m.id}>
              #{m.id} | {m.fase} | {m.atleta_a_nome ?? m.atleta_a_id} x {m.atleta_b_nome ?? m.atleta_b_id}
            </option>
          ))}
        </select>

        {selectedMatch ? (
          <p className="text-sm text-slate-700">
            Jogadores:{' '}
            <Link className="text-brand-700 hover:underline" to="/atletas">{selectedMatch.atleta_a_nome ?? selectedMatch.atleta_a_id}</Link>
            {' x '}
            <Link className="text-brand-700 hover:underline" to="/atletas">{selectedMatch.atleta_b_nome ?? selectedMatch.atleta_b_id}</Link>
          </p>
        ) : null}
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">Placar (melhor de 5 sets)</h2>
        {sets.map((set, i) => (
          <div key={set.numero_set} className="grid gap-2 md:grid-cols-3">
            <div className="input bg-slate-50">Set {set.numero_set}</div>
            <input className="input" type="number" value={set.pontos_a} onChange={(e) => updateSet(i, 'pontos_a', Number(e.target.value))} />
            <input className="input" type="number" value={set.pontos_b} onChange={(e) => updateSet(i, 'pontos_b', Number(e.target.value))} />
          </div>
        ))}
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => mutation.mutate()} disabled={!selectedMatchId || mutation.isPending}>
            Registrar resultado
          </button>
        </div>
        {feedback ? <p className="text-sm text-slate-700">{feedback}</p> : null}
      </section>
    </div>
  );
}
