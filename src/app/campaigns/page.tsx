"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";

/* inline icons (no extra deps) */
const Icons = {
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M20 12a8 8 0 10-3 6.3"/><path d="M20 4v6h-6"/></svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  Dot: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="12" cy="12" r="6"/></svg>),
  Play: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7-11-7z"/></svg>),
};

/* fake event stream — replace with your API polling or websockets */
function useMockCalls() {
  const [rows, setRows] = useState(() => seed());
  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) => tick(prev));
    }, 1500);
    return () => clearInterval(t);
  }, []);
  return [rows, setRows];
}

const STATUS = ["queued", "ringing", "answered", "voicemail", "no-answer", "busy", "failed", "completed"] as const;

function seed() {
  const callers = ["+12125550123", "+13025550123", "+17185550123"]; 
  const callees = [
    "+19293702263",
    "+13043144276",
    "+15105551234",
    "+17865550123",
    "+14435550123",
    "+18005550123",
  ];
  const s = [];
  for (let i = 0; i < 64; i++) {
    const start = Date.now() - Math.floor(Math.random() * 1000 * 60 * 30);
    const st = ["queued", "ringing", "answered", "voicemail", "no-answer"][Math.floor(Math.random() * 5)];
    const dtmf = Math.random() < 0.25 ? randomDTMF() : null;
    s.push({
      id: `CF-${(100000 + i).toString(36)}`,
      time: start,
      caller: callers[Math.floor(Math.random() * callers.length)],
      callee: callees[Math.floor(Math.random() * callees.length)],
      status: st,
      duration: st === "answered" || st === "voicemail" ? Math.floor(Math.random() * 240) + 10 : 0,
      cost: +(Math.random() * 0.09 + 0.01).toFixed(4),
      dtmf,
      recordingUrl: Math.random() < 0.3 ? "#" : null,
    });
  }
  return s;
}

function tick(prev) {
  // randomly advance some rows
  return prev.map((r) => {
    if (Math.random() > 0.1) return r;
    const advance: Record<string, string> = {
      queued: "ringing",
      ringing: Math.random() < 0.5 ? "no-answer" : (Math.random() < 0.5 ? "answered" : "voicemail"),
      answered: "completed",
      voicemail: "completed",
      "no-answer": "completed",
    };
    const next = advance[r.status] || r.status;
    return {
      ...r,
      status: next,
      duration: next === "completed" ? r.duration : r.duration + (Math.random() * 6 | 0),
      dtmf: r.dtmf || (next === "answered" && Math.random() < 0.15 ? randomDTMF() : null),
    };
  });
}

function randomDTMF(){
  const keys = ["1","2","3","4","5","6","7","8","9","0","*","#"]; 
  const len = 1 + Math.floor(Math.random()*4); 
  let out = ""; for(let i=0;i<len;i++){ out += keys[Math.floor(Math.random()*keys.length)]; }
  return out;
}

function classNames(...a){ return a.filter(Boolean).join(" "); }

