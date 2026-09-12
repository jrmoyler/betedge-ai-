'use client';
import { useParlayStore } from '@/lib/parlay-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';

function formatAmerican(val: number) {
  if (!Number.isFinite(val)) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

function americanToDecimal(american: number): number {
  if (american > 0) return american / 100 + 1;
  return 100 / Math.abs(american) + 1;
}

function combinedAmerican(odds: number[]): number {
  if (!odds.length) return 0;
  const dec = odds.reduce((acc, o) => acc * americanToDecimal(o), 1);
  return dec >= 2 ? Math.round((dec - 1) * 100) : Math.round(-100 / (dec - 1));
}

export function BetSlip({ onClose }: { onClose?: () => void }) {
  const legs = useParlayStore((s) => s.legs);
  const remove = useParlayStore((s) => s.removeLeg);
  const clear = useParlayStore((s) => s.clear);
  const [stake, setStake] = useState('25');
  const odds = combinedAmerican(legs.map((l) => l.odds));
  const stakeNum = parseFloat(stake) || 0;
  const payout = legs.reduce((acc, l) => acc * americanToDecimal(l.odds), 1) * stakeNum;
  const kind = legs.length > 1 ? 'parlay' : 'straight';

  function submit() {
    if (!legs.length) return;
    toast.success('Ticket staged — open Parlay to save it to your tracker');
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">Slip</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {legs.length} {legs.length === 1 ? 'leg' : 'legs'} · {kind}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {legs.length > 0 && (
            <button
              type="button"
              className="px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={clear}
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="grid size-9 place-items-center text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Close slip"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        {legs.length === 0 ? (
          <div className="grid h-full place-items-center px-4 text-center">
            <div>
              <p className="font-display text-base font-semibold">Empty slip</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap a number on the board. Build a ticket the way a book would.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {legs.map((leg) => (
              <li
                key={leg.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border bg-secondary p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{leg.description}</p>
                  <p className="mt-1 font-mono text-xs tabular text-primary">
                    {formatAmerican(leg.odds)}
                    <span className="ml-2 uppercase tracking-wider text-faint">{leg.sport}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="grid size-8 shrink-0 place-items-center text-muted-foreground hover:text-foreground"
                  onClick={() => remove(leg.id)}
                  aria-label="Remove leg"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="border-t border-border p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <label className="flex-1">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Stake
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                min={1}
                step={1}
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="pl-7 font-mono tabular"
              />
            </div>
          </label>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">To win</p>
            <p className="font-display text-lg font-semibold tabular text-primary">
              ${Math.max(0, payout - stakeNum).toFixed(2)}
            </p>
            <p className="font-mono text-xs tabular text-muted-foreground">
              {formatAmerican(odds)}
            </p>
          </div>
        </div>
        <Button className="w-full" disabled={!legs.length} onClick={submit}>
          Place ticket
        </Button>
        <Link
          href="/parlay-builder"
          className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Open full parlay builder
        </Link>
      </footer>
    </div>
  );
}
