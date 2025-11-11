import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/store';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const users = readJSON('users.json', [] as any[]);
  const user = users.find((u: any) => u.email === email);
  if (!user) return NextResponse.json({ ok: false, error: 'Invalid credentials' });
  const tryHash = crypto.createHash('sha256').update(password + user.salt).digest('hex');
  if (tryHash !== user.hash) return NextResponse.json({ ok: false, error: 'Invalid credentials' });
  // Demo only: return ok; in production, set a secure cookie/session.
  return NextResponse.json({ ok: true });
}
