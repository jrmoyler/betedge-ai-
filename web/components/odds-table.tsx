'use client';
import { cn } from '@/lib/utils';

interface OddsRow {
  bookmaker: string;
  spread?: { home: number; away: number; homeOdds: number; awayOdds: number };
  moneyline?: { home: number; away: number };
  total?: { over: number; under: number; line: number };
}

interface OddsTableProps {
  odds: OddsRow[];
  homeTeam: string;
  awayTeam: string;
  maxBooks?: number;
  className?: string;
}

function formatOdds(val: number | undefined): string {
  if (val == null) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

function isBest(values: (number | undefined)[], idx: number, preferHigher: boolean): boolean {
  const filtered = values.filter((v: number | undefined): v is number => v != null);
  if (filtered.length === 0) return false;
  const target = preferHigher ? Math.max(...filtered) : Math.min(...filtered);
  return values[idx] === target;
}

export function OddsTable({ odds, homeTeam, awayTeam, maxBooks, className }: OddsTableProps) {
  const displayOdds = maxBooks ? (odds ?? []).slice(0, maxBooks) : (odds ?? []);
  const awayShort = awayTeam?.split(' ')?.pop() ?? 'Away';
  const homeShort = homeTeam?.split(' ')?.pop() ?? 'Home';

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Book</th>
            <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" colSpan={2}>Spread</th>
            <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" colSpan={2}>Moneyline</th>
            <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" colSpan={2}>Total</th>
          </tr>
          <tr className="border-b border-border/60">
            <th className="px-3 py-1" />
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">{awayShort}</th>
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">{homeShort}</th>
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">{awayShort}</th>
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">{homeShort}</th>
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">Over</th>
            <th className="px-2 py-1 text-center text-xs text-muted-foreground">Under</th>
          </tr>
        </thead>
        <tbody>
          {displayOdds.map((row: OddsRow, i: number) => (
            <tr key={row?.bookmaker ?? i} className="border-b border-border/40 hover:bg-secondary/60">
              <td className="px-3 py-2.5 font-medium">{row?.bookmaker ?? 'Unknown'}</td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.spread?.awayOdds), i, true) && 'font-semibold text-primary'
              )}>
                {row?.spread ? `${row.spread.away > 0 ? '+' : ''}${row.spread.away} (${formatOdds(row.spread.awayOdds)})` : '—'}
              </td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.spread?.homeOdds), i, true) && 'font-semibold text-primary'
              )}>
                {row?.spread ? `${row.spread.home > 0 ? '+' : ''}${row.spread.home} (${formatOdds(row.spread.homeOdds)})` : '—'}
              </td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.moneyline?.away), i, true) && 'font-semibold text-primary'
              )}>
                {formatOdds(row?.moneyline?.away)}
              </td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.moneyline?.home), i, true) && 'font-semibold text-primary'
              )}>
                {formatOdds(row?.moneyline?.home)}
              </td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.total?.over), i, true) && 'font-semibold text-primary'
              )}>
                {row?.total ? `${row.total.line} (${formatOdds(row.total.over)})` : '—'}
              </td>
              <td className={cn('px-2 py-2.5 text-center font-mono text-sm tabular',
                isBest(displayOdds.map((o) => o?.total?.under), i, true) && 'font-semibold text-primary'
              )}>
                {row?.total ? formatOdds(row.total.under) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
