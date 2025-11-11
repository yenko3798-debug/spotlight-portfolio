import React from 'react';

export default function Shell({
  title,
  actions,
  children
}:{title:string; actions?:React.ReactNode; children:React.ReactNode}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(16,185,129,.14),transparent),radial-gradient(1200px_600px_at_100%_100%,rgba(45,212,191,.14),transparent)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">{title}</h1>
          <div className="flex gap-3">{actions}</div>
        </div>
        {children}
      </div>
    </div>
  );
}
