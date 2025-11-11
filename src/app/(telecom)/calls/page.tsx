'use client';
import React, { useState } from 'react';
import { extractPhonesWithContext } from '@/lib/phone';

type Lead = { line: string; phone?: string };

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-md shadow-black/30">
    <div className="mb-2 text-sm font-semibold text-slate-200">{title}</div>
    {children}
  </div>
);

export default function Page() {
  const [text, setText] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callerId, setCallerId] = useState('');
  const [cps, setCps] = useState<number>(3);
  const [flowId, setFlowId] = useState('');

  function parseText(t: string) {
    const rows = t.split(/\r?\n/).filter(Boolean);
    const outs: Lead[] = rows.map((line) => {
      const p = extractPhonesWithContext(line).filter((x) => x.e164).map((x) => x.e164!);
      return { line, phone: p[0] };
    });
    setLeads(outs.filter((x) => x.phone));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => parseText(String(reader.result || ''));
    reader.readAsText(file);
  }

  async function startCampaign() {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flowId, callerId, cps, leads })
    });
    const j = await res.json();
    alert(`Campaign created: ${j.id}`);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(16,185,129,.12),transparent),radial-gradient(1200px_600px_at_100%_100%,rgba(6,182,212,.12),transparent)]">
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">Send Calls</h1>
          <a href="/(telecom)/replies" className="rounded-lg border border-emerald-400/40 px-4 py-2 text-emerald-300">View Replies</a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Upload list">
            <input type="file" accept=".txt,.csv" onChange={onFile} className="text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-emerald-500" />
            <textarea
              className="mt-3 h-40 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-100"
              placeholder="Or paste lines here…"
              value={text}
              onChange={(e) => { setText(e.target.value); parseText(e.target.value); }}
            />
            <div className="mt-2 text-xs text-slate-400">Any format works; we auto-extract the first valid phone per line.</div>
          </Card>

          <Card title="Campaign settings">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400">Flow ID</label>
                <input value={flowId} onChange={(e) => setFlowId(e.target.value)} placeholder="Use /flow to create one" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Caller ID (E.164)</label>
                <input value={callerId} onChange={(e) => setCallerId(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Calls per second</label>
                <input type="number" value={cps} onChange={(e) => setCps(parseInt(e.target.value || '0'))} className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
              </div>
              <button onClick={startCampaign} className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900">Create campaign</button>
            </div>
          </Card>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-md shadow-black/30">
          <div className="mb-2 text-sm font-semibold text-slate-200">Parsed leads ({leads.length})</div>
          <div className="max-h-72 overflow-auto text-sm">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="py-1 pr-3">Phone</th>
                  <th className="py-1">Line</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i} className="border-t border-slate-800">
                    <td className="py-1 pr-3 font-mono">{l.phone}</td>
                    <td className="py-1">{l.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
