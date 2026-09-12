'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { SportFilter } from '@/components/sport-filter';
import { PickCard } from '@/components/pick-card';
import { LockedPicksNotice } from '@/components/locked-picks-notice';
import { PickCardSkeleton } from '@/components/loading-skeleton';
import type { SportKey } from '@/lib/sports-config';
import { useRouter } from 'next/navigation';
import { addPickToParlay, savePickToTracker } from '@/lib/pick-actions';
import { useOnboarding } from '@/lib/onboarding-store';
import { useMounted } from '@/components/client-only';
import Link from 'next/link';

interface PickData {
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
}

export function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sport, setSport] = useState<SportKey | 'all'>('all');
  const [picks, setPicks] = useState<PickData[]>([]);
  const [totalPicks, setTotalPicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();
  const onboardingDone = useOnboarding((s) => s.done);

  const tier = session?.user?.subscriptionTier ?? 'FREE';

  useEffect(() => {
    async function loadPicks() {
      setLoading(true);
      try {
        const params = sport !== 'all' ? `?sport=${sport}` : '';
        const res = await fetch(`/api/dashboard/picks${params}`);
        const data = await res.json().catch(() => ({}));
        setPicks(data?.picks ?? []);
        setTotalPicks(data?.total ?? data?.picks?.length ?? 0);
      } catch {
        setPicks([]);
        setTotalPicks(0);
      } finally {
        setLoading(false);
      }
    }
    loadPicks();
  }, [sport]);

  const aGrades = (picks ?? []).filter((p: PickData) => p?.grade === 'A').length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Today's desk
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Graded tickets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-graded numbers, refreshed through the window. Tap any ticket for the packet.
          </p>
        </div>

        {mounted && !onboardingDone && (
          <Link
            href="/onboarding"
            className="mb-6 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm"
          >
            <span>Finish onboarding to set a unit and the sports you follow.</span>
            <span className="font-semibold text-primary">Open</span>
          </Link>
        )}

        <SportFilter selected={sport} onSelect={setSport} className="mb-6" />

        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { k: "Today's picks", v: String(totalPicks || (picks?.length ?? 0)) },
            { k: 'A-grade', v: String(aGrades) },
            { k: 'Locked', v: tier === 'FREE' ? String(Math.max(0, totalPicks - picks.length)) : '∞' },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{s.k}</p>
              <p className="mt-1 font-display text-xl font-semibold tabular text-foreground">{s.v}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_: unknown, i: number) => (
              <PickCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(picks ?? []).map((pick: PickData, i: number) => (
              <PickCard
                key={pick?.id ?? i}
                id={pick?.id ?? ''}
                playerName={pick?.playerName ?? 'Unknown'}
                team={pick?.team ?? ''}
                sport={pick?.sport ?? 'nfl'}
                statType={pick?.statType ?? ''}
                line={pick?.line ?? 0}
                odds={pick?.odds ?? 0}
                grade={pick?.grade ?? 'C'}
                confidence={pick?.confidence ?? 0}
                recommendation={pick?.recommendation ?? 'N/A'}
                edgeSummary={pick?.edgeSummary ?? ''}
                onSave={() => savePickToTracker(pick)}
                onAddParlay={() => addPickToParlay(pick)}
                onClick={() => router.push(`/props/${pick?.id ?? ''}`)}
              />
            ))}
            <LockedPicksNotice hidden={totalPicks - picks.length} />
          </div>
        )}

        {(picks ?? []).length === 0 && !loading && (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <h3 className="font-display text-lg font-semibold">No tickets graded yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back later — the desk refreshes throughout the day.
            </p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
