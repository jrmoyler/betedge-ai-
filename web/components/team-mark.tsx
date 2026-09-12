import { cn } from '@/lib/utils';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

export function teamAbbr(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1] ?? name;
  if (last.length <= 3) return last.toUpperCase();
  return initials(name);
}

export function TeamMark({
  name,
  abbr,
  size = 'md',
}: {
  name: string;
  abbr?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-md border border-border bg-secondary font-display font-semibold tracking-tight text-foreground',
        size === 'sm' && 'size-8 text-[10px]',
        size === 'md' && 'size-10 text-xs',
        size === 'lg' && 'size-14 text-sm',
      )}
      title={name}
    >
      {(abbr ?? teamAbbr(name)).slice(0, 3)}
    </span>
  );
}
