import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import type { SpingOpenConfig } from '@/shared/types/domain';
import { Alert, Badge, Button, Card, Input, Section, Textarea } from '@/shared/components/ui';

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome da configuracao'),
  descricao: z.string().optional(),
  atletas_por_grupo: z.coerce.number().int().min(3, 'Minimo 3').max(10, 'Maximo 10'),
  posicoes_nivel_a: z.string().optional(),
  posicoes_nivel_b: z.string().optional(),
  posicoes_nivel_c: z.string().optional(),
  posicoes_nivel_d: z.string().optional(),
  ativo: z.boolean(),
  padrao: z.boolean()
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  nome: '',
  descricao: '',
  atletas_por_grupo: 5,
  posicoes_nivel_a: '1,2',
  posicoes_nivel_b: '3',
  posicoes_nivel_c: '4',
  posicoes_nivel_d: '5',
  ativo: true,
  padrao: false
};

const parseError = (error: any): string => {
  return error?.response?.data?.erro || error?.response?.data?.message || error?.message || 'Erro inesperado';
};

const positionsToString = (positions: number[]) => positions.join(',');

const parsePositionsFromInput = (value?: string) => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0);
};

const toPayload = (values: FormData) => ({
  descricao: values.descricao?.trim() || null,
  nome: values.nome.trim(),
  atletas_por_grupo: values.atletas_por_grupo,
  posicoes_nivel_a: parsePositionsFromInput(values.posicoes_nivel_a),
  posicoes_nivel_b: parsePositionsFromInput(values.posicoes_nivel_b),
  posicoes_nivel_c: parsePositionsFromInput(values.posicoes_nivel_c),
  posicoes_nivel_d: parsePositionsFromInput(values.posicoes_nivel_d),
  ativo: values.ativo ? 1 : 0,
  padrao: values.padrao ? 1 : 0
});

