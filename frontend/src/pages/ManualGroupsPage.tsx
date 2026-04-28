import { useMemo, useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Input } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks/useFeedback';
import type { Athlete } from '@/shared/types/domain';

export default function ManualGroupsPage() {
  const qc = useQueryClient();
  const { showError, showSuccess } = useFeedback();
  const athletesQ = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const registrationsQ = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const competitionsQ = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  const athletes = athletesQ.data ?? [];
  const registrations = registrationsQ.data ?? [];
  const competitions = competitionsQ.data ?? [];

  const [competitionId, setCompetitionId] = useState<number | null>(competitions[0]?.id ?? null);
  const [groups, setGroups] = useState<Array<{ id: string; nome: string; athleteIds: number[] }>>([
    { id: 'G1', nome: 'Grupo 1', athleteIds: [] }
  ]);

  // const athleteMap = useMemo(() => Object.fromEntries(athletes.map((a) => [a.id, a])), [athletes]);

  const toggleAthlete = (groupIndex: number, athleteId: number) => {
    setGroups((g) => {
      const copy = [...g];
      const idx = copy[groupIndex].athleteIds.indexOf(athleteId);
      if (idx === -1) copy[groupIndex].athleteIds.push(athleteId);
      else copy[groupIndex].athleteIds.splice(idx, 1);
      return copy;
    });
  };

  const addGroup = () => setGroups((g) => [...g, { id: `G${g.length + 1}`, nome: `Grupo ${g.length + 1}`, athleteIds: [] }]);
  const removeGroup = (i: number) => setGroups((g) => g.filter((_, idx) => idx !== i));

  const ensureRegistrations = async (athleteIds: number[]) => {
    const toCreate = athleteIds.filter((id) => !registrations.some((r) => r.competicao_id === competitionId && r.atleta_id === id));
    for (const atleta_id of toCreate) {
      try {
        await services.createRegistration({ competicao_id: Number(competitionId), atleta_id });
      } catch (err) {
        // ignore, continue
      }
    }
    // refresh registrations
    await qc.invalidateQueries({ queryKey: ['registrations'] });
  };

  const onGenerate = async () => {
    if (!competitionId) return showError('Selecione uma competição');
    try {
      // flatten athlete ids and ensure registrations
      const athleteIds = Array.from(new Set(groups.flatMap((g) => g.athleteIds)));
      await ensureRegistrations(athleteIds);
      const payload = { competitionId: Number(competitionId), groups };
      await services.generateGroupMatches(payload);
      showSuccess('Jogos de grupos gerados com sucesso');
      await qc.invalidateQueries({ queryKey: ['matches'] });
      await qc.invalidateQueries({ queryKey: ['registrations'] });
    } catch (err: any) {
      showError(err?.message || 'Erro ao gerar jogos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-page">Gerar Grupos Manualmente</h1>
        <div>
          <select className="select" value={competitionId ?? ''} onChange={(e) => setCompetitionId(Number(e.target.value))}>
            <option value="">-- Selecionar competição --</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Section title="Grupos" subtitle="Crie manualmente os grupos conforme seu papel" >
          <div className="space-y-4">
            {groups.map((g, i) => (
              <div key={g.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <Input value={g.nome} onChange={(e) => setGroups((old) => { const c = [...old]; c[i].nome = e.target.value; return c; })} />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => removeGroup(i)}>Remover</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {athletes.map((a: Athlete) => (
                    <label key={a.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={g.athleteIds.includes(a.id)} onChange={() => toggleAthlete(i, a.id)} />
                      <span>{a.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={addGroup}>➕ Adicionar Grupo</Button>
              <Button variant="primary" onClick={onGenerate}>🛠️ Gerar Jogos dos Grupos</Button>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}


