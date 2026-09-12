import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8', className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <path
        d="M8 20.5 14.2 9.8c.4-.7 1.4-.7 1.8 0L22 19.2"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.2 16.4 24 11.2"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  href = '/',
  compact,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('flex items-center gap-2.5 text-foreground no-underline', className)}
    >
      <Mark />
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Bet<span className="text-primary">Edge</span>
        </span>
      )}
    </Link>
  );
}
