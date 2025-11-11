'use client';
import React, { useMemo, useState } from 'react';
import Shell from '@/components/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, TextArea, Label } from '@/components/ui/Field';
import { extractPhonesWithContext } from '@/lib/phone';

type Lead = { line: string; phone?: string };

export default function Page() {
  const [text,setText] = useState('');
  const [leads,setLeads] = useState<Lead[]>([]);
  const [callerId,setCallerId] = useState('');
  const [cps,setCps] = useState<number>(3);
  const [flowId,setFlowId] = useState('');

  function parseText(t: string){
    const rows = t.split(/\r?\n/).filter(Boolean);
    const outs: Lead[] = rows.map(line=>{
      const phones = extractPhonesWithContext(line).filter(x=>x.e164).map(x=>x.e164!);
      return { line, phone: phones[0] };
    });
    setLeads(outs.filter(x=>x.phone));
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = () => parseText(String(reader.result||''));
    reader.readAsText(f);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=> parseText(String(r.result||''));
    r.readAsText(f);
  }

  async function startCampaign(){
    const res = await fetch('/api/campaigns', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ flowId, callerId, cps, leads })
    });
    const j = await res.json();
    alert('Campaign created: '+j.id);
  }

  const stats = useMemo(()=>({
    total: text.split(/\r?\n/).filter(Boolean).length,
    parsed: leads.length
  }),[text,leads]);

  return (
    <Shell
      title="Send Calls"
      actions={<a href="/replies" className="text-emerald-300 underline">View Replies</a>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div
            onDragOver={(e)=>e.preventDefault()}
            onDrop={onDrop}
            className="rounded-2xl border border-dashed border-emerald-400/40 bg-slate-900/50 p-4 text-center text-slate-300"
          >
            Drag & drop a file here
            <div className="mt-3">
              <input type="file" accept=".txt,.csv" onChange={onFile}
                     className="text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-emerald-500" />
            </div>
          </div>
          <div className="mt-4">
            <TextArea
              className="h-40"
              placeholder="Or paste lines here… Any separators, any order."
              value={text}
              onChange={(e)=>{ setText(e.target.value); parseText(e.target.value); }}
            />
            <div className="mt-2 text-xs text-slate-500">
              We auto-extract the first valid phone number per line.
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-200 ring-1 ring-emerald-400/30">
              Total lines: <span className="font-semibold text-emerald-300">{stats.total}</span>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-200 ring-1 ring-emerald-400/30">
              Parsed numbers: <span className="font-semibold text-emerald-300">{stats.parsed}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="grid gap-4">
            <div>
              <Label>Flow ID</Label>
              <Input value={flowId} onChange={e=>setFlowId(e.target.value)} placeholder="Use /flow to design a call flow" />
            </div>
            <div>
              <Label>Caller ID (E.164)</Label>
              <Input value={callerId} onChange={e=>setCallerId(e.target.value)} placeholder="+15551234567" />
            </div>
            <div>
              <Label>Calls per second: {cps}</Label>
              <input type="range" min={1} max={30} value={cps}
                onChange={e=>setCps(parseInt(e.target.value))}
                className="w-full accent-emerald-400"/>
            </div>
            <div className="flex gap-3">
              <Button onClick={startCampaign}>Create campaign</Button>
              <Button variant="ghost" onClick={()=>{ setText(''); setLeads([]); }}>Clear</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="mb-2 text-sm font-semibold text-slate-200">Parsed leads ({leads.length})</div>
          <div className="max-h-72 overflow-auto text-sm">
            <table className="w-full">
              <thead className="text-left text-slate-400">
                <tr><th className="py-1 pr-3">Phone</th><th className="py-1">Line</th></tr>
              </thead>
              <tbody>
                {leads.map((l,i)=>(
                  <tr key={i} className="border-t border-slate-800/80 hover:bg-emerald-500/5">
                    <td className="py-1 pr-3 font-mono">{l.phone}</td>
                    <td className="py-1">{l.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
