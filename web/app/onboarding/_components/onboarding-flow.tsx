'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { useOnboarding, type Experience } from '@/lib/onboarding-store';
import { SPORT_KEYS, type SportKey } from '@/lib/sports-config';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const EXP: { id: Experience; title: string; body: string }[] = [
  { id: 'casual', title: 'Casual', body: 'Weekend tickets, parlays, the fun of a number.' },
  { id: 'sharp', title: 'Sharp', body: 'I shop lines, track CLV, and think in units.' },
  { id: 'research', title: 'Research', body: 'I want the packet, the tape, and the grade.' },
];

function money(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function OnboardingFlow() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const ob = useOnboarding();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const total = 5;

  function finish() {
    if (!ob.ageConfirmed || !ob.sports.length || !ob.experience || !ob.responsible) {
      toast.error('Finish every step to open the desk');
      return;
    }
    setBusy(true);
    ob.finish();
    toast.success('Desk is open');
    router.replace(session ? '/dashboard' : '/games');
  }

  return (
    <main className="relative min-h-dvh bg-background px-4 py-10">
      <div className="desk-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto w-full max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <span className="text-xs tabular text-muted-foreground">
            {step + 1} / {total}
          </span>
        </div>
        <div className="mb-8 h-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        {step === 0 && (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Are you 21 or older?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sports research involving wagering prices is restricted to adults. This is not optional.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  ob.setAge(true);
                  setStep(1);
                }}
                className="rounded-xl border border-border bg-card px-4 py-5 text-left hover:border-primary/40"
              >
                <p className="font-display text-lg font-semibold">Yes, I am 21+</p>
                <p className="mt-1 text-sm text-muted-foreground">Enter the desk.</p>
              </button>
              <button
                type="button"
                onClick={() => toast.error('You must be 21 or older to use BetEdge')}
                className="rounded-xl border border-border bg-card px-4 py-5 text-left hover:border-primary/20"
              >
                <p className="font-display text-lg font-semibold">No</p>
                <p className="mt-1 text-sm text-muted-foreground">We'll wait.</p>
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">What do you follow?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Pick one or many. You can change this later.</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SPORT_KEYS.map((s: SportKey) => {
                const on = ob.sports.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ob.toggleSport(s)}
                    className={cn(
                      'h-12 rounded-xl border text-sm font-semibold uppercase',
                      on
                        ? 'border-primary/50 bg-primary/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <Button className="mt-8 w-full" disabled={!ob.sports.length} onClick={() => setStep(2)}>
              Continue
            </Button>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">How do you play?</h1>
            <div className="mt-6 space-y-2">
              {EXP.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => ob.setExperience(e.id)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left',
                    ob.experience === e.id
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border bg-card',
                  )}
                >
                  <p className="font-display font-semibold">{e.title}</p>
                  <p className="text-sm text-muted-foreground">{e.body}</p>
                </button>
              ))}
            </div>
            <Button className="mt-8 w-full" disabled={!ob.experience} onClick={() => setStep(3)}>
              Continue
            </Button>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Set a unit.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bankroll {money(ob.bankrollCents)}. A unit is 1–2% for most desks.
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Bankroll</p>
                <input
                  type="range"
                  min={20000}
                  max={500000}
                  step={5000}
                  value={ob.bankrollCents}
                  onChange={(e) => ob.setBankroll(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="font-mono text-lg tabular">{money(ob.bankrollCents)}</p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Unit</p>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={ob.unitCents}
                  onChange={(e) => ob.setUnit(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="font-mono text-lg tabular">{money(ob.unitCents)}</p>
              </div>
            </div>
            <Button className="mt-8 w-full" onClick={() => setStep(4)}>
              Continue
            </Button>
          </section>
        )}

        {step === 4 && (
          <section>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Play it straight.</h1>
            <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              BetEdge is a research product. We grade numbers, we do not take action, and we never
              promise a win. Betting is optional, 21+, and illegal in some places. If it stops
              being fun, stop — 1-800-GAMBLER.
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-primary"
                checked={ob.responsible}
                onChange={(e) => ob.setResponsible(e.target.checked)}
              />
              I am 21+, I understand this is research — not a guaranteed pick service — and I
              accept the responsible-gambling terms.
            </label>
            <Button
              className="mt-8 w-full"
              disabled={!ob.responsible || busy || status === 'loading'}
              onClick={finish}
            >
              {busy ? 'Opening…' : session ? 'Open my desk' : 'Continue as guest'}
            </Button>
            {!session && status !== 'loading' && (
              <Button className="mt-2 w-full" variant="outline" asChild>
                <Link href="/signup">Create an account first</Link>
              </Button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