export default function CampaignStatusPage(){
  const [rows] = useMockCalls();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | "all">("all");
  const [dtmfOnly, setDtmfOnly] = useState(false);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (q && !(`${r.callee} ${r.caller} ${r.id}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (status !== "all" && r.status !== status) return false;
      if (dtmfOnly && !r.dtmf) return false;
      return true;
    });
  }, [rows, q, status, dtmfOnly]);

  const stats = useMemo(() => {
    const total = rows.length;
    const answered = rows.filter(r=> r.status === "answered" || (r.status === "completed" && r.duration>0)).length;
    const dtmf = rows.filter(r=> !!r.dtmf).length;
    const failed = rows.filter(r=> r.status === "failed").length;
    const spend = rows.reduce((s,r)=> s + r.cost, 0);
    return { total, answered, dtmf, failed, spend: +spend.toFixed(2) };
  }, [rows]);

  function exportCsv(){
    const header = ["id","time","caller","callee","status","duration","cost","dtmf"].join(",");
    const body = filtered.map(r=> [r.id, new Date(r.time).toISOString(), r.caller, r.callee, r.status, r.duration, r.cost, r.dtmf||""].join(",")).join("\n");
    const blob = new Blob([header+"\n"+body], {type:"text/csv"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download = "campaign-status.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const statusChips = [
    {key:"all", label:"All"},
    {key:"queued", label:"Queued"},
    {key:"ringing", label:"Ringing"},
    {key:"answered", label:"Answered"},
    {key:"voicemail", label:"Voicemail"},
    {key:"no-answer", label:"No Answer"},
    {key:"busy", label:"Busy"},
    {key:"failed", label:"Failed"},
    {key:"completed", label:"Completed"},
  ];

  return (
    <Container>
      <div className="mx-auto w-full max-w-7xl py-8">
        {/* header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Campaign status</h1>
            <p className="text-xs text-zinc-500">Live feed of calls with DTMF filtering, search and export.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900/5 px-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/10 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"><Icons.Download className="h-4 w-4"/> Export CSV</button>
          </div>
        </div>

        {/* stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard title="Total calls" value={stats.total} />
          <StatCard title="Answered" value={stats.answered} subtitle={`${Math.round((stats.answered/stats.total||0)*100)}% ASR`} tone="emerald"/>
          <StatCard title="DTMF captured" value={stats.dtmf} subtitle={`${Math.round((stats.dtmf/stats.total||0)*100)}% conv.`} tone="violet"/>
          <StatCard title="Spend ($)" value={`$${stats.spend}`} tone="amber"/>
        </div>

        {/* filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Icons.Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500"/>
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search id / caller / callee" className="w-64 rounded-lg border-0 bg-zinc-900/5 pl-8 pr-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
          </div>
          <div className="flex flex-wrap gap-1">
            {statusChips.map((c)=> (
              <button key={c.key} onClick={()=> setStatus(c.key as any)} className={classNames("rounded-full px-3 py-1 text-xs ring-1 ring-inset", status===c.key?"bg-emerald-500/20 text-emerald-600 ring-emerald-400/40":"text-zinc-600 hover:bg-zinc-900/5 ring-zinc-900/10 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/10")}>{c.label}</button>
            ))}
          </div>
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900/5 px-3 py-2 text-xs ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
            <input type="checkbox" checked={dtmfOnly} onChange={(e)=>setDtmfOnly(e.target.checked)} className="accent-emerald-500"/>
            DTMF only
          </label>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-zinc-900/10 dark:ring-white/10">
          <div className="max-h-[520px] overflow-auto">
            <table className="min-w-full divide-y divide-zinc-900/10 dark:divide-white/10">
              <thead className="bg-zinc-50/70 dark:bg-zinc-900/30">
                <tr className="text-left text-xs text-zinc-500">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Caller → Callee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dur</th>
                  <th className="px-4 py-3">DTMF</th>
                  <th className="px-4 py-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/5 dark:divide-white/5 text-sm">
                <AnimatePresence initial={false}>
                  {filtered.map((r)=> (
                    <motion.tr key={r.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="hover:bg-zinc-900/2.5 dark:hover:bg-white/5">
                      <td className="px-4 py-2 whitespace-nowrap text-zinc-500">{new Date(r.time).toLocaleTimeString()}</td>
                      <td className="px-4 py-2 font-mono text-[12px] text-zinc-600 dark:text-zinc-300">{r.id}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{r.caller}</span>
                          <span className="text-zinc-500">→</span>
                          <span className="text-zinc-700 dark:text-zinc-200">{r.callee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2"><StatusBadge value={r.status}/></td>
                      <td className="px-4 py-2 tabular-nums text-zinc-700 dark:text-zinc-200">{r.duration ? `${r.duration}s` : "—"}</td>
                      <td className="px-4 py-2 font-mono text-xs">{r.dtmf || ""}</td>
                      <td className="px-4 py-2 tabular-nums">${r.cost.toFixed(4)}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-zinc-500">Showing {filtered.length} of {rows.length} calls.</p>
      </div>
    </Container>
  );
}

function StatusBadge({ value }:{ value: string }){
  const map: Record<string, {label:string, cls:string}> = {
    queued: {label:"Queued", cls:"bg-zinc-500/15 text-zinc-600 ring-zinc-500/30"},
    ringing: {label:"Ringing", cls:"bg-sky-500/15 text-sky-600 ring-sky-500/30"},
    answered: {label:"Answered", cls:"bg-emerald-500/15 text-emerald-600 ring-emerald-500/30"},
    voicemail: {label:"Voicemail", cls:"bg-violet-500/15 text-violet-600 ring-violet-500/30"},
    "no-answer": {label:"No answer", cls:"bg-amber-500/15 text-amber-700 ring-amber-500/30"},
    busy: {label:"Busy", cls:"bg-orange-500/15 text-orange-600 ring-orange-500/30"},
    failed: {label:"Failed", cls:"bg-rose-500/15 text-rose-600 ring-rose-500/30"},
    completed: {label:"Completed", cls:"bg-teal-500/15 text-teal-600 ring-teal-500/30"},
  };
  const m = map[value] || map.queued;
  return <span className={"inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ring-1 " + m.cls}><Icons.Dot className="h-1.5 w-1.5"/>{m.label}</span>
}

function StatCard({ title, value, subtitle, tone }:{ title:string, value:React.ReactNode, subtitle?:string, tone?:"emerald"|"violet"|"amber" }){
  const ring = tone === "emerald" ? "ring-emerald-400/30" : tone === "violet" ? "ring-violet-400/30" : tone === "amber" ? "ring-amber-400/30" : "ring-zinc-900/10";
  return (
    <div className={`rounded-2xl bg-white/70 p-4 ring-1 backdrop-blur-sm dark:bg-zinc-900/60 ${ring}`}>
      <div className="text-xs text-zinc-500">{title}</div>
      <div className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
      {subtitle && <div className="text-xs text-zinc-500">{subtitle}</div>}
    </div>
  );
}
