import React from 'react';
import clsx from 'clsx';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = '📦', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-text">{description}</p>}
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

interface DataTableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    className?: string;
  }>;
  data: T[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="space-y-2"><div className="skeleton h-10" /><div className="skeleton h-10" /><div className="skeleton h-10" /></div>;
  }

  if (isEmpty || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className={clsx(onRowClick && 'cursor-pointer')}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={col.className}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="card max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-1"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>
        <div className="mb-6">{children}</div>
        {actions && (
          <div className="flex gap-2 justify-end">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={`btn btn-${action.variant || 'secondary'}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

