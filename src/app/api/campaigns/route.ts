import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/store';

export async function GET() {
  return NextResponse.json(readJSON('campaigns.json', [] as any[]));
}

export async function POST(req: Request) {
  const body = await req.json();
  const campaigns = readJSON('campaigns.json', [] as any[]);
  const id = Date.now().toString();
  campaigns.push({ id, ...body, ts: Date.now(), status: 'created' });
  writeJSON('campaigns.json', campaigns);
  return NextResponse.json({ ok: true, id });
}
