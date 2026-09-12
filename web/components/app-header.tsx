'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Gauge,
  Target,
  Layers,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Ticket,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/brand/logo';
import { Ticker } from '@/components/ticker';
import { BetSlip } from '@/components/bet-slip';
import { useParlayStore } from '@/lib/parlay-store';
import { useMounted } from '@/components/client-only';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Desk', icon: LayoutDashboard },
  { href: '/games', label: 'Sports', icon: Gauge },
  { href: '/props', label: 'Research', icon: Target },
  { href: '/parlay-builder', label: 'Parlay', icon: Layers },
  { href: '/tracker', label: 'Tracker', icon: ClipboardList },
  { href: '/alerts', label: 'Alerts', icon: Bell },
];

export function AppHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const mounted = useMounted();
  const legs = useParlayStore((s) => s.legs);
  const slipCount = mounted ? legs.length : 0;
  const tier = session?.user?.subscriptionTier ?? 'FREE';
  const showNav = Boolean(session) || (pathname && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/onboarding');

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Logo href={session ? '/dashboard' : '/'} />

          {showNav && (
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            {showNav && (
              <button
                type="button"
                onClick={() => setSlipOpen(true)}
                className="relative grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Open bet slip"
              >
                <Ticket className="h-4 w-4" />
                {slipCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {slipCount}
                  </span>
                )}
              </button>
            )}

            {session ? (
              <>
                {tier === 'FREE' && (
                  <Link
                    href="/upgrade"
                    className="hidden h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 sm:flex"
                  >
                    Upgrade
                  </Link>
                )}
                {tier !== 'FREE' && (
                  <span className="hidden rounded-md bg-primary/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:inline">
                    {tier}
                  </span>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden text-xs sm:inline">
                      {session?.user?.name ?? session?.user?.email?.split('@')?.[0] ?? 'User'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lift">
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        <User className="h-4 w-4" /> Account
                      </Link>
                      <button
                        onClick={() => signOut({ redirectTo: '/' })}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-secondary"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary md:hidden"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/onboarding"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Open the desk
                </Link>
              </div>
            )}
          </div>
        </div>

        {session && mobileOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
            <nav className="mx-auto max-w-7xl space-y-1 px-4 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
        <Ticker />
      </header>

      {slipOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setSlipOpen(false)}
            aria-label="Dismiss slip"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-border bg-card shadow-lift">
            <BetSlip onClose={() => setSlipOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
