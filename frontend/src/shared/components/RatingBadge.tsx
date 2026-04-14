export function RatingBadge({ rating, faixa }: { rating: number; faixa: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
      <span>Faixa {faixa}</span>
      <span className="text-slate-500">({rating})</span>
    </span>
  );
}

