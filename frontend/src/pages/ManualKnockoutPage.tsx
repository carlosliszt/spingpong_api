import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks/useFeedback';
import type { Athlete } from '@/shared/types/domain';

type Row = { atletaA?: number; atletaB?: number; fase: string; categoria?: string; bye?: boolean };

export default function ManualKnockoutPage() {
  const qc = useQueryClient();
  const { showError, showSuccess } = useFeedback();
  const athletesQ = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });
  const competitionsQ = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  const athletes = athletesQ.data ?? [];
  const competitions = competitionsQ.data ?? [];

  const [competitionId, setCompetitionId] = useState<number | null>(competitions[0]?.id ?? null);
  const [rows, setRows] = useState<Row[]>([{ fase: 'OITAVAS', categoria: '', bye: false }]);

  const addRow = () => setRows((r) => [...r, { fase: 'OITAVAS', categoria: '', bye: false }]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));

  const createMatches = async () => {
    if (!competitionId) return showError('Selecione uma competição');
    try {
      for (const row of rows) {
        // build fase with category for SPING_OPEN levels if provided
        const catPrefix = row.categoria ? `OPEN_${String(row.categoria).toUpperCase()}_` : '';
        const fase = `${catPrefix}${row.fase}`;

        if (row.bye) {
          // create a BYE match: only atletaA required
          if (!row.atletaA) continue;
          const payload: any = {
            competicao_id: Number(competitionId),
            fase,
            atleta_a_id: row.atletaA,
            bye: true,
            status: 'W_O'
          };
          await services.createMatch(payload);
          continue;
        }

        if (!row.atletaA || !row.atletaB) continue;
        const payload = {
          competicao_id: Number(competitionId),
          fase,
          atleta_a_id: row.atletaA,
          atleta_b_id: row.atletaB,
          status: 'AGENDADO'
        } as any;
        await services.createMatch(payload);
      }
      showSuccess('Jogos do mata-mata criados');
      await qc.invalidateQueries({ queryKey: ['matches'] });
    } catch (err: any) {
      showError(err?.message || 'Erro ao criar jogos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading-page">Inserir Mata-mata Manualmente</h1>
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
        <Section title="Mata-mata Manual" subtitle="Adicione linhas com os confrontos e fases">
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                <div>
                  <label className="form-label">Jogador A</label>
                  <select className="select" value={r.atletaA ?? ''} onChange={(e) => setRows((old) => { const c = [...old]; c[i].atletaA = Number(e.target.value) || undefined; return c; })}>
                    <option value="">-- selecione --</option>
                    {athletes.map((a: Athlete) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Jogador B</label>
                  <select className="select" value={r.atletaB ?? ''} onChange={(e) => setRows((old) => { const c = [...old]; c[i].atletaB = Number(e.target.value) || undefined; return c; })} disabled={!!r.bye}>
                    <option value="">-- selecione --</option>
                    {athletes.map((a: Athlete) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Fase</label>
                  <select className="select" value={r.fase} onChange={(e) => setRows((old) => { const c = [...old]; c[i].fase = e.target.value; return c; })}>
                    <option>OITAVAS</option>
                    <option>QUARTAS</option>
                    <option>SEMI</option>
                    <option>FINAL</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Categoria</label>
                  <select className="select" value={r.categoria ?? ''} onChange={(e) => setRows((old) => { const c = [...old]; c[i].categoria = e.target.value; return c; })}>
                    <option value="">— Nenhuma —</option>
                    <option value="A">Nível A</option>
                    <option value="B">Nível B</option>
                    <option value="C">Nível C</option>
                    <option value="D">Nível D</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!r.bye} onChange={(e) => setRows((old) => { const c = [...old]; c[i].bye = e.target.checked; if (e.target.checked) c[i].atletaB = undefined; return c; })} />
                    <span className="text-sm">BYE</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => removeRow(i)}>Remover</Button>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={addRow}>➕ Adicionar Confronto</Button>
              <Button variant="primary" onClick={createMatches}>Criar Jogos</Button>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  );
}


