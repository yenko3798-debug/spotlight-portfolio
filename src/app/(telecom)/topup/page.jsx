"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";

/* ---------- tiny inline icons (no external deps) ---------- */
const Icons = {
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Repeat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a6 6 0 016-6h12" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a6 6 0 01-6 6H3" />
    </svg>
  ),
  Link2: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 000-7.07 5 5 0 00-7.07 0L10 6" />
      <path d="M14 11a5 5 0 00-7.07 0L5.5 12.43a5 5 0 000 7.07 5 5 0 007.07 0L14 18" />
    </svg>
  ),
  ArrowUpRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  ArrowDownToLine: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 21h14" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Copy: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  Qr: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm6-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 2h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
    </svg>
  ),
};

/* ---------- tiny toast ---------- */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1800);
  };
  function View() {
    return (
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex max-w-sm flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="pointer-events-auto rounded-xl bg-zinc-900/90 px-3 py-2 text-sm text-white shadow-lg ring-1 ring-white/10 backdrop-blur"
            >
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }
  return { push, View };
}

/* ---------- UI bits ---------- */
function ActionButton({ label, Icon, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group inline-flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-zinc-900/5 px-3 py-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-900/10 transition hover:ring-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:bg-white/5 dark:text-zinc-100 dark:ring-white/10"
    >
      <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-zinc-200 to-zinc-300 text-zinc-800 shadow-sm ring-1 ring-inset ring-white/50 transition group-hover:shadow group-hover:brightness-110 dark:from-zinc-700 dark:to-zinc-800 dark:text-white dark:ring-white/20">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[11px] font-medium opacity-90">{label}</span>
    </motion.button>
  );
}

function TokenRowSkeleton() {
  return (
    <div className="animate-pulse rounded-xl px-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-900/10 dark:bg-white/10" />
          <div className="h-4 w-28 rounded bg-zinc-900/10 dark:bg-white/10" />
        </div>
        <div className="h-4 w-16 rounded bg-zinc-900/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

function TokenRow({ icon, name, value, sub, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left"
    >
      <div className="flex items-center justify-between rounded-xl px-2 py-2 transition hover:bg-zinc-900/5 dark:hover:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/10 dark:bg-white/10 dark:ring-white/10">
            <span className="text-lg">{icon}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
        </div>
      </div>
    </motion.button>
  );
}

function SectionCard({ title, children, footer, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-zinc-900/10 backdrop-blur-sm dark:bg-zinc-900/60 dark:ring-white/10"
    >
      {title ? (
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-zinc-600 dark:text-zinc-300">
          {title}
        </h3>
      ) : null}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-12 rounded-lg bg-zinc-900/10 dark:bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-zinc-900/10 dark:bg-white/10" />
        </div>
      ) : (
        children
      )}
      {footer ? (
        <div className="mt-4 border-t border-zinc-900/10 pt-3 dark:border-white/10">{footer}</div>
      ) : null}
    </motion.div>
  );
}

function AddressRow({ label, address, onShowQr, onCopy }) {
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-900/10 bg-white/60 p-3 transition hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60">
      <div>
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{short}</div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onShowQr}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg ring-1 ring-zinc-900/10 transition hover:bg-zinc-900/5 hover:ring-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:ring-white/10 dark:hover:bg-white/10"
          aria-label="Show QR"
        >
          <Icons.Qr className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg ring-1 ring-zinc-900/10 transition hover:bg-zinc-900/5 hover:ring-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:ring-white/10 dark:hover:bg-white/10"
          aria-label="Copy"
        >
          <Icons.Copy className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}

