'use client';
import { cn } from '@/lib/utils';
import { GradeBadge } from './grade-badge';
import { SPORTS, type SportKey } from '@/lib/sports-config';
import { Bookmark, Plus } from 'lucide-react';

interface PickCardProps {
  id: string;
  playerName: string;
  team: string;
  sport: SportKey;
  statType: string;
  line: number;
  odds: number;
  grade: string;
  confidence: number;
  recommendation: string;
  edgeSummary: string;
  blurred?: boolean;
  onSave?: () => void;
  onAddParlay?: () => void;
  onClick?: () => void;
}

function formatOdds(val: number) {
  if (!Number.isFinite(val)) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

export function PickCard({
  playerName,
  team,
  sport,
  statType,
  line,
  odds,
  grade,
  confidence,
  recommendation,
  edgeSummary,
  blurred = false,
  onSave,
  onAddParlay,
  onClick,
}: PickCardProps) {
  const sportConfig = SPORTS[sport];
  const isOver = recommendation?.toLowerCase()?.includes('over');

  return (
    <article
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30',
        blurred && 'paywall-blur',
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-base font-semibold leading-tight">
              {playerName ?? 'Unknown'}
            </p>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {team ?? ''}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sportConfig?.shortName} · {statType}
          </p>
        </div>
        <GradeBadge grade={grade} confidence={confidence} size="sm" />
      </div>

      <div className="mb-3 grid grid-cols-3 gap-1.5">
        <div className="rounded-md border border-border bg-secondary px-2 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Line</p>
          <p className="font-mono text-sm font-semibold tabular">{line ?? 0}</p>
        </div>
        <div className="rounded-md border border-border bg-secondary px-2 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Best</p>
          <p className={cn('font-mono text-sm font-semibold tabular', (odds ?? 0) > 0 ? 'text-yes' : 'text-foreground')}>
            {formatOdds(odds ?? 0)}
          </p>
        </div>
        <div
          className={cn(
            'rounded-md border px-2 py-2 text-center',
            isOver ? 'border-yes/30 bg-yes/10 text-yes' : 'border-no/30 bg-no/10 text-no',
          )}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">Rec</p>
          <p className="text-xs font-semibold uppercase">{recommendation ?? 'N/A'}</p>
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {edgeSummary ?? ''}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSave?.();
          }}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-secondary px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Bookmark className="h-3 w-3" /> Save
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onAddParlay?.();
          }}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-secondary px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3 w-3" /> Add to slip
        </button>
      </div>
    </article>
  );
}
