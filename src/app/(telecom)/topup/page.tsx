'use client';
import QRCode from 'qrcode.react';
import React, { useState } from 'react';
export default function Page() {
  const [amount, setAmount] = useState('50');
  const address = 'bc1qexampleaddressxxxxxxxxxxxxxxxxxxxx'; // replace
  const uri = `bitcoin:${address}?amount=${amount}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(16,185,129,.12),transparent),radial-gradient(1200px_600px_at_100%_100%,rgba(6,182,212,.12),transparent)]">
      <div className="mx-auto w-full max-w-4xl p-6">
        <div className="rounded-3xl border border-emerald-400/25 bg-slate-950/80 p-6 shadow-xl shadow-emerald-500/10 backdrop-blur">
          <h1 className="text-2xl font-bold text-slate-50">Top up balance</h1>
          <p className="mt-1 text-slate-400">Scan and pay from your wallet. We’ll credit after confirmation.</p>
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <QRCode value={uri} size={180} />
            <div>
              <div className="text-sm text-slate-300">Send to address</div>
              <div className="font-mono text-slate-100 break-all">{address}</div>
              <div className="mt-3">
                <label className="mr-2 text-sm text-slate-300">Amount</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
              </div>
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500">* Non-custodial demo screen. Connect to your listener / webhook to confirm txs.</div>
        </div>
      </div>
    </div>
  );
}
