# BetEdge visual system

Near-black desk, one mint accent, Syne + Manrope + IBM Plex Mono.

## Typography

| Role | Font | Tailwind | Usage |
|------|------|----------|-------|
| Body | Manrope | `font-sans` | UI, labels, body |
| Display | Syne | `font-display` | Page titles, hero, board headings |
| Mono | IBM Plex Mono | `font-mono` | Odds, units, timestamps |

Headings: `tracking-tight`. Tabular nums on every price.

## Color

Tokens live in `app/globals.css` as HSL CSS variables. Never hardcode hex in components except team marks.

| Token | Role |
|-------|------|
| `background` | Page |
| `card` / `secondary` | Surfaces |
| `primary` | Mint accent — primary actions, selected odds |
| `muted-foreground` | Meta |
| `yes` / `no` / `live` / `warn` | Semantic status only |

## Sportsbook chrome

- Ticker under the header on every authenticated surface
- Odds cells: `odds-btn`, min 44px, tap adds to the slip
- Team marks: abbreviation chips, never official league logos
- Slip: sticky rail (header ticket icon) reading `useParlayStore`
- Onboarding: 21+ → sports → style → unit → responsible gambling

## Layout

Root `app/layout.tsx` owns ThemeProvider, Toaster, ChunkLoadErrorHandler. Do not remove.

## Radius

Concentric: cards `rounded-xl` (12–16px), inner controls `rounded-md` (6–8px), pills full.

## Motion

150–250ms, opacity/transform only. `prefers-reduced-motion` kills tape and live-dot pulse.
