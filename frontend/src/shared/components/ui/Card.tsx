import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ className, size = 'md', children, ...props }: CardProps) {
  const sizeClass = {
    sm: 'card-compact',
    md: 'card',
    lg: 'card-lg'
  }[size];

  return (
    <div className={clsx(sizeClass, className)} {...props}>
      {children}
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Section({ title, subtitle, children, className, ...props }: SectionProps) {
  return (
    <section className={clsx('section', className)} {...props}>
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}

