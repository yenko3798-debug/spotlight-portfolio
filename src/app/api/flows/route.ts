import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/store';

export async function GET() {
  const flows = readJSON('flows.json', [] as any[]);
  return NextResponse.json(flows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const flows = readJSON('flows.json', [] as any[]);
  const idx = flows.findIndex((f: any) => f.id === body.id);
  if (idx >= 0) flows[idx] = body; else flows.push(body);
  writeJSON('flows.json', flows);
  return NextResponse.json({ ok: true, id: body.id });
}
