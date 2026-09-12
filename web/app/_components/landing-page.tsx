'use client';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Shield,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { GradeBadge } from '@/components/grade-badge';
import { TeamMark } from '@/components/team-mark';
import { MOCK_PROPS, getMockGames, MOCK_ODDS } from '@/lib/mock-data';

const MARKETS = [
  { title: 'Chiefs win Super Bowl', yes: 0.31, vol: '$4.2M' },
  { title: 'Ohtani 50 home runs', yes: 0.64, vol: '$1.1M' },
  { title: 'Celtics NBA title', yes: 0.22, vol: '$2.8M' },
];

function formatOdds(n: number) {
  return n > 0 ? `+${n}` : `${n}`;
}

export function LandingPage() {
  const samplePicks = (MOCK_PROPS ?? []).slice(0, 3);
  const featured = getMockGames()[0];
  const featuredOdds = MOCK_ODDS[featured?.id ?? ''] ?? MOCK_ODDS.default;
  const dk = featuredOdds?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <section className="relative overflow-hidden">
        <div className="desk-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 pb-24 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pb-16 md:pt-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="live-dot" />
              Live board · 12 books · 62.4% 30-day hit
            </p>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              The research desk
              <span className="block text-primary">for people who bet.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Compare the market. Inspect the evidence. Size the edge. BetEdge grades
              every number the way a trading desk would — then shows you the books still
              sleeping on it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-12 px-6 text-base">
                <Link href="/onboarding">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-6 text-base">
                <Link href="/games">Browse the board</Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                { k: 'Graded today', v: '48' },
                { k: '30-day hit', v: '62.4%' },
                { k: 'Avg edge', v: '4.1%' },
                { k: '24h volume', v: '$18.4M' },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{s.k}</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="hidden space-y-3 md:block">
            {featured && dk && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-live">
                    <span className="live-dot" /> Featured
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {featured.sport} · {featured.venue}
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: featured.awayTeam, odds: dk.moneyline.away, spread: dk.spread.away },
                    { name: featured.homeTeam, odds: dk.moneyline.home, spread: dk.spread.home },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center gap-3">
                      <TeamMark name={row.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold">{row.name}</p>
                        <p className="font-mono text-xs tabular text-muted-foreground">
                          {row.spread > 0 ? '+' : ''}{row.spread}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular text-primary">
                        {formatOdds(row.odds)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {samplePicks[0] && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Top ticket
                    </p>
                    <p className="font-display text-sm font-semibold leading-tight">
                      {samplePicks[0].playerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {samplePicks[0].recommendation} {samplePicks[0].line} · {samplePicks[0].statType}
                    </p>
                  </div>
                  <GradeBadge grade={samplePicks[0].grade} confidence={samplePicks[0].confidence} size="sm" />
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tonight's desk</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">Highest-conviction tickets</h2>
          </div>
          <Link href="/props" className="text-sm text-muted-foreground hover:text-foreground">
            All research
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {samplePicks.map((p) => (
            <Link
              key={p.id}
              href={`/props/${p.id}`}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex items-center justify-between">
                <GradeBadge grade={p.grade} confidence={p.confidence} />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {p.recommendation} {p.line}
                </span>
              </div>
              <p className="font-display text-lg font-semibold leading-tight">{p.playerName}</p>
              <p className="text-sm text-muted-foreground">
                {p.statType} · {p.team}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.edgeSummary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Exchange</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Markets, not just spreads.
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Binary contracts with a live probability and the same research packet as a Sunday
              prop. FanDuel speed. Polymarket clarity.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {MARKETS.map((m) => (
              <div key={m.title} className="rounded-xl border border-border bg-background p-4">
                <p className="font-display text-base font-semibold leading-tight">{m.title}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Yes</p>
                    <p className="font-display text-2xl font-semibold tabular text-yes">
                      {Math.round(m.yes * 100)}¢
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.vol} vol</p>
                </div>
                <div className="prob-track mt-3">
                  <div
                    className="h-full rounded-full bg-yes"
                    style={{ width: `${m.yes * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 font-display text-3xl font-semibold tracking-tight">
          Built like a desk. Used like a book.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: 'Grade the number',
              body: 'Every market gets an A–F with a confidence band, key factors, and the risks that would kill the ticket.',
            },
            {
              icon: Layers,
              title: 'Shop the street',
              body: 'One tap compares FanDuel, DraftKings, BetMGM, Caesars — and the prediction venues — so you never leave cents on the table.',
            },
            {
              icon: Shield,
              title: 'Size with a unit',
              body: 'Onboarding sets a bankroll and a unit. The slip refuses to let you steam without seeing the price.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6">
              <f.icon className="mb-4 size-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-16" id="pricing">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold tracking-tight">
            Three seats. One board.
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '$0',
                note: 'forever',
                items: ['5 graded picks / day', '5 prop views', '2-leg parlays', 'Street odds on one book'],
              },
              {
                name: 'Pro',
                price: '$9.99',
                note: '/month · 7-day trial',
                popular: true,
                items: ['Unlimited research', '5-book shop', 'Unlimited parlays', 'Line alerts (3)', 'ROI tracker'],
              },
              {
                name: 'Elite',
                price: '$19.99',
                note: '/month',
                items: ['10+ books', 'Unlimited alerts', 'Early desk (2 hr)', 'Backtest tape', 'Priority refresh'],
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border bg-card p-6 ${p.popular ? 'border-primary/40' : 'border-border'}`}
              >
                {p.popular && (
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Most used
                  </p>
                )}
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 font-display text-3xl font-semibold tabular">
                  {p.price}
                  <span className="ml-1 text-sm font-sans font-medium text-muted-foreground">{p.note}</span>
                </p>
                <ul className="mt-5 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="size-4 text-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={p.popular ? 'default' : 'outline'} asChild>
                  <Link href="/onboarding">Take this seat</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