function QrModal({ open, onClose, address, network = "Ethereum" }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 text-zinc-100 shadow-2xl ring-1 ring-white/10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm opacity-80">Scan to Top Up ({network})</div>
              <button
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-xs ring-1 ring-inset ring-white/10 hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="mx-auto mb-4 grid h-64 w-64 place-items-center rounded-xl bg-zinc-800">
              <div className="text-xs opacity-60">QR CODE</div>
            </div>
            <div className="rounded-xl bg-zinc-800 p-3">
              <div className="text-xs opacity-70">Your {network} address</div>
              <div className="truncate text-sm font-mono">{address}</div>
            </div>
            <p className="mt-3 text-xs opacity-60">
              Use this address for top ups on {network} and compatible networks. Transactions may
              take time to confirm.
            </p>
          </motion.div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* ---------- Page ---------- */
export default function TopUpPage() {
  const { push, View: Toasts } = useToast();

  const networkAddrs = useMemo(
    () => ({
      Ethereum: "0xbc4421f4a8c9874f00d94f6c1e954432wgwCof",
      Solana: "8o4Z4VYtq9Cpc7p1S4mZZyUA3bH1solana",
      Bitcoin: "bc1qqyxyxyxyxyxyxyxyxyxyxyxyxyxbtc",
      USDC: "0x915cUSDCe000000000000000000000000",
    }),
    []
  );

  const [network, setNetwork] = useState("Ethereum");
  const [qrAddr, setQrAddr] = useState(networkAddrs["Ethereum"]);
  const [qrOpen, setQrOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("address");
  const [loadingLeft, setLoadingLeft] = useState(true);
  const [loadingCenter, setLoadingCenter] = useState(true);
  const [loadingRight, setLoadingRight] = useState(true);
  const [packs, setPacks] = useState(1); // 1 pack = 1,000 calls

  useEffect(() => {
    const ids = [
      setTimeout(() => setLoadingLeft(false), 450),
      setTimeout(() => setLoadingCenter(false), 550),
      setTimeout(() => setLoadingRight(false), 650),
    ];
    return () => ids.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setQrAddr(networkAddrs[network]);
    setLoadingRight(true);
    const t = setTimeout(() => setLoadingRight(false), 300);
    return () => clearTimeout(t);
  }, [network, networkAddrs]);

  const copy = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      push("Address copied");
    } catch {
      push("Copy failed");
    }
  };

  const Tab = ({ id, children }) => (
    <button
      onClick={() => {
        if (activeTab !== id) {
          setLoadingCenter(true);
          setActiveTab(id);
          setTimeout(() => setLoadingCenter(false), 420);
        }
      }}
      className="relative px-1 pb-3 text-sm text-zinc-500 transition hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      <span className="font-medium">{children}</span>
      <AnimatePresence>
        {activeTab === id && (
          <motion.span
            layoutId="tab-underline"
            className="absolute -bottom-px left-0 right-0 h-0.5 bg-emerald-400"
          />
        )}
      </AnimatePresence>
    </button>
  );

  const min = 1,
    max = 20;
  const pct = ((packs - min) / (max - min)) * 100;

  return (
    <Container>
      <Toasts />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 py-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 text-zinc-100 shadow-lg ring-1 ring-white/10"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">telecom.cb.id</div>
              <div className="flex items-center gap-2 opacity-80">
                <span className="text-xs">•••</span>
              </div>
            </div>

            <div className="mb-6 text-3xl font-bold tracking-tight">$15,392.75</div>

            <div className="relative mb-6 grid grid-cols-5 gap-3">
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-b from-emerald-400/20 via-emerald-400/10 to-transparent" />
              <ActionButton label="Buy" Icon={Icons.Plus} onClick={() => push("Buy flow coming soon")} />
              <ActionButton label="Swap" Icon={Icons.Repeat} onClick={() => push("Swap flow coming soon")} />
              <ActionButton label="Bridge" Icon={Icons.Link2} onClick={() => push("Bridge flow coming soon")} />
              <ActionButton label="Send" Icon={Icons.ArrowUpRight} onClick={() => push("Send flow coming soon")} />
              <ActionButton label="Receive" Icon={Icons.ArrowDownToLine} onClick={() => setQrOpen(true)} />
            </div>

            <div className="flex gap-3">
              <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20">
                Crypto
              </button>
              <button className="rounded-full px-3 py-1 text-xs opacity-70 ring-1 ring-inset ring-white/20 hover:bg-white/10">
                NFTs
              </button>
              <button className="rounded-full px-3 py-1 text-xs opacity-70 ring-1 ring-inset ring-white/20 hover:bg-white/10">
                DeFi
              </button>
            </div>

            <div className="mt-5 space-y-1.5">
              {loadingLeft ? (
                <>
                  <TokenRowSkeleton />
                  <TokenRowSkeleton />
                  <TokenRowSkeleton />
                </>
              ) : (
                <>
                  <TokenRow
                    icon="🪙"
                    name="Ethereum"
                    value="$4,131.25"
                    sub="3.3461 ETH"
                    onClick={() => push("ETH details")}
                  />
                  <TokenRow
                    icon="₿"
                    name="Bitcoin"
                    value="$3,207.53"
                    sub="0.1906 BTC"
                    onClick={() => push("BTC details")}
                  />
                  <TokenRow
                    icon="⚪"
                    name="Optimism"
                    value="$2,720.31"
                    sub="2,641.0777 OP"
                    onClick={() => push("OP details")}
                  />
                  <TokenRow
                    icon="◎"
                    name="Solana"
                    value="$1,614.64"
                    sub="118.6363 SOL"
                    onClick={() => push("SOL details")}
                  />
                  <TokenRow
                    icon="⬡"
                    name="Matic"
                    value="$1,423.87"
                    sub="1,602.9806 MATIC"
                    onClick={() => push("MATIC details")}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* CENTER COLUMN */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-zinc-900/10 backdrop-blur-sm dark:bg-zinc-900/70 dark:ring-white/10"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="rounded-full px-3 py-1 text-xs ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:ring-white/10 dark:hover:bg-white/10">
                  <Icons.ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Top up balance</h2>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">$275 / 1,000 calls</div>
            </div>

            {/* Coin Selector */}
            <div className="mb-4 flex flex-wrap gap-2">
              {["Ethereum", "Solana", "Bitcoin", "USDC"].map((c) => (
                <motion.button
                  key={c}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setNetwork(c)}
                  className={
                    "rounded-full px-3 py-1 text-xs ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 " +
                    (network === c
                      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-400/40"
                      : "text-zinc-500 hover:bg-zinc-900/5 ring-zinc-900/10 dark:ring-white/10 dark:hover:bg-white/10")
                  }
                >
                  {c}
                </motion.button>
              ))}
            </div>

            <div className="mb-4 flex gap-6 border-b border-zinc-900/10 text-sm dark:border-white/10">
              <Tab id="address">Address</Tab>
              <Tab id="username">Username</Tab>
            </div>

            {activeTab === "address" ? (
              <div className="space-y-4">
                <SectionCard
                  loading={loadingCenter}
                  title={`Your ${network} address`}
                  footer={
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Use this address to top up your telecom balance.
                    </div>
                  }
                >
                  <AddressRow
                    label={network === "Bitcoin" ? "bc1q…1gwCof" : "0x6443…1gwCof"}
                    address={qrAddr}
                    onShowQr={() => setQrOpen(true)}
                    onCopy={() => copy(qrAddr)}
                  />

                  {/* Slider */}
                  <div className="mt-4 rounded-xl bg-zinc-900/5 p-3 dark:bg-white/5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Top-up amount (×1,000 calls)</span>
                      <span className="font-semibold">
                        {packs}k calls · ${(packs * 275).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPacks(Math.max(1, packs - 1))}
                        className="rounded-lg px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10"
                      >
                        –
                      </button>

                      <div className="relative h-3 flex-1 rounded-full bg-zinc-200/30 dark:bg-zinc-800">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-emerald-400/70"
                          style={{ width: `${pct}%` }}
                        />
                        <input
                          type="range"
                          min={1}
                          max={20}
                          value={packs}
                          onChange={(e) => setPacks(parseInt(e.target.value))}
                          className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent accent-emerald-500"
                        />
                        <div
                          className="pointer-events-none absolute -top-8"
                          style={{ left: `calc(${pct}% - 12px)` }}
                        >
                          <div className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                            {packs}k
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setPacks(Math.min(20, packs + 1))}
                        className="rounded-lg px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {[1, 2, 5, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => setPacks(n)}
                          className={
                            "rounded-full px-2.5 py-1 ring-1 ring-inset " +
                            (packs === n
                              ? "bg-emerald-500/20 text-emerald-400 ring-emerald-400/40"
                              : "text-zinc-500 hover:bg-zinc-900/5 ring-zinc-900/10 dark:ring-white/10 dark:hover:bg-white/10")
                          }
                        >
                          {n}k
                        </button>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard loading={loadingCenter} title="Other assets">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span
                      className="cursor-pointer rounded-md px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10"
                      onClick={() => setNetwork("USDC")}
                    >
                      USDC
                    </span>
                    <span
                      className="cursor-pointer rounded-md px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10"
                      onClick={() => setNetwork("Ethereum")}
                    >
                      USDT (ETH)
                    </span>
                    <span
                      className="cursor-pointer rounded-md px-2 py-1 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/5 dark:ring-white/10 dark:hover:bg-white/10"
                      onClick={() => setNetwork("Ethereum")}
                    >
                      DAI (ETH)
                    </span>
                  </div>
                </SectionCard>
              </div>
            ) : (
              <SectionCard loading={loadingCenter} title="Receive by username">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Share @yourname so people can top up without an address.
                </div>
              </SectionCard>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-zinc-900 p-6 text-zinc-100 shadow-lg ring-1 ring-white/10"
          >
            <div className="rounded-2xl border border-white/10 p-4">
              {loadingRight ? (
                <div className="animate-pulse">
                  <div className="mb-4 h-[300px] rounded-xl bg-zinc-800" />
                  <div className="h-10 rounded bg-zinc-800" />
                </div>
              ) : (
                <>
                  <div className="mb-4 grid place-items-center rounded-xl bg-zinc-800 p-4">
                    <div className="h-[280px] w-[280px] rounded-lg bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:14px_14px]" />
                  </div>
                  <div className="rounded-xl bg-zinc-800 p-3">
                    <div className="text-xs opacity-70">Your {network} address</div>
                    <div className="truncate text-sm font-mono">{qrAddr}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs opacity-70">
                      {network === "Bitcoin" ? "bc1q…1gwCof" : "0xbcc4…4432wgwCof"}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copy(qrAddr)}
                      className="rounded-xl bg-white/10 px-3 py-2 text-sm ring-1 ring-inset ring-white/20 hover:bg-white/20"
                    >
                      Copy
                    </motion.button>
                  </div>
                  <p className="mt-4 text-xs opacity-60">
                    Use this address for receiving top ups. Transactions may take a few minutes to
                    complete.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <QrModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        address={qrAddr}
        network={network}
      />
    </Container>
  );
}
