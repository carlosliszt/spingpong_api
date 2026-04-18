import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { services } from '@/shared/api/services';
import { BalancedSeedingPanel } from '@/features/competitions/components/BalancedSeedingPanel';
import { Button, Card, Section, Input, Select, Alert, Badge } from '@/shared/components/ui';
import { useFeedback } from '@/shared/hooks';

const schema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  tipo: z.enum(['SPING_OPEN', 'SPING_FOODS']),
  data_inicio: z.string().min(1, 'Data de início obrigatória'),
  data_fim: z.string().optional(),
  local: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function CompetitionWizardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<number[]>([]);
  const [competitionId, setCompetitionId] = useState<number | null>(null);
  const { feedback, showSuccess, showError, clear } = useFeedback({ autoClose: 5000 });

  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'SPING_FOODS' }
  });

  const competitionMutation = useMutation({
    mutationFn: services.createCompetition,
    onError: (error: any) => showError(error?.response?.data?.message || 'Erro ao criar competição')
  });

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      if (!competitionId) throw new Error('Competicao nao criada');

      for (const athleteId of selectedAthleteIds) {
        await services.createRegistration({
          competicao_id: competitionId,
          atleta_id: athleteId,
          status: 'INSCRITO'
        });
      }

      await services.generateGroupMatches({ competitionId });
      return true;
    },
    onSuccess: () => {
      showSuccess('🎉 Competição criada! Inscritos salvos e jogos de grupo gerados.');
      qc.invalidateQueries({ queryKey: ['competitions'] });
      setTimeout(() => navigate(`/competicoes/${competitionId}/grupos`), 2000);
    },
    onError: (error: any) => showError(error?.response?.data?.message || 'Falha ao finalizar')
  });

  const selectedAthletes = useMemo(
    () => (athletesQuery.data ?? []).filter((a) => selectedAthleteIds.includes(a.id)),
    [athletesQuery.data, selectedAthleteIds]
  );

  const groupsCount =
    watch('tipo') === 'SPING_OPEN'
      ? Math.max(1, Math.ceil(selectedAthletes.length / 5))
      : Math.max(1, Math.ceil(selectedAthletes.length / 4));

  const maxGroupSize = watch('tipo') === 'SPING_OPEN' ? 5 : 4;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-page">✨ Criar Torneio (Wizard)</h1>
        <p className="text-neutral-600">Passo {step} de 3 - {step === 1 ? 'Informações básicas' : step === 2 ? 'Selecione inscritos' : 'Confirme balanceamento'}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? 'bg-brand-600' : 'bg-neutral-200'}`} />
        ))}
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

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <Section
            title="1️⃣ Informações do Torneio"
            subtitle="Preencha os dados básicos"
          >
            <form
              onSubmit={handleSubmit(async (values) => {
                try {
                  const created = await competitionMutation.mutateAsync(values);
                  setCompetitionId(created.id);
                  showSuccess(`✓ Torneio #${created.id} criado com sucesso!`);
                  setStep(2);
                } catch (error) {
                  showError('Erro ao criar torneio');
                }
              })}
              className="space-y-4"
            >
              <Input
                label="Nome do Torneio *"
                placeholder="Ex: Open Abril 2026"
                error={errors.nome?.message}
                {...register('nome')}
              />

              <Select
                label="Tipo de Torneio *"
                options={[
                  { value: 'SPING_OPEN', label: '🏆 SPING OPEN (Níveis A/B/C/D)' },
                  { value: 'SPING_FOODS', label: '🍔 SPING FOODS (Grupos + Mata-mata)' }
                ]}
                error={errors.tipo?.message}
                help={watch('tipo') === 'SPING_OPEN'
                  ? 'Máx 5 atletas por grupo'
                  : 'Máx 4 atletas por grupo'}
                {...register('tipo')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Data de Início *"
                  type="date"
                  help="Quando o torneio começa"
                  error={errors.data_inicio?.message}
                  {...register('data_inicio')}
                />
                <Input
                  label="Data de Fim"
                  type="date"
                  help="Quando o torneio termina"
                  error={errors.data_fim?.message}
                  {...register('data_fim')}
                />
              </div>

              <Input
                label="Local"
                placeholder="Ex: Centro de Treinamento"
                error={errors.local?.message}
                {...register('local')}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  variant="primary"
                  isLoading={competitionMutation.isPending}
                  className="flex-1"
                  type="submit"
                >
                  Próximo: Selecionar Atletas
                </Button>
              </div>
            </form>
          </Section>
        </Card>
      )}

      {/* Step 2: Select Athletes */}
      {step === 2 && (
        <Card>
          <Section
            title="2️⃣ Seleção de Atletas"
            subtitle={`Selecione os inscritos (${selectedAthleteIds.length} selecionados)`}
          >
            {athletesQuery.isLoading ? (
              <div className="text-center py-8 text-neutral-600">Carregando atletas...</div>
            ) : athletesQuery.data?.length === 0 ? (
              <div className="text-center py-8 text-neutral-600">Nenhum atleta cadastrado</div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {athletesQuery.data?.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAthleteIds.includes(a.id)
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAthleteIds.includes(a.id)}
                        onChange={(e) =>
                          setSelectedAthleteIds((prev) =>
                            e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                          )
                        }
                        className="cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{a.nome}</p>
                        <p className="text-xs text-neutral-600">Rating: {a.rating_atual}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Groups Preview */}
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">📊 Preview de Grupos:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Array.from({ length: groupsCount }).map((_, i) => (
                      <div key={i} className="text-center p-2 bg-white rounded border border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-600">Grupo {String(i + 1).padStart(2, '0')}</p>
                        <p className="text-lg font-bold text-brand-600">~{Math.ceil(selectedAthleteIds.length / groupsCount)}</p>
                        <p className="text-xs text-neutral-500">atletas</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    ← Voltar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setStep(3)}
                    disabled={selectedAthleteIds.length === 0}
                    className="flex-1"
                  >
                    Próximo: Preview Balanceado →
                  </Button>
                </div>
              </div>
            )}
          </Section>
        </Card>
      )}

      {/* Step 3: Confirm Balancing */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <Section
              title="3️⃣ Preview de Balanceamento"
              subtitle="Visualize como os atletas serão distribuídos"
            >
              <BalancedSeedingPanel athletes={selectedAthletes} groupsCount={groupsCount} />
            </Section>
          </Card>

          <Card>
            <div className="space-y-4">
              <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                <p className="text-sm font-medium text-success-900">✓ Balanceamento calculado com sucesso!</p>
                <p className="text-xs text-success-700 mt-1">Os atletas serão distribuídos uniformemente por rating.</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  ← Voltar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => finalizeMutation.mutate()}
                  isLoading={finalizeMutation.isPending}
                  className="flex-1"
                >
                  ✓ Confirmar e Gerar Jogos
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
