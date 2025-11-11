'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Shell from '@/components/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import dayjs from 'dayjs';

type Reply = { campaignId: string; from: string; dtmf: string; line: string; ts: number };

export default function Page() {
  const [items, setItems] = useState<Reply[]>([]);
  const [q, setQ] = useState('');
  const [onlyToday, setOnlyToday] = useState(false);

  async function load() {
    const res = await fetch('/api/replies', { cache: 'no-store' });
    setItems(await res.json());
  }
  useEffect(()=>{ load(); const t=setInterval(load, 1500); return ()=>clearInterval(t); },[]);

  const filtered = useMemo(()=>{
    const term = q.toLowerCase();
    return items
      .filter(i => (onlyToday ? dayjs(i.ts).isAfter(dayjs().startOf('day')) : true))
      .filter(i => i.line.toLowerCase().includes(term) || i.from.includes(q));
  },[items,q,onlyToday]);

  function exportCSV() {
    const rows = [['time','from','campaign','line']];
    for(const r of filtered) rows.push([new Date(r.ts).toISOString(), r.from, r.campaignId, r.line.replace(/"/g,'""')]);
    const csv = rows.map(r=>r.map(x=>`"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'replies.csv';
    a.click();
  }

  return (
    <Shell
      title="DTMF Replies"
      actions={
        <>
          <Button variant="soft" onClick={()=>setOnlyToday(x=>!x)}>{onlyToday? 'Showing: today':'Filter: today'}</Button>
          <Button onClick={exportCSV}>Export CSV</Button>
          <a href="/calls" className="rounded-xl px-4 py-2 text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/10">Send Calls</a>
        </>
      }
    >
      <Card>
        <Input placeholder="Search by number or text…" value={q} onChange={e=>setQ(e.target.value)} />
        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-emerald-400/20">
          <table className="w-full text-sm">
            <thead className="bg-emerald-500/10 text-slate-300">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">From</th>
                <th className="px-3 py-2 text-left">Campaign</th>
                <th className="px-3 py-2 text-left">Original line</th>
              </tr>
            </thead>
            <tbody className="bg-slate-950/70">
              {filtered.map((r, idx)=>(
                <tr key={idx} className="border-t border-slate-800/80 hover:bg-emerald-500/5 transition">
                  <td className="px-3 py-2">{dayjs(r.ts).format('YYYY-MM-DD HH:mm')}</td>
                  <td className="px-3 py-2 font-mono">{r.from}</td>
                  <td className="px-3 py-2">{r.campaignId}</td>
                  <td className="px-3 py-2">{r.line}</td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={4}>No replies yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
