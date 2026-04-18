import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'primary-outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isBlock?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
  warning: 'btn-warning',
  ghost: 'btn-ghost',
  'primary-outline': 'btn-primary-outline'
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn',
  lg: 'btn-lg'
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isBlock = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        buttonVariants[variant],
        buttonSizes[size],
        isBlock && 'btn-block',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

