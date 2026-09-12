'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    annualPrice: '$7.99',
    annualBilling: 'billed annually',
    features: [
      'Unlimited picks & props',
      'Full AI analysis (key factors + risks)',
      'Odds from up to 5 books',
      'Unlimited parlay legs + AI grade',
      'Line movement display',
      '3 alerts',
      'Full pick tracker with ROI',
      '7-day free trial',
    ],
    popular: true,
  },
  {
    id: 'elite-monthly',
    name: 'Elite',
    price: '$19.99',
    period: 'month',
    annualPrice: '$15.99',
    annualBilling: 'billed annually',
    features: [
      'Everything in Pro',
      'Odds from 10+ books',
      'Unlimited alerts',
      'Early access picks (2hr ahead)',
      'Full ROI analytics',
      'Backtesting dashboard',
      'Priority AI analysis refresh',
    ],
    popular: false,
  },
];

export function UpgradeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const tier = session?.user?.subscriptionTier ?? 'FREE';
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  async function handleSubscribe(planId: string) {
    if (status !== 'authenticated') {
      router.push(`/signup?next=${encodeURIComponent('/upgrade')}`);
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        toast.error(data?.error ?? 'Unable to start checkout');
      }
    } catch {
      toast.error('Error starting checkout');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Upgrade
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Three seats. One board.
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Unlimited analysis, cross-book odds, and a desk that sizes with you. Cancel anytime.
          </p>

          <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'h-10 rounded-md px-4 text-sm font-semibold',
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground',
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={cn(
                'h-10 rounded-md px-4 text-sm font-semibold',
                billingCycle === 'annual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground',
              )}
            >
              Annual · save 20%
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent =
              (tier === 'PRO' && plan.id?.startsWith('pro')) ||
              (tier === 'ELITE' && plan.id?.startsWith('elite'));
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl border bg-card p-6',
                  plan.popular ? 'border-primary/40' : 'border-border',
                )}
              >
                {plan.popular && (
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Most used
                  </p>
                )}
                <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 font-display text-3xl font-semibold tabular">
                  {billingCycle === 'annual' ? plan.annualPrice : plan.price}
                  <span className="ml-1 text-sm font-sans font-medium text-muted-foreground">
                    /{plan.period}
                  </span>
                </p>
                {billingCycle === 'annual' && (
                  <p className="mt-1 text-xs text-primary">{plan.annualBilling}</p>
                )}
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  loading={loadingPlan === plan.id}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current plan' : `Get ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
