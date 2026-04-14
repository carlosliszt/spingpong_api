import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '@/shared/api/services';
import { BalancedSeedingPanel } from '@/features/competitions/components/BalancedSeedingPanel';

const schema = z.object({
  nome: z.string().min(3),
  tipo: z.enum(['SPING_OPEN', 'SPING_FOODS']),
  data_inicio: z.string().min(1),
  data_fim: z.string().optional(),
  local: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function CompetitionWizardPage() {
  const [step, setStep] = useState(1);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<number[]>([]);
  const [competitionId, setCompetitionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const athletesQuery = useQuery({ queryKey: ['athletes'], queryFn: services.getAthletes });

  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'SPING_FOODS' }
  });

  const competitionMutation = useMutation({ mutationFn: services.createCompetition });

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
    onSuccess: () => setFeedback('Competicao pronta: inscritos salvos e jogos de grupo gerados.'),
    onError: (error: any) => setFeedback(error?.response?.data?.message || 'Falha ao confirmar geracao')
  });

  const selectedAthletes = useMemo(
    () => (athletesQuery.data ?? []).filter((a) => selectedAthleteIds.includes(a.id)),
    [athletesQuery.data, selectedAthleteIds]
  );

  const groupsCount =
    watch('tipo') === 'SPING_OPEN'
      ? Math.max(1, Math.ceil(selectedAthletes.length / 5))
      : Math.max(1, Math.ceil(selectedAthletes.length / 4));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Wizard de Competicao</h1>
      <p className="text-sm text-slate-600">Passo {step} de 3</p>
      {feedback ? <p className="card text-sm text-slate-700">{feedback}</p> : null}

      {step === 1 ? (
        <form
          className="card grid gap-2 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            const created = await competitionMutation.mutateAsync(values);
            setCompetitionId(created.id);
            setFeedback(`Competicao #${created.id} criada.`);
            setStep(2);
          })}
        >
          <input className="input" placeholder="Nome" {...register('nome')} />
          <select className="input" {...register('tipo')}><option value="SPING_OPEN">SPING_OPEN</option><option value="SPING_FOODS">SPING_FOODS</option></select>
          <label className="text-sm text-slate-600">
            Data de inicio do torneio
            <input className="input mt-1" type="date" {...register('data_inicio')} />
          </label>
          <label className="text-sm text-slate-600">
            Data de fim do torneio
            <input className="input mt-1" type="date" {...register('data_fim')} />
          </label>
          <input className="input md:col-span-2" placeholder="Local" {...register('local')} />
          <button className="btn-primary md:col-span-2" type="submit">Salvar e avancar</button>
        </form>
      ) : null}

      {step === 2 ? (
        <section className="card space-y-2">
          <h2 className="font-semibold">Selecione inscritos</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {athletesQuery.data?.map((a) => (
              <label key={a.id} className="flex items-center gap-2 rounded-md border p-2">
                <input
                  type="checkbox"
                  checked={selectedAthleteIds.includes(a.id)}
                  onChange={(e) =>
                    setSelectedAthleteIds((prev) =>
                      e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                    )
                  }
                />
                {a.nome} ({a.rating_atual})
              </label>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(3)}>Ver preview balanceado</button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-3">
          <BalancedSeedingPanel athletes={selectedAthletes} groupsCount={groupsCount} />
          <button className="btn-primary" onClick={() => finalizeMutation.mutate()} disabled={finalizeMutation.isPending}>
            Confirmar geracao real
          </button>
        </section>
      ) : null}
    </div>
  );
}
