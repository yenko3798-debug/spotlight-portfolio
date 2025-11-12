import clsx from 'clsx';

export function Label({ className, ...p }: React.ComponentProps<'label'>) {
  return <label className={clsx('block text-xs font-semibold text-slate-300', className)} {...p} />;
}
export function Input({ className, ...p }: React.ComponentProps<'input'>) {
  return <input className={clsx('w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40', className)} {...p} />;
}
export function TextArea({ className, ...p }: React.ComponentProps<'textarea'>) {
  return <textarea className={clsx('w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40', className)} {...p} />;
}
export default function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}
