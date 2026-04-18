import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Select, Input, Badge, Alert, Modal, ConfirmDialog, EmptyState } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(
    competitionIdFromRoute ? { ...initialState, competicao_id: competitionIdFromRoute } : initialState
  );
  const { feedback, showSuccess, showError, clear } = useFeedback();

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
      setShowForm(false);
      showSuccess('Inscrição criada com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao criar')
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateRegistration(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      setEditingId(null);
      setForm({ ...initialState, competicao_id: competitionIdFromRoute || 0 });
      setShowForm(false);
      showSuccess('Inscrição atualizada com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao atualizar')
  });

  const deleteMutation = useMutation({
    mutationFn: (rid: number) => services.deleteRegistration(rid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrations'] });
      setDeleteConfirm(null);
      showSuccess('Inscrição excluída com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao excluir')
  });

  const handleEdit = (reg: any) => {
    setEditingId(reg.id);
    setForm({ competicao_id: reg.competicao_id, atleta_id: reg.atleta_id, seed_num: reg.seed_num ?? undefined, status: reg.status });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...initialState, competicao_id: competitionIdFromRoute || 0 });
  };

  const getStatusColor = (status: string) => {
    if (status === 'CONFIRMADO') return 'success';
    if (status === 'CANCELADO') return 'danger';
    return 'warning';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-page">📝 Inscrições</h1>
          <p className="text-neutral-600">
            {competition ? competition.nome : 'Gerenciar inscrições em torneios'}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Nova Inscrição
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert type={feedback.type === 'success' ? 'success' : 'danger'} onClose={clear}>
          {feedback.msg}
        </Alert>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingId ? `Editar Inscrição #${editingId}` : 'Nova Inscrição'}
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
          {!competitionIdFromRoute && (
            <Select
              label="Competição *"
              options={[
                { value: '', label: 'Selecione a competição...' },
                ...(competitionsQuery.data ?? []).map((c) => ({ value: c.id, label: c.nome }))
              ]}
              value={form.competicao_id || ''}
              onChange={(e) => setForm({ ...form, competicao_id: Number(e.target.value) })}
            />
          )}

          <Select
            label="Atleta *"
            options={[
              { value: '', label: 'Selecione o atleta...' },
              ...(athletesQuery.data ?? []).map((a) => ({ value: a.id, label: `${a.nome} (PT.RAT: ${a.rating_atual})` }))
            ]}
            value={form.atleta_id || ''}
            onChange={(e) => setForm({ ...form, atleta_id: Number(e.target.value) })}
          />

          <Input
            label="Seed (Opcional)"
            type="number"
            placeholder="Ex: 1"
            value={form.seed_num ?? ''}
            onChange={(e) => setForm({ ...form, seed_num: e.target.value ? Number(e.target.value) : undefined })}
          />

          <Select
            label="Status"
            options={[
              { value: 'INSCRITO', label: '📝 Inscrito' },
              { value: 'CONFIRMADO', label: '✓ Confirmado' },
              { value: 'CANCELADO', label: '✕ Cancelado' }
            ]}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Excluir Inscrição?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        isDangerous
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Registrations Table */}
      <Card>
        <Section title="Lista de Inscrições" subtitle={`${registrations.length} inscrições`}>
          {registrations.length === 0 ? (
            <EmptyState
              icon="📝"
              title="Nenhuma inscrição"
              description="Crie uma nova inscrição para este torneio"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Competição</th>
                    <th>Atleta</th>
                    <th>Seed</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td className="text-neutral-600">#{r.id}</td>
                      <td className="font-medium">{r.competicao_nome ?? `Competição ${r.competicao_id}`}</td>
                      <td>
                        <Link to="/atletas" className="text-brand-600 hover:text-brand-700 font-medium">
                          {r.atleta_nome ?? `Atleta ${r.atleta_id}`}
                        </Link>
                      </td>
                      <td className="text-center">{r.seed_num ?? '-'}</td>
                      <td>
                        <Badge variant={getStatusColor(r.status)}>
                          {r.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEdit(r)}>
                            ✏️
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setDeleteConfirm(r.id)}>
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
