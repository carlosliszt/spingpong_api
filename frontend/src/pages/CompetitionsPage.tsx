import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { CompetitionStatusBadge } from '@/shared/components/CompetitionStatusBadge';
import { Button, Card, Section, Input, Select, Alert, Modal } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

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
  const [showForm, setShowForm] = useState(false);
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });

  const createMutation = useMutation({
    mutationFn: () => services.createCompetition(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      setForm(initialState);
      setShowForm(false);
      showSuccess('Torneio criado com sucesso!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Erro ao criar torneio');
    }
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateCompetition(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      setEditingId(null);
      setForm(initialState);
      setShowForm(false);
      showSuccess('Torneio atualizado com sucesso!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Erro ao atualizar');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteCompetition(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      showSuccess('Torneio excluído com sucesso!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Erro ao excluir');
    }
  });

  const handleEdit = (comp: any) => {
    setEditingId(comp.id);
    setForm({
      nome: comp.nome,
      tipo: comp.tipo,
      status: comp.status,
      data_inicio: comp.data_inicio,
      data_fim: comp.data_fim ?? '',
      local: comp.local ?? ''
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialState);
  };

  const statusOptions = [
    { value: 'PLANEJADA', label: '📋 Planejada' },
    { value: 'EM_ANDAMENTO', label: '⚡ Em Andamento' },
    { value: 'FINALIZADA', label: '✓ Finalizada' },
    { value: 'CANCELADA', label: '✕ Cancelada' }
  ];

  const typeOptions = [
    { value: 'SPING_OPEN', label: '🏆 SPING OPEN (com níveis A/B/C/D)' },
    { value: 'SPING_FOODS', label: '🍔 SPING FOODS (grupos + mata-mata)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="heading-page">🏆 Gerenciar Torneios</h1>
          <p className="text-neutral-600">Crie e gerencie competições de tênis de mesa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setShowForm(true)}>
            ➕ Novo Torneio
          </Button>
          <Link to="/competicoes/wizard">
            <Button variant="secondary">✨ Usar Wizard</Button>
          </Link>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert
          type={feedback.type === 'success' ? 'success' : 'danger'}
          onClose={clear}
        >
          {feedback.msg}
        </Alert>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingId ? `Editar Torneio #${editingId}` : 'Novo Torneio'}
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
            label="Nome do Torneio *"
            placeholder="Ex: Open Setembro 2024"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <Select
            label="Tipo de Torneio *"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as FormState['tipo'] })}
            options={typeOptions}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Início *"
              type="date"
              help="Quando o torneio começa"
              value={form.data_inicio}
              onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
            />
            <Input
              label="Data de Fim"
              type="date"
              help="Quando o torneio termina"
              value={form.data_fim}
              onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
            />
          </div>

          <Input
            label="Local"
            placeholder="Ex: Centro de Treinamento"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as FormState['status'] })}
            options={statusOptions}
          />
        </div>
      </Modal>

      {/* Competitions List */}
      <div className="space-y-3">
        {competitions.isLoading ? (
          <Card>
            <div className="flex-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
            </div>
          </Card>
        ) : competitions.data?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏆</div>
            <p className="empty-state-title">Nenhum torneio cadastrado</p>
            <p className="empty-state-text">Comece criando um novo torneio ou use o wizard</p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Criar Primeiro Torneio
            </Button>
          </div>
        ) : (
          competitions.data?.map((comp) => (
            <Card key={comp.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900">{comp.nome}</h3>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-neutral-600">
                    <span>📅 {comp.data_inicio}</span>
                    {comp.data_fim && <span>→ {comp.data_fim}</span>}
                    {comp.local && <span>📍 {comp.local}</span>}
                    <span>{comp.tipo === 'SPING_OPEN' ? '🏆 SPING OPEN' : '🍔 SPING FOODS'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                  <CompetitionStatusBadge status={comp.status} />
                  <Link to={`/competicoes/${comp.id}/grupos`}>
                    <Button variant="secondary" size="sm">Ver Detalhes</Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(comp)}>
                    ✏️ Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(comp.id)}>
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