export function SpingOpenConfigPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<SpingOpenConfig | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const configsQuery = useQuery({
    queryKey: ['sping-open-configs'],
    queryFn: services.getSpingOpenConfigs
  });

  const activeConfigQuery = useQuery({
    queryKey: ['sping-open-config-active'],
    queryFn: async () => {
      try {
        return await services.getActiveSpingOpenConfig();
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    }
  });

  const defaultConfigQuery = useQuery({
    queryKey: ['sping-open-config-default'],
    queryFn: async () => {
      try {
        return await services.getDefaultSpingOpenConfig();
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    }
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ['sping-open-configs'] });
    qc.invalidateQueries({ queryKey: ['sping-open-config-active'] });
    qc.invalidateQueries({ queryKey: ['sping-open-config-default'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: FormData) => services.createSpingOpenConfig(toPayload(payload)),
    onSuccess: () => {
      invalidateAll();
      reset(defaultValues);
      setEditing(null);
      setFeedback({ type: 'success', msg: 'Configuracao criada com sucesso.' });
    },
    onError: (error: any) => setFeedback({ type: 'error', msg: parseError(error) })
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FormData) => services.updateSpingOpenConfig(editing!.id, toPayload(payload)),
    onSuccess: () => {
      invalidateAll();
      reset(defaultValues);
      setEditing(null);
      setFeedback({ type: 'success', msg: 'Configuracao atualizada com sucesso.' });
    },
    onError: (error: any) => setFeedback({ type: 'error', msg: parseError(error) })
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => services.updateSpingOpenConfig(id, { ativo: 1 }),
    onSuccess: () => {
      invalidateAll();
      setFeedback({ type: 'success', msg: 'Configuracao marcada como ativa.' });
    },
    onError: (error: any) => setFeedback({ type: 'error', msg: parseError(error) })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => services.deleteSpingOpenConfig(id),
    onSuccess: () => {
      invalidateAll();
      setFeedback({ type: 'success', msg: 'Configuracao removida.' });
      if (editing) {
        setEditing(null);
        reset(defaultValues);
      }
    },
    onError: (error: any) => setFeedback({ type: 'error', msg: parseError(error) })
  });

  const orderedConfigs = useMemo(() => {
    const rows = configsQuery.data ?? [];
    return [...rows].sort((a, b) => Number(b.padrao) - Number(a.padrao) || Number(b.ativo) - Number(a.ativo) || b.id - a.id);
  }, [configsQuery.data]);

  const onEdit = (config: SpingOpenConfig) => {
    setEditing(config);
    reset({
      nome: config.nome,
      descricao: config.descricao ?? '',
      atletas_por_grupo: config.atletas_por_grupo,
      posicoes_nivel_a: positionsToString(config.posicoes_nivel_a),
      posicoes_nivel_b: positionsToString(config.posicoes_nivel_b),
      posicoes_nivel_c: positionsToString(config.posicoes_nivel_c),
      posicoes_nivel_d: positionsToString(config.posicoes_nivel_d),
      ativo: Boolean(config.ativo),
      padrao: Boolean(config.padrao)
    });
  };

  const clearForm = () => {
    setEditing(null);
    reset(defaultValues);
  };

  const onSubmit = (values: FormData) => {
    if (editing) {
      updateMutation.mutate(values);
      return;
    }
    createMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <div>
          <h1 className="heading-page">Configuracao SPING_OPEN</h1>
          <p className="text-neutral-600">Defina o tamanho dos grupos e as posicoes que avancam para niveis A/B/C/D.</p>
        </div>
        <Button variant="secondary" onClick={clearForm}>Nova configuracao</Button>
      </div>

      {feedback && (
        <Alert type={feedback.type === 'success' ? 'success' : 'danger'} onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}

      <Card>
        <Section title="Resumo atual" subtitle="Configuracoes em uso no backend">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-md border border-neutral-200 p-3 bg-neutral-50">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Configuracao ativa</p>
              <p className="font-semibold text-neutral-900 mt-1">{activeConfigQuery.data?.nome ?? 'Nao definida'}</p>
            </div>
            <div className="rounded-md border border-neutral-200 p-3 bg-neutral-50">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Configuracao padrao</p>
              <p className="font-semibold text-neutral-900 mt-1">{defaultConfigQuery.data?.nome ?? 'Nao definida'}</p>
            </div>
          </div>
        </Section>
      </Card>

      <Card>
        <Section title={editing ? `Editar #${editing.id}` : 'Nova configuracao'} subtitle="As regras sao aplicadas na geracao de grupos e mata-mata do SPING_OPEN.">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Nome" placeholder="Ex: Grupos de 5" error={errors.nome?.message} {...register('nome')} />
            <Textarea
              label="Descricao"
              rows={2}
              placeholder="Opcional"
              error={errors.descricao?.message}
              {...register('descricao')}
            />
            <Input
              label="Atletas por grupo"
              type="number"
              error={errors.atletas_por_grupo?.message}
              help="Valor entre 3 e 10"
              {...register('atletas_por_grupo')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Posicoes nivel A" placeholder="1,2" error={errors.posicoes_nivel_a?.message} {...register('posicoes_nivel_a')} />
              <Input label="Posicoes nivel B" placeholder="3" error={errors.posicoes_nivel_b?.message} {...register('posicoes_nivel_b')} />
              <Input label="Posicoes nivel C" placeholder="4" error={errors.posicoes_nivel_c?.message} {...register('posicoes_nivel_c')} />
              <Input label="Posicoes nivel D" placeholder="5" error={errors.posicoes_nivel_d?.message} {...register('posicoes_nivel_d')} />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" {...register('ativo')} />
                Configuracao ativa
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" {...register('padrao')} />
                Configuracao padrao
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {editing ? 'Salvar alteracoes' : 'Criar configuracao'}
              </Button>
              {editing && (
                <Button type="button" variant="secondary" onClick={clearForm}>
                  Cancelar edicao
                </Button>
              )}
            </div>
          </form>
        </Section>
      </Card>

      <Card>
        <Section title="Configuracoes cadastradas" subtitle={`${orderedConfigs.length} registro(s)`}>
          {configsQuery.isLoading ? (
            <p className="text-sm text-neutral-600">Carregando configuracoes...</p>
          ) : orderedConfigs.length === 0 ? (
            <p className="text-sm text-neutral-600">Nenhuma configuracao cadastrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Grupo</th>
                    <th>Niveis</th>
                    <th>Status</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedConfigs.map((config) => (
                    <tr key={config.id}>
                      <td>#{config.id}</td>
                      <td>
                        <p className="font-medium">{config.nome}</p>
                        <p className="text-xs text-neutral-500">{config.descricao || '-'}</p>
                      </td>
                      <td>{config.atletas_por_grupo}</td>
                      <td className="text-xs">
                        <div>A: {positionsToString(config.posicoes_nivel_a) || '-'}</div>
                        <div>B: {positionsToString(config.posicoes_nivel_b) || '-'}</div>
                        <div>C: {positionsToString(config.posicoes_nivel_c) || '-'}</div>
                        <div>D: {positionsToString(config.posicoes_nivel_d) || '-'}</div>
                      </td>
                      <td className="space-x-1">
                        {Boolean(config.ativo) && <Badge variant="success">Ativa</Badge>}
                        {Boolean(config.padrao) && <Badge variant="primary">Padrao</Badge>}
                        {!Boolean(config.ativo) && !Boolean(config.padrao) && <Badge variant="neutral">Inativa</Badge>}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => onEdit(config)}>
                            Editar
                          </Button>
                          {!Boolean(config.ativo) && (
                            <Button
                              size="sm"
                              variant="success"
                              isLoading={activateMutation.isPending}
                              onClick={() => activateMutation.mutate(config.id)}
                            >
                              Ativar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            isLoading={deleteMutation.isPending}
                            onClick={() => {
                              const ok = window.confirm(`Excluir a configuracao "${config.nome}"?`);
                              if (ok) {
                                deleteMutation.mutate(config.id);
                              }
                            }}
                          >
                            Excluir
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

