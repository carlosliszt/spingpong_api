import React from 'react';
import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />;
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex-center gap-2">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-600" />
      <span className="text-sm text-neutral-600">Carregando...</span>
    </div>
  );
}

