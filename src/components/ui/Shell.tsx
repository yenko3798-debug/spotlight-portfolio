'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Container } from '@/components/Container';
import Button from './Button';

export default function Shell({
  title, subtitle, cta, children,
}: { title: string; subtitle?: string; cta?: { href: string; label: string }; children: ReactNode }) {
  return (
    <div className="relative">
      {/* luxe gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <Container className="mt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold tracking-tight text-slate-50"
            >
              {title}
            </motion.h1>
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {cta && <Button href={cta.href}>{cta.label}</Button>}
        </div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {children}
        </motion.div>
      </Container>
    </div>
  );
}
