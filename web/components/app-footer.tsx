'use client';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/brand/logo';

export function AppFooter() {
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-muted-foreground">© {year}</span>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Research only — 21+ | Gamble responsibly. BetEdge does not take action and does not
          guarantee wins. If it stops being fun, stop. 1-800-GAMBLER.
        </p>
      </div>
    </footer>
  );
}
