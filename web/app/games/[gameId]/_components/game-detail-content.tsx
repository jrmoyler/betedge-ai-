'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { OddsTable } from '@/components/odds-table';
import { GradeBadge } from '@/components/grade-badge';
import { TeamMark } from '@/components/team-mark';
import { LockedPicksNotice } from '@/components/locked-picks-notice';
import { PickCardSkeleton } from '@/components/loading-skeleton';
import { getTierLimits } from '@/lib/tier-limits';
import { useParlayStore } from '@/lib/parlay-store';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { SafeDate } from '@/components/safe-format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface GameDetailContentProps {
  gameId: string;
}

function formatOdds(val: number | undefined) {
  if (val == null) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

export function GameDetailContent({ gameId }: GameDetailContentProps) {
  const { data: session } = useSession();
  const tier = session?.user?.subscriptionTier ?? 'FREE';
  const limits = getTierLimits(tier);
  const addLeg = useParlayStore((s) => s.addLeg);
  const removeLeg = useParlayStore((s) => s.removeLeg);
  const legs = useParlayStore((s) => s.legs);

  const [game, setGame] = useState<any>(null);
  const [odds, setOdds] = useState<any[]>([]);
  const [props, setProps] = useState<any[]>([]);
  const [totalProps, setTotalProps] = useState(0);
  const [loading, setLoading] = useState(true);

  function toggle(id: string, description: string, american: number, sport: string) {
    if (legs.some((l) => l.id === id)) {
      removeLeg(id);
      return;
    }
    const added = addLeg({ id, description, odds: american, sport });
    toast[added ? 'success' : 'info'](added ? 'Added to slip' : 'Already on the slip');
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [gamesRes, oddsRes, propsRes] = await Promise.all([
          fetch(`/api/sports/games?gameId=${gameId}`),
          fetch(`/api/sports/odds?gameId=${gameId}`),
          fetch(`/api/sports/props?gameId=${gameId}`),
        ]);
        const gamesData = await gamesRes.json().catch(() => ({}));
        const oddsData = await oddsRes.json().catch(() => ({}));
        const propsData = await propsRes.json().catch(() => ({}));
        setGame(gamesData?.game ?? gamesData?.games?.[0] ?? null);
        setOdds(oddsData?.odds ?? []);
        setProps(propsData?.props ?? []);
        setTotalProps(propsData?.total ?? propsData?.props?.length ?? 0);
      } catch {
        // keep empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gameId]);

  const book = odds?.[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Link
          href="/games"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        {loading ? (
          <div className="space-y-4">
            <PickCardSkeleton />
            <PickCardSkeleton />
          </div>
        ) : game ? (
          <>
            <div className="mb-6 rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {game?.startTime ? (
                  <SafeDate
                    date={new Date(game.startTime)}
                    localize
                    options={{
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    }}
                  />
                ) : (
                  <span>TBD</span>
                )}
                {game?.venue && (
                  <>
                    <span>·</span>
                    <MapPin className="h-3 w-3" />
                    <span>{game.venue}</span>
                  </>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { name: game.awayTeam ?? 'Away', key: 'away' },
                  { name: game.homeTeam ?? 'Home', key: 'home' },
                ].map((row) => (
                  <div key={row.key} className="flex items-center gap-4">
                    <TeamMark name={row.name} size="lg" />
                    <p className="font-display text-2xl font-semibold leading-tight">{row.name}</p>
                  </div>
                ))}
              </div>

              {book && (
                <div className="mt-6 grid grid-cols-3 gap-1.5">
                  {[
                    {
                      id: `${gameId}-spread-away`,
                      cap: 'Spread',
                      line: book.spread ? `${book.spread.away > 0 ? '+' : ''}${book.spread.away}` : undefined,
                      odds: book.spread?.awayOdds,
                      desc: `${game.awayTeam} spread`,
                    },
                    {
                      id: `${gameId}-ml-away`,
                      cap: 'ML',
                      odds: book.moneyline?.away,
                      desc: `${game.awayTeam} ML`,
                    },
                    {
                      id: `${gameId}-over`,
                      cap: 'Over',
                      line: book.total ? `${book.total.line}` : undefined,
                      odds: book.total?.over,
                      desc: `Over ${book.total?.line}`,
                    },
                    {
                      id: `${gameId}-spread-home`,
                      cap: 'Spread',
                      line: book.spread ? `${book.spread.home > 0 ? '+' : ''}${book.spread.home}` : undefined,
                      odds: book.spread?.homeOdds,
                      desc: `${game.homeTeam} spread`,
                    },
                    {
                      id: `${gameId}-ml-home`,
                      cap: 'ML',
                      odds: book.moneyline?.home,
                      desc: `${game.homeTeam} ML`,
                    },
                    {
                      id: `${gameId}-under`,
                      cap: 'Under',
                      line: book.total ? `${book.total.line}` : undefined,
                      odds: book.total?.under,
                      desc: `Under ${book.total?.line}`,
                    },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      data-selected={legs.some((l) => l.id === c.id)}
                      className="odds-btn"
                      onClick={() => toggle(c.id, c.desc, c.odds ?? -110, game.sport ?? 'nfl')}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.cap}</span>
                      {c.line && <span className="text-xs">{c.line}</span>}
                      <span
                        className={cn(
                          'font-mono text-sm font-semibold tabular',
                          (c.odds ?? 0) > 0 ? 'text-yes' : 'text-foreground',
                        )}
                      >
                        {formatOdds(c.odds)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6 rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 font-display text-lg font-semibold">Street</h2>
              <OddsTable
                odds={odds}
                homeTeam={game?.homeTeam ?? 'Home'}
                awayTeam={game?.awayTeam ?? 'Away'}
                maxBooks={limits.maxBooks}
              />
              {odds.length > limits.maxBooks && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Showing {limits.maxBooks} of {odds.length} books.{' '}
                  <Link href="/upgrade" className="text-primary hover:underline">
                    Upgrade
                  </Link>{' '}
                  to compare them all.
                </p>
              )}
            </div>

            {(props ?? []).length > 0 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 font-display text-lg font-semibold">Player props</h2>
                <div className="space-y-2">
                  {(props ?? []).map((prop: any, i: number) => (
                    <Link key={prop?.id ?? i} href={`/props/${prop?.id ?? ''}`}>
                      <div className="flex items-center justify-between rounded-lg bg-secondary/60 p-3 hover:bg-secondary">
                        <div className="flex items-center gap-3">
                          <GradeBadge grade={prop?.grade ?? 'C'} confidence={prop?.confidence} size="sm" />
                          <div>
                            <div className="text-sm font-medium">{prop?.playerName ?? 'Player'}</div>
                            <div className="text-xs text-muted-foreground">
                              {prop?.statType ?? ''} — {prop?.line ?? 0}
                            </div>
                          </div>
                        </div>
                        <span
                          className={
                            prop?.recommendation?.includes('OVER')
                              ? 'text-xs font-bold text-yes'
                              : prop?.recommendation?.includes('UNDER')
                                ? 'text-xs font-bold text-no'
                                : 'text-xs font-bold text-muted-foreground'
                          }
                        >
                          {prop?.recommendation ?? ''}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <LockedPicksNotice hidden={totalProps - props.length} noun="prop" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <h3 className="font-display text-lg font-semibold">Game not found</h3>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
