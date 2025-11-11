import React from 'react';

export default function Card({ className='', children }:{className?:string, children: React.ReactNode}) {
  return (
    <div className={`rounded-3xl border border-emerald-400/20 bg-slate-950/75 p-5 shadow-xl shadow-emerald-500/10 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
