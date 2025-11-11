import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/store';

export async function GET() {
  const replies = readJSON('replies.json', [] as any[]);
  return NextResponse.json(
    replies.filter((r: any) => r.dtmf === '1').sort((a: any, b: any) => b.ts - a.ts)
  );
}
