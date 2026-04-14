import type { CompetitionType, GroupStanding } from '@/shared/types/domain';
import type { SeededGroup } from '@/features/competition-engine/types';
import { Link } from 'react-router-dom';

type Props = {
  competitionName: string;
  competitionType: CompetitionType;
  groups: SeededGroup[];
  standingsByGroup: Record<string, GroupStanding[]>;
  allRoundsFinished: boolean;
};

function qualifiedCount(groupSize: number, competitionType: CompetitionType) {
  if (competitionType === 'SPING_OPEN') {
    return groupSize;
  }

  return Math.min(2, groupSize);
}

export function GroupObservationBoard({
  competitionName,
  competitionType,
  groups,
  standingsByGroup,
  allRoundsFinished
}: Props) {
  return (
    <section className="space-y-3" aria-label="Painel de grupos da competicao">
      <div className="card text-sm text-slate-700">
        {allRoundsFinished
          ? 'Todas as rodadas de grupo finalizaram. Classificacao confirmada.'
          : 'Aguardando fim de todas as rodadas para exibir status CLASSIFICADO.'}
      </div>

      <div className="grid gap-3 xl:grid-cols-4 md:grid-cols-2">
        {groups.map((group, index) => {
          const standingSource = standingsByGroup[group.id]?.length
            ? standingsByGroup[group.id]
            : group.atletas.map((a) => ({
                grupo_id: group.id,
                atleta_id: a.id,
                nome_atleta: a.nome,
                vitorias: 0,
                derrotas: 0,
                saldo_sets: 0,
                saldo_pontos: 0
              }));

          const standing = [...standingSource].sort((a, b) => {
            if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
            if (b.saldo_sets !== a.saldo_sets) return b.saldo_sets - a.saldo_sets;
            return b.saldo_pontos - a.saldo_pontos;
          });

          const cutoff = qualifiedCount(standing.length, competitionType);

          return (
            <article key={group.id} className="rounded-md border border-slate-300 bg-white shadow-sm">
              <header className="border-b border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">
                {competitionName} - Grupo {String(index + 1).padStart(2, '0')}
              </header>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-teal-700 text-white">
                    <tr>
                      <th className="px-2 py-2 text-left">#</th>
                      <th className="px-2 py-2 text-left">JOGADORES</th>
                      <th className="px-2 py-2 text-left">PT. RAK</th>
                      <th className="px-2 py-2 text-left">PT. RAT</th>
                      <th className="px-2 py-2 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standing.map((row, i) => {
                      const athlete = group.atletas.find((a) => a.id === row.atleta_id);
                      const isQualified = allRoundsFinished && i < cutoff;

                      return (
                        <tr key={row.atleta_id} className="border-b border-slate-100">
                          <td className="px-2 py-2">{i + 1}</td>
                          <td className="px-2 py-2">
                            <Link className="text-brand-700 hover:underline" to="/atletas">
                              {row.nome_atleta ?? athlete?.nome ?? row.atleta_id}
                            </Link>
                          </td>
                          <td className="px-2 py-2">{athlete?.ranking_posicao ?? 0}</td>
                          <td className="px-2 py-2">{athlete?.rating_atual ?? '-'}</td>
                          <td className="px-2 py-2">
                            {allRoundsFinished ? (
                              <span className={isQualified ? 'font-semibold text-emerald-700' : 'text-slate-500'}>
                                {isQualified ? 'CLASSIFICADO' : 'NAO CLASSIFICADO'}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
