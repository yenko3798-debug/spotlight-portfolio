import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/store';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ ok: false, error: 'Missing fields' });

  const users = readJSON('users.json', [] as any[]);
  if (users.find((u: any) => u.email === email))
    return NextResponse.json({ ok: false, error: 'Email exists' });

  const salt = crypto.randomBytes(12).toString('hex');
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
  users.push({ email, salt, hash, createdAt: Date.now() });
  writeJSON('users.json', users);
  return NextResponse.json({ ok: true });
}
