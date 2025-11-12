"use client";

import React, { useMemo, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch, Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";

/* ---------------- inline icons (no external deps) ---------------- */
const Icons = {
  Upload: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/><path d="M7 9l5-5 5 5"/><path d="M12 4v12"/></svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7-11-7z"/></svg>
  ),
  Stop: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
  ),
  Edit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
  ),
  Mic: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10v2a7 7 0 0014 0v-2"/><path d="M12 19v3"/></svg>
  ),
  File: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
  ),
  ChevronR: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M9 18l6-6-6-6"/></svg>
  ),
  Link: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 000-7.07 5 5 0 00-7.07 0L10 6"/><path d="M14 11a5 5 0 00-7.07 0L5.5 12.43a5 5 0 000 7.07 5 5 0 007.07 0L14 18"/></svg>
  ),
  Save: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
  ),
};

/* ---------------- utils ---------------- */
const accent = {
  ring: "ring-indigo-400/40",
  text: "text-indigo-400",
  pill: "bg-indigo-500/15 text-indigo-400 ring-indigo-400/40",
  glow: "from-indigo-400/20 via-indigo-400/10 to-transparent",
};

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{label}</label>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-zinc-900/10 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-white/10">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</div>
          {subtitle ? <div className="text-xs text-zinc-500">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      {children}
    </motion.div>
  );
}

