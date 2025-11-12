"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";

/* ---------------- inline icons ---------------- */
const Icons = {
  Upload: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/><path d="M7 9l5-5 5 5"/><path d="M12 4v12"/></svg>
  ),
  File: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7-11-7z"/></svg>
  ),
  Pause: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
  ),
  Stop: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
  ),
  Download: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12.8 19.79 19.79 0 010 4.18 2 2 0 012 2h4.09A2 2 0 018 3.72c.13.5.31 1 .54 1.47a2 2 0 01-.45 2.18L6 9a16 16 0 007 7l1.64-2.09a2 2 0 012.18-.45c.49.23.98.41 1.5.54A2 2 0 0121.92 16z"/></svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4zM19 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>
  ),
  X: (p)=> (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>)
};

/* ---------------- tiny toast ---------------- */
function useToast(){
  const [toasts,setToasts]=useState([]);
  const push=(msg)=>{const id=Math.random().toString(36).slice(2); setToasts(t=>[...t,{id,msg}]); setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),1800)};
  function View(){
    return (
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex max-w-sm flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map(t=> (
            <motion.div key={t.id} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              className="pointer-events-auto rounded-xl bg-zinc-900/90 px-3 py-2 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur">{t.msg}</motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }
  return {push, View};
}

/* ---------------- helpers ---------------- */
function extractPhones(text, country="US"){ // light heuristic, US‑biased
  const out = new Set();
  const re = /(?:(?:\+?1[\s-.]?)?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]?\d{4}|\+\d{7,15})/g; // +1 (555) 123‑4567 or +4420...
  const matches = text.match(re) || [];
  for(const m of matches){
    let d = m.replace(/[^+\d]/g, "");
    if(d.startsWith("+")) { /* keep */ }
    else {
      d = d.replace(/^1/, ""); // remove leading 1 if present
      d = "+1" + d; // default
    }
    if(d.length>=10) out.add(d);
  }
  return Array.from(out);
}

/* ---------------- page ---------------- */
export default function CampaignsPage(){
  const { push, View: Toasts } = useToast();

  const [rawText, setRawText] = useState("");
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("Daytwo Test Campaign");
  const [callerId, setCallerId] = useState("+12125550123");
  const [cps, setCps] = useState(3);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);

  function onFile(e){
    const f = e.target.files?.[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setRawText(text);
      const nums = extractPhones(text);
      setLeads(nums);
      push(`Found ${nums.length} numbers`);
    };
    reader.readAsText(f);
  }

  function downloadClean(){
    const blob = new Blob([leads.join("\n")], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="leads_clean.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  // fake sender to visualize CPS throttling
  const timerRef = useRef(null);
  function start(){
    if(!leads.length) { push("Upload leads first"); return; }
    setRunning(true); setProgress(0); setSent(0);
    let idx=0;
    timerRef.current = setInterval(()=>{
      const burst = Math.min(cps, leads.length-idx);
      if(burst<=0){ stop(); return; }
      idx += burst;
      setSent((s)=> s+burst);
      setProgress(Math.round((idx/leads.length)*100));
      // here you would POST to your backend with leads.slice(idx-burst, idx)
    }, 1000);
    push("Campaign started");
  }
  function pause(){ if(timerRef.current){ clearInterval(timerRef.current); timerRef.current=null; setRunning(false); push("Paused"); } }
  function stop(){ if(timerRef.current){ clearInterval(timerRef.current); timerRef.current=null; } setRunning(false); setProgress(100); push("Completed"); }

  return (
    <Container>
      <Toasts />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 py-8 lg:grid-cols-3">
        {/* LEFT: campaign form */}
        <div className="lg:col-span-2">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-zinc-900/10 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-white/10">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Run a campaign</h1>
              <div className="text-xs text-zinc-500">CPS throttles call dispatch per second</div>
            </div>

            {/* upload */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900/5 px-4 py-3 text-sm ring-1 ring-inset ring-zinc-900/10 transition hover:bg-zinc-900/10 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10 sm:w-auto">
                <Icons.Upload className="h-4 w-4"/>
                <span>Upload leads (.txt, any format)</span>
                <input type="file" accept=".txt,.csv,.tsv,.log,.md" hidden onChange={onFile}/>
              </label>
              <button onClick={downloadClean} disabled={!leads.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900/5 px-4 py-3 text-sm ring-1 ring-inset ring-zinc-900/10 transition hover:bg-zinc-900/10 disabled:opacity-50 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10">
                <Icons.Download className="h-4 w-4"/> Download cleaned list
              </button>
            </div>

            {/* preview / textarea */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <div className="mb-2 text-xs text-zinc-500">Raw file (auto‑parsed)</div>
                <textarea value={rawText} onChange={(e)=>{setRawText(e.target.value); setLeads(extractPhones(e.target.value));}}
                  placeholder="Paste numbers or any text here..." rows={12}
                  className="w-full resize-y rounded-xl border-0 bg-zinc-900/5 p-3 text-sm ring-1 ring-inset ring-zinc-900/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>Extracted numbers</span>
                  <span>{leads.length} unique</span>
                </div>
                <div className="max-h-[264px] overflow-auto rounded-xl bg-white/70 p-3 text-sm ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-900/50 dark:ring-white/10">
                  {leads.length? (
                    <ul className="grid grid-cols-2 gap-1 font-mono text-[12px] opacity-90">
                      {leads.slice(0,2000).map((n,i)=> (<li key={i}>{n}</li>))}
                    </ul>
                  ): (
                    <div className="text-xs text-zinc-500">Upload or paste to see numbers here…</div>
                  )}
                </div>
              </div>
            </div>

            {/* settings */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Campaign name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-lg border-0 bg-zinc-900/5 px-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Caller ID (E.164)</label>
                <input value={callerId} onChange={(e)=>setCallerId(e.target.value)} className="w-full rounded-lg border-0 bg-zinc-900/5 px-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg白/5 dark:ring-white/10"/>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">CPS</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={30} value={cps} onChange={(e)=>setCps(parseInt(e.target.value))} className="flex-1 accent-emerald-500"/>
                  <div className="w-12 text-right text-sm font-semibold">{cps}</div>
                </div>
              </div>
            </div>

            {/* controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!running ? (
                <button onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/40 hover:bg-emerald-500/25"><Icons.Play className="h-4 w-4"/> Start campaign</button>
              ) : (
                <button onClick={pause} className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-400/40 hover:bg-amber-500/25"><Icons.Pause className="h-4 w-4"/> Pause</button>
              )}
              <button onClick={stop} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900/5 px-4 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/10 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"><Icons.Stop className="h-4 w-4"/> Stop</button>
            </div>

            {/* progress */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>Progress</span>
                <span>{sent}/{leads.length} sent • {progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200/40 dark:bg-zinc-800">
                <div className="h-full bg-emerald-400/70" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: tips / validation */}
        <div className="lg:col-span-1">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl bg-zinc-900 p-6 text-zinc-100 shadow-lg ring-1 ring-white/10">
            <div className="mb-4 text-sm opacity-80">Quality & hygiene</div>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"><Icons.Sparkle className="h-3 w-3"/></span> We automatically extract and de‑duplicate numbers from any text file.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"><Icons.Phone className="h-3 w-3"/></span> Numbers are normalized to **E.164** with **+1** default. Change in backend if needed.</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"><Icons.Sparkle className="h-3 w-3"/></span> Respect carrier rules; validate DNC and consent in production.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
