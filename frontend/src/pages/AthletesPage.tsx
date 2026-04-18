import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { RatingBadge } from '@/shared/components/RatingBadge';
import { getRatingBand } from '@/shared/lib/rating';
import { Button, Card, Section, Input, Select, Alert, DataTable, Modal } from '@/shared/components/ui';

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
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const createMutation = useMutation({
    mutationFn: () => services.createAthlete({ ...form, faixa_rating: getRatingBand(form.rating_atual) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['athletes'] });
      setForm(initialState);
      setShowForm(false);
      setFeedback({ type: 'success', msg: 'Atleta criado com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (error: any) => {
      setFeedback({ type: 'error', msg: error?.response?.data?.message || 'Erro ao criar atleta' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateAthlete(editingId!, { ...form, faixa_rating: getRatingBand(form.rating_atual) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['athletes'] });
      setEditingId(null);
      setForm(initialState);
      setShowForm(false);
      setFeedback({ type: 'success', msg: 'Atleta atualizado com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (error: any) => {
      setFeedback({ type: 'error', msg: error?.response?.data?.message || 'Erro ao atualizar' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteAthlete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['athletes'] });
      setFeedback({ type: 'success', msg: 'Atleta excluído com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (error: any) => {
      setFeedback({ type: 'error', msg: error?.response?.data?.message || 'Erro ao excluir' });
    }
  });

  const handleEdit = (athlete: any) => {
    setEditingId(athlete.id);
    setForm({
      nome: athlete.nome,
      data_nascimento: athlete.data_nascimento ?? '',
      sexo: athlete.sexo ?? '',
      email: athlete.email ?? '',
      telefone: athlete.telefone ?? '',
      ativo: athlete.ativo,
      rating_atual: Number(athlete.rating_atual),
      ranking_posicao: athlete.ranking_posicao ?? 0
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialState);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="heading-page">🏓 Gerenciar Atletas</h1>
          <p className="text-neutral-600">Cadastre, edite e gerencie todos os atletas</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Novo Atleta
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert
          type={feedback.type === 'success' ? 'success' : 'danger'}
          onClose={() => setFeedback(null)}
        >
          {feedback.msg}
        </Alert>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingId ? `Editar Atleta #${editingId}` : 'Novo Atleta'}
        actions={[
          {
            label: 'Cancelar',
            onClick: handleCloseForm,
            variant: 'secondary'
          },
          {
            label: editingId ? 'Atualizar' : 'Criar',
            onClick: () => (editingId ? updateMutation.mutate() : createMutation.mutate()),
            variant: 'primary'
          }
        ]}
      >
        <div className="space-y-4">
          <Input
            label="Nome do Atleta *"
            placeholder="Ex: João Silva"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Nascimento"
              type="date"
              value={form.data_nascimento}
              onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
            />
            <Select
              label="Sexo"
              value={form.sexo}
              onChange={(e) => setForm({ ...form, sexo: e.target.value })}
              options={[
                { value: '', label: 'Selecione' },
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' }
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="PT.RAT (Rating) *"
              type="number"
              placeholder="250"
              value={form.rating_atual}
              onChange={(e) => setForm({ ...form, rating_atual: Number(e.target.value) })}
              help="Padrão: 250"
            />
            <Input
              label="PT.RAK (Ranking Posição)"
              type="number"
              placeholder="0"
              value={form.ranking_posicao ?? 0}
              onChange={(e) => setForm({ ...form, ranking_posicao: Number(e.target.value) })}
              help="Pontos acumulados"
            />
            <Select
              label="Status"
              value={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: Number(e.target.value) })}
              options={[
                { value: 1, label: 'Ativo' },
                { value: 0, label: 'Inativo' }
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Athletes Table */}
      <Card>
        <Section title="Lista de Atletas" subtitle={`${athletesQuery.data?.length ?? 0} atletas cadastrados`}>
          {athletesQuery.isLoading ? (
            <div className="flex-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
            </div>
          ) : athletesQuery.data?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏓</div>
              <p className="empty-state-title">Nenhum atleta cadastrado</p>
              <p className="empty-state-text">Comece adicionando um novo atleta ao sistema</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>PT.RAT</th>
                    <th>PT.RAK</th>
                    <th>Faixa</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {athletesQuery.data?.map((a) => (
                    <tr key={a.id}>
                      <td className="text-sm text-neutral-600">#{a.id}</td>
                      <td className="font-medium">{a.nome}</td>
                      <td className="text-sm text-neutral-600">{a.email ?? '-'}</td>
                      <td className="font-semibold text-brand-600">{a.rating_atual}</td>
                      <td className="font-semibold text-neutral-700">{a.ranking_posicao ?? 0}</td>
                      <td>
                        <RatingBadge rating={a.rating_atual} faixa={a.faixa_rating ?? getRatingBand(a.rating_atual)} />
                      </td>
                      <td>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${a.ativo ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-700'}`}>
                          {a.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEdit(a)}>
                            ✏️
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(a.id)}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Card>
    </div>
  );
}
