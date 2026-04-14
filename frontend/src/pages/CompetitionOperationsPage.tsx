import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '@/shared/api/services';

export function CompetitionOperationsPage() {
  const { id } = useParams();
  const competitionId = Number(id);
  const qc = useQueryClient();
  const [message, setMessage] = useState('');

  const competitions = useQuery({ queryKey: ['competitions'], queryFn: services.getCompetitions });
  const registrations = useQuery({ queryKey: ['registrations'], queryFn: services.getRegistrations });
  const matches = useQuery({ queryKey: ['matches'], queryFn: services.getMatches });

  const competition = useMemo(
    () => (competitions.data ?? []).find((c) => c.id === competitionId),
    [competitions.data, competitionId]
  );

  const registrationCount = useMemo(
    () => (registrations.data ?? []).filter((r) => r.competicao_id === competitionId).length,
    [registrations.data, competitionId]
  );

  const competitionMatches = useMemo(
    () => (matches.data ?? []).filter((m) => m.competicao_id === competitionId),
    [matches.data, competitionId]
  );

  const runAction = (label: string) => ({
    onSuccess: () => {
      setMessage(`${label} executado com sucesso.`);
      qc.invalidateQueries({ queryKey: ['matches'] });
      qc.invalidateQueries({ queryKey: ['competitions'] });
    },
    onError: (error: any) => setMessage(error?.response?.data?.message || `Falha ao executar ${label}`)
  });

  const generateGroupsMutation = useMutation({
    mutationFn: () => services.generateBalancedGroups({ competitionId }),
    ...runAction('Gerar grupos balanceados')
  });

  const generateGroupMatchesMutation = useMutation({
    mutationFn: () => services.generateGroupMatches({ competitionId }),
    ...runAction('Gerar jogos de grupo')
  });

  const finalizeGroupsMutation = useMutation({
    mutationFn: () => services.finalizeGroups({ competitionId }),
    ...runAction('Finalizar grupos')
  });

  const generateKnockoutMutation = useMutation({
    mutationFn: () => services.generateKnockout({ competitionId }),
    ...runAction('Gerar mata-mata')
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Operacoes da competicao #{id}</h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">Resumo</h2>
        <p className="text-sm text-slate-700">Nome: {competition?.nome ?? '-'}</p>
        <p className="text-sm text-slate-700">Tipo: {competition?.tipo ?? '-'}</p>
        <p className="text-sm text-slate-700">Status: {competition?.status ?? '-'}</p>
        <p className="text-sm text-slate-700">Inscritos: {registrationCount}</p>
        <p className="text-sm text-slate-700">Jogos: {competitionMatches.length}</p>
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">Automacao</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => generateGroupsMutation.mutate()} disabled={generateGroupsMutation.isPending}>Gerar grupos</button>
          <button className="btn-primary" onClick={() => generateGroupMatchesMutation.mutate()} disabled={generateGroupMatchesMutation.isPending}>Gerar jogos de grupo</button>
          <button className="btn-primary" onClick={() => finalizeGroupsMutation.mutate()} disabled={finalizeGroupsMutation.isPending}>Finalizar grupos</button>
          <button className="btn-primary" onClick={() => generateKnockoutMutation.mutate()} disabled={generateKnockoutMutation.isPending}>Gerar mata-mata</button>
        </div>
        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="card flex flex-wrap gap-2">
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/inscricoes`}>Inscricoes</Link>
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/grupos`}>Ver grupos</Link>
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/resultados`}>Lancar resultados</Link>
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/resultados/consulta`}>Consultar resultados</Link>
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/mata-mata`}>Ver mata-mata</Link>
        <Link className="btn-secondary" to={`/competicoes/${competitionId}/open-levels`}>Ver niveis open</Link>
      </section>
    </div>
  );
}

