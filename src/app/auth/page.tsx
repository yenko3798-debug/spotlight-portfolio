"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";

// ---- inline icons (no external deps) ----
const Icon = {
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M4 6h16v12H4z"/><path d="M22 6l-10 7L2 6"/></svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  EyeOff: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.8 21.8 0 014.06-4.94M9.9 4.24A10.93 10.93 0 0112 5c7 0 11 7 11 7a21.8 21.8 0 01-3.22 4.12"/><path d="M1 1l22 22"/></svg>
  ),
  Google: (p) => (
    <svg viewBox="0 0 533.5 544.3" {...p}><path fill="#EA4335" d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.2H272v95.1h146.9c-6.3 34-25 62.7-53.3 81.9v67h86.1c50.4-46.5 81.8-115.1 81.8-193.8z"/><path fill="#34A853" d="M272 544.3c72.9 0 134.2-24.1 178.9-65.2l-86.1-67c-23.9 16-54.4 25.5-92.8 25.5-71.3 0-131.8-48.1-153.5-112.7H31.8v70.9C76.3 492.5 168.2 544.3 272 544.3z"/><path fill="#4A90E2" d="M118.5 324.9c-10.5-31-10.5-64.6 0-95.5V158.5H31.8c-42.6 84.9-42.6 184.2 0 269.1l86.7-67z"/><path fill="#FBBC05" d="M272 106.8c39.6-.6 77.6 14.9 106.6 43.1l79.7-79.7C404.9 24.9 342.7-.6 272 0 168.2 0 76.3 51.8 31.8 158.5l86.7 70.9C140.2 154.9 200.7 106.8 272 106.8z"/></svg>
  ),
  Github: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.57V21c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.66-.31-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.55.12-3.23 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.68.24 2.93.12 3.23.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.61-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .31.22.68.83.57A12 12 0 0012 .5z"/></svg>
  ),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M20 6L9 17l-5-5"/></svg>),
};

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    // TODO: hook up to your auth API (NextAuth, Supabase, Clerk, custom, etc.)
    await new Promise(r=>setTimeout(r, 900));
    setLoading(false);
    alert(`${mode === 'signin' ? 'Welcome back' : 'Account created'}! (wire to your backend)`);
  }

  function SocialButton({onClick, children}){
    return (
      <button type="button" onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-zinc-800 ring-1 ring-zinc-900/10 transition hover:bg-white dark:bg-zinc-900/60 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-900">
        {children}
      </button>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(1200px_600px_at_0%_-10%,rgba(16,185,129,0.18),transparent),radial-gradient(900px_500px_at_100%_110%,rgba(124,58,237,0.12),transparent)]">
      {/* ambient grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:60px_60px]"></div>

      <Container>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 py-16 md:grid-cols-2">
          {/* Left copy */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.05}}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500 ring-1 ring-emerald-500/30">Daytwo Telecom</div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">Sign {mode==='signin'?'in':'up'} to your dashboard</h1>
            <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-300">Manage campaigns, top up balance, and view real‑time call analytics. Single account unlocks the full telephony suite.</p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2"><Icon.Check className="h-4 w-4 text-emerald-500"/>Secure OAuth & email logins</li>
              <li className="flex items-center gap-2"><Icon.Check className="h-4 w-4 text-emerald-500"/>2FA-ready; session revocation</li>
              <li className="flex items-center gap-2"><Icon.Check className="h-4 w-4 text-emerald-500"/>Audit logs for compliance</li>
            </ul>
          </motion.div>

          {/* Card */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={mode} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              className="relative rounded-3xl bg-white/75 p-6 shadow-xl ring-1 ring-zinc-900/10 backdrop-blur-md dark:bg-zinc-900/70 dark:ring-white/10">

              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{mode==='signin'? 'Welcome back' : 'Create account'}</div>
                <div className="text-xs text-zinc-500">
                  {mode==='signin'? (<>
                    No account? <button className="font-medium text-emerald-600 hover:underline" onClick={()=>setMode('signup')}>Sign up</button>
                  </>) : (<>
                    Have an account? <button className="font-medium text-emerald-600 hover:underline" onClick={()=>setMode('signin')}>Sign in</button>
                  </>)}
                </div>
              </div>

              {/* Social logins */}
              <div className="grid grid-cols-2 gap-3">
                <SocialButton onClick={()=>alert('Connect Google OAuth')}><Icon.Google className="h-5 w-5"/> Continue with Google</SocialButton>
                <SocialButton onClick={()=>alert('Connect GitHub OAuth')}><Icon.Github className="h-5 w-5"/> Continue with GitHub</SocialButton>
              </div>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-900/10 dark:bg-white/10"/>
                <div className="text-xs text-zinc-500">or with email</div>
                <div className="h-px flex-1 bg-zinc-900/10 dark:bg-white/10"/>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode==='signup' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">Full name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required
                      className="w-full rounded-xl border-0 bg-zinc-900/5 px-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <div className="relative">
                    <Icon.Mail className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500"/>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                      className="w-full rounded-xl border-0 bg-zinc-900/5 pl-8 pr-3 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <Icon.Lock className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-zinc-500"/>
                    <input type={show?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} required
                      className="w-full rounded-xl border-0 bg-zinc-900/5 pl-8 pr-8 py-2 text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:bg-white/5 dark:ring-white/10"/>
                    <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1.5 rounded-md p-1 text-zinc-500 hover:bg-zinc-900/5 dark:hover:bg-white/10">
                      {show? <Icon.EyeOff className="h-4 w-4"/> : <Icon.Eye className="h-4 w-4"/>}
                    </button>
                  </div>
                </div>

                {mode==='signin' ? (
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="accent-emerald-500"/>
                      Remember me
                    </label>
                    <a href="#" className="font-medium text-emerald-600 hover:underline">Forgot password?</a>
                  </div>
                ) : (
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-500">
                    <input type="checkbox" checked={agreed} onChange={(e)=>setAgreed(e.target.checked)} className="accent-emerald-500"/>
                    I agree to the <a className="text-emerald-600 hover:underline" href="#">Terms</a> and <a className="text-emerald-600 hover:underline" href="#">Privacy</a>
                  </label>
                )}

                <button type="submit" disabled={loading || (mode==='signup' && !agreed)}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/90 disabled:opacity-60">
                  {loading ? "Please wait…" : (mode==='signin'? 'Sign in' : 'Create account')}
                </button>
              </form>

              <p className="mt-3 text-center text-[11px] text-zinc-500">Protected by reCAPTCHA and subject to the Daytwo Telecom <a className="underline" href="#">Privacy Policy</a>.</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
