import React from 'react';

export function Label({children}:{children:React.ReactNode}) {
  return <label className="mb-1 block text-xs font-medium text-slate-400">{children}</label>;
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 ${props.className||''}`} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 ${props.className||''}`} />;
}
