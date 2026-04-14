import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

type FormState = {
  nome: string;
  email: string;
  senha: string;
  papel: string;
  ativo: number;
};

const initialState: FormState = { nome: '', email: '', senha: '', papel: 'ADMIN', ativo: 1 };

export function UsersPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const usersQuery = useQuery({ queryKey: ['users'], queryFn: services.getUsers });

  const createMutation = useMutation({
    mutationFn: () => services.createUser(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setForm(initialState);
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateUser(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setEditingId(null);
      setForm(initialState);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] })
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Usuarios (CRUD)</h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">{editingId ? `Editar usuario #${editingId}` : 'Novo usuario'}</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input className="input" placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Senha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
          <input className="input" placeholder="Papel" value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value })} />
          <select className="input" value={form.ativo} onChange={(e) => setForm({ ...form, ativo: Number(e.target.value) })}>
            <option value={1}>Ativo</option>
            <option value={0}>Inativo</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => (editingId ? updateMutation.mutate() : createMutation.mutate())}>
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
          {editingId ? <button className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialState); }}>Cancelar</button> : null}
        </div>
      </section>

      <section className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>ID</th><th>Nome</th><th>Email</th><th>Papel</th><th>Ativo</th><th>Acoes</th></tr></thead>
          <tbody>
            {usersQuery.data?.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.papel ?? 'ADMIN'}</td>
                <td>{user.ativo ?? 1}</td>
                <td className="space-x-2">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingId(user.id);
                      setForm({ nome: user.nome, email: user.email, senha: '', papel: user.papel ?? 'ADMIN', ativo: user.ativo ?? 1 });
                    }}
                  >
                    Editar
                  </button>
                  <button className="btn-secondary" onClick={() => deleteMutation.mutate(user.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

