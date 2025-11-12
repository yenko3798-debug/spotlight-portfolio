import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';

const styles = cva(
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none ring-1',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-400 text-slate-900 ring-emerald-300 hover:bg-emerald-300 active:bg-emerald-400',
        secondary:'bg-slate-900/70 text-slate-100 ring-slate-700 hover:bg-slate-800',
        ghost: 'bg-transparent text-emerald-300 ring-transparent hover:bg-emerald-300/10',
      },
      size: { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2', lg: 'px-5 py-3 text-base' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

type Props = VariantProps<typeof styles> & React.ComponentProps<'button'> & { href?: string };

export default function Button({ variant, size, className, href, ...props }: Props) {
  const cn = clsx(styles({ variant, size }), className);
  if (href) return (
    <Link href={href} className={cn}>{props.children}</Link>
  );
  return (
    <motion.button whileTap={{ scale: 0.98 }} className={cn} {...props} />
  );
}
