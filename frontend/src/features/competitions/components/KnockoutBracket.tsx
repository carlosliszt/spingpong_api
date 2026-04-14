import type { BracketMatch } from '@/shared/types/domain';

export function KnockoutBracket({ matches, title }: { matches: BracketMatch[]; title?: string }) {
  return (
    <section className="card" aria-label="Chave mata-mata">
      {title ? <h3 className="mb-3 text-lg font-semibold">{title}</h3> : null}
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.id} className="rounded-md border border-slate-200 p-3 text-sm">
            <div>R{match.round} - Jogo {match.slot}</div>
            <div className="mt-1">{match.a?.atleta?.nome ?? (match.a?.bye ? 'BYE' : 'TBD')} x {match.b?.atleta?.nome ?? (match.b?.bye ? 'BYE' : 'TBD')}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

