import React from 'react';
import clsx from 'clsx';

type AlertType = 'primary' | 'success' | 'warning' | 'danger';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const alertIcons: Record<AlertType, string> = {
  primary: '🔵',
  success: '✓',
  warning: '⚠️',
  danger: '✕'
};

export function Alert({
  type = 'primary',
  title,
  children,
  onClose,
  className,
  ...props
}: AlertProps) {
  const alertClass = `alert-${type}`;

  return (
    <div className={clsx(alertClass, className)} {...props}>
      <span className="flex-shrink-0 text-lg">{alertIcons[type]}</span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p>{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-lg hover:opacity-70"
          aria-label="Fechar alerta"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', className, children, ...props }: BadgeProps) {
  return (
    <span className={clsx(`badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
}

