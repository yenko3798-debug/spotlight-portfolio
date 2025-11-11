import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/store';

export async function POST(req: Request) {
  const body = await req.json(); // { campaignId, from, dtmf, line }
  const replies = readJSON('replies.json', [] as any[]);
  replies.push({ ...body, ts: Date.now() });
  writeJSON('replies.json', replies);
  return NextResponse.json({ ok: true });
}
