import React from 'react';
import { Modal, Button } from './index';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  isDangerous = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="card max-w-md w-full mx-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-600 mt-2">{description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            isBlock
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            isBlock
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

