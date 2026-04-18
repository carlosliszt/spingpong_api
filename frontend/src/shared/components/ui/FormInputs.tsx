import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  help?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, help, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="form-label">{label}</label>}
        <input
          ref={ref}
          className={clsx(
            'input',
            error && 'input-error',
            success && 'input-success',
            className
          )}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {success && <p className="text-xs text-success-600 mt-1">{success}</p>}
        {help && !error && <p className="form-help">{help}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  help?: string;
  options?: Array<{ value: string | number; label: string }>;
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, help, options, className, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="form-label">{label}</label>}
        <select
          ref={ref}
          className={clsx(
            'select',
            error && 'input-error',
            className
          )}
          {...props}
        >
          {children}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="form-error">{error}</p>}
        {help && !error && <p className="form-help">{help}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  help?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, help, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="form-label">{label}</label>}
        <textarea
          ref={ref}
          className={clsx(
            'input resize-none',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {help && !error && <p className="form-help">{help}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

