'use client';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'soft';
  asChild?: boolean;
};

export default function Button({ className='', variant='primary', ...props }: Props) {
  const styles = {
    primary:
      'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20',
    ghost:
      'bg-transparent text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/10',
    soft:
      'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25'
  }[variant];

  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${styles} ${className}`}
    />
  );
}
