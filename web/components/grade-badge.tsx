'use client';
import { cn } from '@/lib/utils';

interface GradeBadgeProps {
  grade: string;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
  className?: string;
}

const tone: Record<string, string> = {
  A: 'bg-yes/15 text-yes border-yes/25',
  B: 'bg-primary/10 text-primary border-primary/20',
  C: 'bg-warn/15 text-warn border-warn/25',
  D: 'bg-no/15 text-no border-no/20',
  F: 'bg-no/20 text-no border-no/30',
};

export function GradeBadge({
  grade,
  confidence,
  size = 'md',
  showConfidence = true,
  className,
}: GradeBadgeProps) {
  const g = (grade ?? 'C').toUpperCase();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-display font-semibold tabular',
        tone[g] ?? tone.C,
        size === 'sm' && 'px-1.5 py-0.5 text-xs',
        size === 'md' && 'px-2 py-1 text-sm',
        size === 'lg' && 'px-2.5 py-1.5 text-base',
        className,
      )}
    >
      {g}
      {showConfidence && confidence != null && (
        <span className="font-sans text-[10px] font-medium opacity-80">{confidence}%</span>
      )}
    </span>
  );
}
