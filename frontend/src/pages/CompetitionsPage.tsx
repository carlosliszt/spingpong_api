import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { CompetitionStatusBadge } from '@/shared/components/CompetitionStatusBadge';

type FormState = {
  nome: string;
  tipo: 'SPING_OPEN' | 'SPING_FOODS';
  data_inicio: string;
  data_fim?: string;
  status: 'PLANEJADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
  local?: string;
};

const initialState: FormState = {
  nome: '',
  tipo: 'SPING_FOODS',
  data_inicio: '',
  data_fim: '',
  status: 'PLANEJADA',
  local: ''
};

export function CompetitionsPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  const createMutation = useMutation({
    mutationFn: () => services.createCompetition(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      setForm(initialState);
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateCompetition(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      setEditingId(null);
      setForm(initialState);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteCompetition(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['competitions'] })
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Competicoes (CRUD)</h1>
        <Link className="btn-primary" to="/competicoes/wizard">Wizard</Link>
      </div>

      <section className="card space-y-2">
        <h2 className="font-semibold">{editingId ? `Editar competicao #${editingId}` : 'Nova competicao'}</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="input" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <select className="input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as FormState['tipo'] })}>
            <option value="SPING_OPEN">SPING_OPEN</option>
            <option value="SPING_FOODS">SPING_FOODS</option>
          </select>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}>
            <option value="PLANEJADA">PLANEJADA</option>
            <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
          <label className="text-sm text-slate-600">
            Data de inicio do torneio
            <input className="input mt-1" type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
          </label>
          <label className="text-sm text-slate-600">
            Data de fim do torneio
            <input className="input mt-1" type="date" value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} />
          </label>
          <input className="input" placeholder="Local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => (editingId ? updateMutation.mutate() : createMutation.mutate())}>{editingId ? 'Atualizar' : 'Criar'}</button>
          {editingId ? <button className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialState); }}>Cancelar</button> : null}
        </div>
      </section>

      <div className="space-y-2">
        {competitions.data?.map((c) => (
          <div key={c.id} className="card flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold">{c.nome}</h3>
              <p className="text-sm text-slate-500">{c.tipo} | {c.data_inicio} | {c.local ?? '-'}</p>
            </div>
            <div className="flex items-center gap-2">
              <CompetitionStatusBadge status={c.status} />
              <button className="btn-secondary" onClick={() => { setEditingId(c.id); setForm({ nome: c.nome, tipo: c.tipo, status: c.status, data_inicio: c.data_inicio, data_fim: c.data_fim ?? '', local: c.local ?? '' }); }}>Editar</button>
              <button className="btn-secondary" onClick={() => deleteMutation.mutate(c.id)}>Excluir</button>
              <Link className="btn-secondary" to={`/competicoes/${c.id}/operacoes`}>Operacoes</Link>
              <Link className="btn-secondary" to={`/competicoes/${c.id}/grupos`}>Grupos</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
