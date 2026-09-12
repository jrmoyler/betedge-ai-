'use client';

const TAPE = [
  { sport: 'NFL', label: 'BUF @ KC', score: '17–14', status: 'Q3 6:12' },
  { sport: 'NBA', label: 'NYK @ BOS', score: '88–91', status: 'Q4 3:41' },
  { sport: 'MLB', label: 'BOS @ NYY', score: '3–5', status: 'Bot 7' },
  { sport: 'NFL', label: 'DAL @ PHI', score: '—', status: 'Sun 8:20p' },
  { sport: 'MKT', label: 'Chiefs Super Bowl', score: '31¢', status: '+4.2' },
  { sport: 'NCAAF', label: 'UGA @ BAMA', score: '—', status: 'Sat 7:30p' },
  { sport: 'NBA', label: 'LAL @ DEN', score: '102–97', status: 'Q3 1:08' },
  { sport: 'MKT', label: 'Ohtani 50 HR', score: '64¢', status: 'Yes' },
  { sport: 'UFC', label: 'Main event ML', score: '−165', status: 'Sat' },
  { sport: 'NFL', label: 'Mahomes Pass Yds', score: 'O 275.5', status: 'A 87%' },
];

export function Ticker() {
  const items = [...TAPE, ...TAPE];
  return (
    <div className="ticker-mask relative overflow-hidden border-b border-border bg-card">
      <div className="animate-tape flex w-max gap-8 py-2 pr-8">
        {items.map((t, i) => (
          <div key={`${t.label}-${i}`} className="flex items-center gap-2.5 text-xs">
            <span className="font-medium uppercase tracking-[0.14em] text-faint">
              {t.sport}
            </span>
            <span className="text-foreground">{t.label}</span>
            <span className="font-mono tabular text-foreground">{t.score}</span>
            <span className="text-muted-foreground">{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
