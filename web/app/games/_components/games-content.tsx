'use client';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SportFilter } from '@/components/sport-filter';
import { GameCardSkeleton } from '@/components/loading-skeleton';
import { TeamMark } from '@/components/team-mark';
import { type SportKey } from '@/lib/sports-config';
import { MOCK_ODDS, type MockOdds } from '@/lib/mock-data';
import { useParlayStore } from '@/lib/parlay-store';
import { toast } from 'sonner';
import Link from 'next/link';
import { SafeTime } from '@/components/safe-format';
import { cn } from '@/lib/utils';

interface GameData {
  id: string;
  sport: SportKey;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  startTime: string;
  status: string;
  venue: string;
}

function formatOdds(val: number | undefined) {
  if (val == null) return '—';
  return val > 0 ? `+${val}` : `${val}`;
}

function OddsCell({
  caption,
  line,
  odds,
  selected,
  onClick,
}: {
  caption: string;
  line?: string;
  odds: number | undefined;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-selected={selected}
      className="odds-btn min-w-0 flex-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {caption}
      </span>
      {line && <span className="text-[11px] font-medium text-foreground/80">{line}</span>}
      <span
        className={cn(
          'font-mono text-sm font-semibold tabular',
          (odds ?? 0) > 0 ? 'text-yes' : 'text-foreground',
        )}
      >
        {formatOdds(odds)}
      </span>
    </button>
  );
}

export function GamesContent() {
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const addLeg = useParlayStore((s) => s.addLeg);
  const removeLeg = useParlayStore((s) => s.removeLeg);
  const legs = useParlayStore((s) => s.legs);

  function toggle(id: string, description: string, odds: number, sportKey: string) {
    if (legs.some((l) => l.id === id)) {
      removeLeg(id);
      return;
    }
    const added = addLeg({ id, description, odds, sport: sportKey });
    toast[added ? 'success' : 'info'](added ? 'Added to slip' : 'Already on the slip');
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = sport !== 'all' ? `?sport=${sport}` : '';
        const res = await fetch(`/api/sports/games${params}`);
        const data = await res.json().catch(() => ({}));
        setGames(data?.games ?? []);
      } catch {
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sport]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sportsbook
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Today's board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a number to load the slip. Open a game for the full street and the research packet.
          </p>
        </div>

        <SportFilter selected={sport} onSelect={setSport} className="mb-6" />

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(games ?? []).map((game: GameData) => {
              const gameTime = game?.startTime ? new Date(game.startTime) : null;
              const books: MockOdds[] = MOCK_ODDS[game?.id ?? ''] ?? MOCK_ODDS.default ?? [];
              const book = books[0];
              const live = (game?.status ?? '').toLowerCase() === 'live' || game.homeScore != null;
              return (
                <article
                  key={game.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {game.sport}
                      </span>
                      {live && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-live">
                          <span className="live-dot" /> Live
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {gameTime ? (
                        <SafeTime
                          date={gameTime}
                          localize
                          options={{ hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }}
                        />
                      ) : (
                        'TBD'
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                    <Link href={`/games/${game.id}`} className="space-y-3">
                      {[
                        { name: game.awayTeam, score: game.awayScore },
                        { name: game.homeTeam, score: game.homeScore },
                      ].map((row) => (
                        <div key={row.name} className="flex items-center gap-3">
                          <TeamMark name={row.name} />
                          <p className="min-w-0 flex-1 truncate font-display text-base font-semibold">
                            {row.name}
                          </p>
                          {row.score != null && (
                            <span className="font-display text-xl font-semibold tabular">{row.score}</span>
                          )}
                        </div>
                      ))}
                      <p className="text-xs text-faint">{game.venue}</p>
                    </Link>

                    {book && (
                      <div className="grid grid-cols-3 gap-1.5 lg:w-[22rem]">
                        <OddsCell
                          caption={game.awayTeam.split(' ').pop() ?? 'Away'}
                          line={book.spread.away > 0 ? `+${book.spread.away}` : `${book.spread.away}`}
                          odds={book.spread.awayOdds}
                          selected={legs.some((l) => l.id === `${game.id}-spread-away`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-spread-away`,
                              `${game.awayTeam} ${book.spread.away > 0 ? '+' : ''}${book.spread.away}`,
                              book.spread.awayOdds,
                              game.sport,
                            )
                          }
                        />
                        <OddsCell
                          caption="ML"
                          odds={book.moneyline.away}
                          selected={legs.some((l) => l.id === `${game.id}-ml-away`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-ml-away`,
                              `${game.awayTeam} ML`,
                              book.moneyline.away,
                              game.sport,
                            )
                          }
                        />
                        <OddsCell
                          caption="Over"
                          line={`${book.total.line}`}
                          odds={book.total.over}
                          selected={legs.some((l) => l.id === `${game.id}-over`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-over`,
                              `${game.awayTeam} / ${game.homeTeam} O ${book.total.line}`,
                              book.total.over,
                              game.sport,
                            )
                          }
                        />
                        <OddsCell
                          caption={game.homeTeam.split(' ').pop() ?? 'Home'}
                          line={book.spread.home > 0 ? `+${book.spread.home}` : `${book.spread.home}`}
                          odds={book.spread.homeOdds}
                          selected={legs.some((l) => l.id === `${game.id}-spread-home`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-spread-home`,
                              `${game.homeTeam} ${book.spread.home > 0 ? '+' : ''}${book.spread.home}`,
                              book.spread.homeOdds,
                              game.sport,
                            )
                          }
                        />
                        <OddsCell
                          caption="ML"
                          odds={book.moneyline.home}
                          selected={legs.some((l) => l.id === `${game.id}-ml-home`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-ml-home`,
                              `${game.homeTeam} ML`,
                              book.moneyline.home,
                              game.sport,
                            )
                          }
                        />
                        <OddsCell
                          caption="Under"
                          line={`${book.total.line}`}
                          odds={book.total.under}
                          selected={legs.some((l) => l.id === `${game.id}-under`)}
                          onClick={() =>
                            toggle(
                              `${game.id}-under`,
                              `${game.awayTeam} / ${game.homeTeam} U ${book.total.line}`,
                              book.total.under,
                              game.sport,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {(games ?? []).length === 0 && !loading && (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <h3 className="font-display text-lg font-semibold">No games on the board</h3>
            <p className="mt-1 text-sm text-muted-foreground">Check back on game days.</p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
