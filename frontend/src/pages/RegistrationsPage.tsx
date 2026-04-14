import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

type FormState = {
  competicao_id: number;
  atleta_id: number;
  seed_num?: number;
  status: 'INSCRITO' | 'CONFIRMADO' | 'CANCELADO';
};

const initialState: FormState = { competicao_id: 0, atleta_id: 0, seed_num: undefined, status: 'INSCRITO' };

export function RegistrationsPage() {
  const { id } = useParams();
  const competitionIdFromRoute = id ? Number(id) : 0;

  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(
    competitionIdFromRoute ? { ...initialState, competicao_id: competitionIdFromRoute } : initialState
  );

  const registrationsQuery = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const competitionsQuery = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const competition = useMemo(
    () => (competitionsQuery.data ?? []).find((c) => c.id === (competitionIdFromRoute || form.competicao_id)),
    [competitionsQuery.data, competitionIdFromRoute, form.competicao_id]
  );

  const registrations = useMemo(() => {
    const all = registrationsQuery.data ?? [];
    if (!competitionIdFromRoute) return all;
    return all.filter((r) => r.competicao_id === competitionIdFromRoute);
  }, [registrationsQuery.data, competitionIdFromRoute]);

  const createMutation = useMutation({
    mutationFn: () => services.createRegistration({ ...form, competicao_id: competitionIdFromRoute || form.competicao_id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      setForm({ ...initialState, competicao_id: competitionIdFromRoute || 0 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateRegistration(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      setEditingId(null);
      setForm({ ...initialState, competicao_id: competitionIdFromRoute || 0 });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (rid: number) => services.deleteRegistration(rid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['registrations'] })
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Inscricoes {competition ? `- ${competition.nome}` : '(por torneio)'}
      </h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">{editingId ? `Editar inscricao #${editingId}` : 'Nova inscricao'}</h2>
        <div className="grid gap-2 md:grid-cols-4">
          {!competitionIdFromRoute ? (
            <select className="input" value={form.competicao_id || ''} onChange={(e) => setForm({ ...form, competicao_id: Number(e.target.value) })}>
              <option value="">Selecione a competicao</option>
              {(competitionsQuery.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          ) : (
            <div className="input bg-slate-50">Competicao #{competitionIdFromRoute}</div>
          )}

          <select className="input" value={form.atleta_id || ''} onChange={(e) => setForm({ ...form, atleta_id: Number(e.target.value) })}>
            <option value="">Selecione o atleta</option>
            {(athletesQuery.data ?? []).map((a) => (
              <option key={a.id} value={a.id}>{a.nome} (PT.RAT {a.rating_atual})</option>
            ))}
          </select>

          <input className="input" type="number" placeholder="seed_num" value={form.seed_num ?? ''} onChange={(e) => setForm({ ...form, seed_num: e.target.value ? Number(e.target.value) : undefined })} />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}>
            <option value="INSCRITO">INSCRITO</option>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => (editingId ? updateMutation.mutate() : createMutation.mutate())}>
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
          {editingId ? <button className="btn-secondary" onClick={() => { setEditingId(null); setForm({ ...initialState, competicao_id: competitionIdFromRoute || 0 }); }}>Cancelar</button> : null}
        </div>
      </section>

      <section className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>ID</th><th>Competicao</th><th>Atleta</th><th>Seed</th><th>Status</th><th>Acoes</th></tr></thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td>{r.id}</td>
                <td>{r.competicao_nome ?? r.competicao_id}</td>
                <td><Link className="text-brand-700 hover:underline" to="/atletas">{r.atleta_nome ?? r.atleta_id}</Link></td>
                <td>{r.seed_num ?? '-'}</td>
                <td>{r.status}</td>
                <td className="space-x-2">
                  <button className="btn-secondary" onClick={() => { setEditingId(r.id); setForm({ competicao_id: r.competicao_id, atleta_id: r.atleta_id, seed_num: r.seed_num ?? undefined, status: r.status }); }}>Editar</button>
                  <button className="btn-secondary" onClick={() => deleteMutation.mutate(r.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
