'use client';
import React, { useEffect, useState } from 'react';

type Reply = { campaignId: string; from: string; dtmf: string; line: string; ts: number };

export default function Page() {
  const [items, setItems] = useState<Reply[]>([]);
  const [q, setQ] = useState('');

  async function load() {
    const res = await fetch('/api/replies', { cache: 'no-store' });
    setItems(await res.json());
  }
  useEffect(() => { load(); const t = setInterval(load, 1500); return () => clearInterval(t); }, []);

  const filtered = items.filter(i => i.line.toLowerCase().includes(q.toLowerCase()) || i.from.includes(q));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">DTMF Replies</h1>
          <a href="/(telecom)/calls" className="rounded-lg border border-emerald-400/40 px-4 py-2 text-emerald-300">Send Calls</a>
        </div>

        <div className="mb-4">
          <input placeholder="Search by number or text…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-4 shadow-xl shadow-emerald-500/10 backdrop-blur">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-1 pr-3">Time</th>
                <th className="py-1 pr-3">From</th>
                <th className="py-1 pr-3">Campaign</th>
                <th className="py-1">Original line</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={idx} className="border-t border-slate-800">
                  <td className="py-2 pr-3">{new Date(r.ts).toLocaleString()}</td>
                  <td className="py-2 pr-3 font-mono">{r.from}</td>
                  <td className="py-2 pr-3">{r.campaignId}</td>
                  <td className="py-2">{r.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-6 text-center text-slate-400">No replies yet.</div>}
        </div>
      </div>
    </div>
  );
}
