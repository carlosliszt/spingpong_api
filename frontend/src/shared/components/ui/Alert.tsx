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
  primary: 'ℹ️',
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
  const role = type === 'danger' || type === 'warning' ? 'alert' : 'status';
  const live = type === 'danger' || type === 'warning' ? 'assertive' : 'polite';

  return (
    <div className={clsx(alertClass, className)} role={role} aria-live={live} {...props}>
      <span className="alert-icon" aria-hidden="true">{alertIcons[type]}</span>
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        <div className="alert-body">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close"
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