/* ---------------- audio input block ---------------- */
function AudioEditor({ value, onChange }) {
  const [useTTS, setUseTTS] = useState(value?.type === "tts");
  const audioRef = useRef(null);

  function update(next) {
    onChange({ ...(value || {}), ...next });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl bg-zinc-900/5 p-3 ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-800 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-800 dark:text-white dark:ring-white/10">
            {useTTS ? <Icons.Mic className="h-4 w-4"/> : <Icons.File className="h-4 w-4"/>}
          </span>
          <div className="text-sm font-medium">{useTTS ? "Text‑to‑Speech" : "Audio file"}</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Use TTS</span>
          <Switch
            checked={useTTS}
            onChange={(v)=>{ setUseTTS(v); update(v?{type:"tts"}:{type:"file"}); }}
            className={`${useTTS?"bg-indigo-500":"bg-zinc-600"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${useTTS?"translate-x-6":"translate-x-1"}`} />
          </Switch>
        </div>
      </div>

      {useTTS ? (
        <Field label="Prompt" hint="What should the voice say?">
          <textarea
            defaultValue={value?.text || "Welcome to Daytwo Telecom. Press 1 for sales, 2 for support."}
            onChange={(e)=>update({ type:"tts", text: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-lg border-0 bg-zinc-900/5 p-3 text-sm ring-1 ring-inset ring-zinc-900/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:bg-white/5 dark:ring-white/10"
          />
        </Field>
      ) : (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field label="File" hint="MP3 or WAV">
            <div className="flex items-center gap-3 rounded-lg bg-zinc-900/5 p-3 ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
              <Icons.File className="h-4 w-4 opacity-70"/>
              <input type="text" placeholder="/uploads/welcome.wav"
                defaultValue={value?.src || ""}
                onChange={(e)=>update({ type:"file", src: e.target.value })}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"/>
            </div>
          </Field>
          <div className="flex items-end">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10">
              <Icons.Upload className="h-4 w-4"/>
              <span>Upload</span>
              <input type="file" hidden onChange={(e)=>{
                const f = e.target.files?.[0];
                if (f) update({ type:"file", src: `/uploads/${f.name}`});
              }}/>
            </label>
          </div>
          <div className="sm:col-span-2 flex items-center justify-between rounded-lg bg-white/60 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-900/40 dark:ring-white/10">
            <audio ref={audioRef} src={value?.src || undefined} className="hidden"/>
            <div className="text-xs text-zinc-500">Preview</div>
            <div className="flex gap-2">
              <button onClick={()=>audioRef.current?.play()} className="rounded-md bg-zinc-900/5 px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/10 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"><Icons.Play className="h-4 w-4"/></button>
              <button onClick={()=>{ audioRef.current?.pause(); audioRef.current && (audioRef.current.currentTime=0); }} className="rounded-md bg-zinc-900/5 px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/10 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"><Icons.Stop className="h-4 w-4"/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- keypad editor ---------------- */
const KEYS = ["1","2","3","4","5","6","7","8","9","*","0","#"];
function DtmfEditor({ mapping, onChange }) {
  const [mode, setMode] = useState("collect"); // collect: simply capture the pressed key; menu: per‑key message

  function setKey(k, val){
    const next = { ...(mapping||{}) , [k]: val };
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500">Mode:</span>
        <button onClick={()=>setMode("collect")} className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset ${mode==="collect"?accent.pill:"text-zinc-500 hover:bg-zinc-900/5 ring-zinc-900/10 dark:ring-white/10 dark:hover:bg-white/10"}`}>Single digit</button>
        <button onClick={()=>setMode("menu")} className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset ${mode==="menu"?accent.pill:"text-zinc-500 hover:bg-zinc-900/5 ring-zinc-900/10 dark:ring-white/10 dark:hover:bg-white/10"}`}>IVR menu</button>
      </div>

      {mode==="collect" ? (
        <div className="rounded-xl bg-zinc-900/5 p-3 text-sm ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
          We will capture the next digit the caller presses and continue.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {KEYS.map((k)=> (
            <div key={k} className="rounded-lg bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
              <div className="mb-1 text-xs font-semibold">Key {k}</div>
              <input
                placeholder="text or /audio.wav"
                defaultValue={mapping?.[k] || ""}
                onChange={(e)=>setKey(k, e.target.value)}
                className="w-full rounded-md border-0 bg-white/70 px-2 py-1 text-sm ring-1 ring-inset ring-zinc-900/10 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:bg-zinc-900/40 dark:ring-white/10"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- preview modal ---------------- */
function PreviewModal({ open, onClose, flow }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100 shadow-2xl ring-1 ring-white/10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <div className="text-sm font-semibold opacity-80 mb-2">Call flow preview</div>
              <div className="grid gap-3">
                {[{t:"Play"},{t:"Gather"},{t:"Play"},{t:"End"}].map((s,i)=> (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/20 ring-1 ring-inset ring-indigo-400/30 grid place-items-center"><span className="text-xs font-semibold text-indigo-300">{i+1}</span></div>
                    <div className="flex-1 rounded-xl bg-zinc-900/60 px-3 py-2 text-sm ring-1 ring-white/10">{s.t}{s.t==="Play"?" audio/tts":""}</div>
                    {i<3 && <Icons.ChevronR className="h-4 w-4 opacity-40"/>}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="mb-2 text-sm font-semibold opacity-80">JSON</div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-900/80 p-3 text-xs ring-1 ring-white/10">{JSON.stringify(flow, null, 2)}</pre>
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button onClick={onClose} className="rounded-lg bg-white/10 px-3 py-2 text-sm ring-1 ring-inset ring-white/20 hover:bg-white/20">Close</button>
            </div>
          </motion.div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* ---------------- page ---------------- */
export default function FlowBuilderPage(){
  const [flow, setFlow] = useState({
    intro: { type: "tts", text: "Welcome to Daytwo Telecom. Press 1 for sales, 2 for support." },
    dtmf: { mode: "collect", map: {} },
    after: { type: "tts", text: "Thanks. We will connect you shortly." },
  });
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <Container>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 py-8 lg:grid-cols-3">
        {/* left: vertical flow map */}
        <div className="lg:col-span-1">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 text-zinc-100 shadow-lg ring-1 ring-white/10">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Call flow</div>
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-b from-indigo-400/20 via-indigo-400/10 to-transparent"/>
            </div>

            <div className="space-y-4">
              {[{t:"Play / TTS",d:"intro"},{t:"Gather DTMF",d:"dtmf"},{t:"Play / TTS",d:"after"},{t:"End Call"}].map((n, i)=> (
                <div key={i} className="relative flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/20">
                    <span className="text-xs font-semibold">{i+1}</span>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-inset ring-white/10">{n.t}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* center: editors */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Step 1 — Play / TTS" subtitle="Greeting / IVR intro">
            <AudioEditor value={flow.intro} onChange={(v)=>setFlow({...flow, intro:v})}/>
          </Card>

          <Card title="Step 2 — Gather DTMF" subtitle="Capture digit or configure menu">
            <DtmfEditor mapping={flow.dtmf.map} onChange={(m)=>setFlow({...flow, dtmf:{...flow.dtmf, map:m}})}/>
          </Card>

          <Card title="Step 3 — Play / TTS" subtitle="After user presses a key">
            <AudioEditor value={flow.after} onChange={(v)=>setFlow({...flow, after:v})}/>
          </Card>
        </div>

        {/* right: actions & preview */}
        <div className="lg:col-span-1">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-3xl bg-zinc-900 p-6 text-zinc-100 shadow-lg ring-1 ring-white/10">
            <div className="mb-4 text-sm opacity-80">Actions</div>
            <div className="grid gap-3">
              <button onClick={()=>setOpenPreview(true)} className="rounded-xl bg-white/10 px-4 py-3 text-left ring-1 ring-inset ring-white/20 transition hover:bg-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Preview flow</div>
                  <Icons.Play className="h-4 w-4"/>
                </div>
                <div className="mt-1 text-xs opacity-70">See a visual timeline and the JSON your backend can consume.</div>
              </button>

              <button onClick={()=>{
                const blob = new Blob([JSON.stringify(flow,null,2)], {type:"application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href=url; a.download="callflow.json"; a.click();
                URL.revokeObjectURL(url);
              }} className="rounded-xl bg-white/10 px-4 py-3 text-left ring-1 ring-inset ring-white/20 transition hover:bg-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Export JSON</div>
                  <Icons.Save className="h-4 w-4"/>
                </div>
                <div className="mt-1 text-xs opacity-70">Download a JSON definition of this flow.</div>
              </button>

              <button className="rounded-xl bg-white/10 px-4 py-3 text-left ring-1 ring-inset ring-white/20 transition hover:bg-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Connect webhook</div>
                  <Icons.Link className="h-4 w-4"/>
                </div>
                <div className="mt-1 text-xs opacity-70">POST the DTMF result to your server.</div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <PreviewModal open={openPreview} onClose={()=>setOpenPreview(false)} flow={flow}/>
    </Container>
  );
}
