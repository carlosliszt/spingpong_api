import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { Button, Card, Section, Input, Select, Alert, Badge, Modal, ConfirmDialog } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

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
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { feedback, showSuccess, showError, clear } = useFeedback();

  const usersQuery = useQuery({ queryKey: ['users'], queryFn: services.getUsers });

  const createMutation = useMutation({
    mutationFn: () => services.createUser(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setForm(initialState);
      setShowForm(false);
      showSuccess('Administrador criado com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao criar')
  });

  const updateMutation = useMutation({
    mutationFn: () => services.updateUser(editingId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setEditingId(null);
      setForm(initialState);
      setShowForm(false);
      showSuccess('Administrador atualizado com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao atualizar')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setDeleteConfirm(null);
      showSuccess('Administrador excluído com sucesso!');
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao excluir')
  });

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setForm({ nome: user.nome, email: user.email, senha: '', papel: user.papel ?? 'ADMIN', ativo: user.ativo ?? 1 });
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
          <h1 className="heading-page">👥 Gerenciar Administradores</h1>
          <p className="text-neutral-600">Cadastre e gerencie usuários administradores do sistema</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Novo Admin
        </Button>
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
        title={editingId ? `Editar Admin #${editingId}` : 'Novo Administrador'}
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
            label="Nome do Admin *"
            placeholder="Ex: João Silva"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <Input
            label="Email *"
            type="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            label={editingId ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            help={editingId ? 'Opcional - deixe vazio para manter a senha atual' : undefined}
          />

          <Select
            label="Papel"
            options={[
              { value: 'ADMIN', label: '👑 Administrador' },
              { value: 'MODERADOR', label: '👤 Moderador' }
            ]}
            value={form.papel}
            onChange={(e) => setForm({ ...form, papel: e.target.value })}
          />

          <Select
            label="Status"
            options={[
              { value: '1', label: 'Ativo' },
              { value: '0', label: 'Inativo' }
            ]}
            value={String(form.ativo)}
            onChange={(e) => setForm({ ...form, ativo: Number(e.target.value) })}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Excluir Administrador?"
        description="Esta ação não pode ser desfeita. O administrador será removido do sistema."
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        isDangerous
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Users Table */}
      <Card>
        <Section title="Lista de Administradores" subtitle={`${usersQuery.data?.length ?? 0} admins cadastrados`}>
          {usersQuery.isLoading ? (
            <div className="flex-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
            </div>
          ) : usersQuery.data?.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p className="empty-state-title">Nenhum administrador cadastrado</p>
              <p className="empty-state-text">Comece adicionando um novo administrador ao sistema</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Papel</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQuery.data?.map((user) => (
                    <tr key={user.id}>
                      <td className="text-sm text-neutral-600">#{user.id}</td>
                      <td className="font-medium">{user.nome}</td>
                      <td className="text-sm text-neutral-600">{user.email}</td>
                      <td>
                        <Badge variant="primary">
                          {user.papel === 'ADMIN' ? '👑 Admin' : '👤 Moderador'}
                        </Badge>
                      </td>
                      <td>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.ativo ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-700'}`}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(user)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDeleteConfirm(user.id)}
                          >
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

