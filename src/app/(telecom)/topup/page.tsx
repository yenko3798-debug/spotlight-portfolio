'use client';
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Shell from '@/components/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';

export default function Page() {
  const [amount, setAmount] = useState('50');
  const [network, setNetwork] = useState<'BTC'|'ETH'|'USDT-TRON'>('BTC');

  const addressByNet = {
    BTC:  'bc1qexampleaddressxxxxxxxxxxxxxxxxxxxx',
    ETH:  '0xEeeeeExampleAddress0000000000000000',
    'USDT-TRON': 'TExampleTronAddressxxxxxxxxxxx'
  } as const;

  const address = addressByNet[network];
  const uri = network === 'BTC'
    ? `bitcoin:${address}?amount=${amount}`
    : network === 'ETH'
    ? `ethereum:${address}?value=${amount}`
    : `${address}`;

  return (
    <Shell title="Wallet top-up" actions={<a href="/replies" className="text-emerald-300 underline">View Replies</a>}>
      <Card>
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/30 bg-black/60 p-4 shadow-lg shadow-emerald-500/10">
              <QRCodeSVG value={uri} size={180} />
            </div>
            <div className="flex gap-2">
              {(['BTC','ETH','USDT-TRON'] as const).map(n=>(
                <Button key={n} variant={network===n?'primary':'soft'} onClick={()=>setNetwork(n)}>{n}</Button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-300">Send to address</div>
            <div className="font-mono text-slate-100 break-all">{address}</div>
            <div className="mt-4 grid max-w-sm grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <Label>Amount</Label>
                <Input value={amount} onChange={(e)=>setAmount(e.target.value)} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label>Memo / Note (optional)</Label>
                <Input placeholder="Invoice #1234"/>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button onClick={()=>navigator.clipboard.writeText(address)}>Copy address</Button>
              <Button variant="ghost" onClick={()=>navigator.clipboard.writeText(uri)}>Copy payment URI</Button>
            </div>
            <p className="mt-4 text-xs text-slate-500">Non-custodial demo. Hook your blockchain listener to credit balances after confirmations.</p>
          </div>
        </div>
      </Card>
    </Shell>
  );
}
