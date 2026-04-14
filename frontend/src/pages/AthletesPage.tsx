import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { RatingBadge } from '@/shared/components/RatingBadge';
import { getRatingBand } from '@/shared/lib/rating';

type FormState = {
  nome: string;
  data_nascimento?: string;
  sexo?: string;
  email?: string;
  telefone?: string;
  ativo: number;
  rating_atual: number;
  ranking_posicao?: number;
};

const initialState: FormState = {
  nome: '',
  data_nascimento: '',
  sexo: '',
  email: '',
  telefone: '',
  ativo: 1,
  rating_atual: 250,
  ranking_posicao: 0
};

export function AthletesPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const createMutation = useMutation({
    mutationFn: () => services.createAthlete({ ...form, faixa_rating: getRatingBand(form.rating_atual) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['athletes'] });
      setForm(initialState);
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateAthlete(editingId!, { ...form, faixa_rating: getRatingBand(form.rating_atual) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['athletes'] });
      setEditingId(null);
      setForm(initialState);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteAthlete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['athletes'] })
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Atletas (CRUD completo)</h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">{editingId ? `Editar atleta #${editingId}` : 'Novo atleta'}</h2>
        <div className="grid gap-2 md:grid-cols-4">
          <input className="input" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <label className="text-sm text-slate-600">
            Data de nascimento do atleta
            <input className="input mt-1" type="date" value={form.data_nascimento} onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} />
          </label>
          <input className="input" placeholder="Sexo" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
          <input className="input" type="number" placeholder="Rating" value={form.rating_atual} onChange={(e) => setForm({ ...form, rating_atual: Number(e.target.value) })} />
          <input className="input" type="number" placeholder="PT.RAK (ranking_posicao)" value={form.ranking_posicao ?? 0} onChange={(e) => setForm({ ...form, ranking_posicao: Number(e.target.value) })} />
          <select className="input" value={form.ativo} onChange={(e) => setForm({ ...form, ativo: Number(e.target.value) })}>
            <option value={1}>Ativo</option>
            <option value={0}>Inativo</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => (editingId ? updateMutation.mutate() : createMutation.mutate())}>{editingId ? 'Atualizar' : 'Criar'}</button>
          {editingId ? <button className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialState); }}>Cancelar</button> : null}
        </div>
      </section>

      <section className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>PT.RAK</th><th>PT.RAT</th><th>Faixa</th><th>Ativo</th><th>Acoes</th></tr></thead>
          <tbody>
            {athletesQuery.data?.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td>{a.id}</td>
                <td>{a.nome}</td>
                <td>{a.email ?? '-'}</td>
                <td>{a.telefone ?? '-'}</td>
                <td>{a.ranking_posicao ?? 0}</td>
                <td>{a.rating_atual}</td>
                <td><RatingBadge rating={a.rating_atual} faixa={a.faixa_rating ?? getRatingBand(a.rating_atual)} /></td>
                <td>{a.ativo}</td>
                <td className="space-x-2">
                  <button className="btn-secondary" onClick={() => { setEditingId(a.id); setForm({ nome: a.nome, data_nascimento: a.data_nascimento ?? '', sexo: a.sexo ?? '', email: a.email ?? '', telefone: a.telefone ?? '', ativo: a.ativo, rating_atual: Number(a.rating_atual), ranking_posicao: a.ranking_posicao ?? 0 }); }}>Editar</button>
                  <button className="btn-secondary" onClick={() => deleteMutation.mutate(a.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
