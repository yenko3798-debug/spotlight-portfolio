import clsx from 'clsx';

export default function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_10px_40px_-15px_rgba(16,185,129,.25)]',
        className
      )}
      {...props}
    />
  );
}
