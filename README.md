# BetEdge AI

**AI-Powered Sports Betting Research Assistant**

> Compare the market. Inspect the evidence. Find your edge.

BetEdge AI is a full-stack sports betting research platform covering NFL, NBA, MLB, NCAA Football, and NCAA Basketball.

## Project Structure

```
betedge-ai/
├── web/          # Next.js web application (Vercel deploy root)
├── mobile/       # React Native + Expo mobile app (iOS & Android)
├── vercel.json   # Builds `web/` from the monorepo root
├── BetEdge_AI_Design_Plan.md
└── propgpt_research.md
```

## Tech Stack

**Web:** Next.js, TypeScript, Tailwind CSS, NextAuth.js, PostgreSQL + Prisma, Stripe, Claude AI  
**Mobile:** React Native + Expo, Expo Router, Zustand, TanStack Query  
**Data:** The Odds API, ESPN API, BALLDONTLIE, College Football Data API

## Features

- AI-Graded Picks (A-F) with confidence percentages
- Cross-book odds comparison across multiple sportsbooks
- Player props analysis with historical trends
- Editable parlay builder with AI grading
- Personal pick tracker with ROI analytics
- Line movement & injury alerts (premium)
- Free / Pro ($9.99/mo) / Elite ($19.99/mo) tiers

## Getting Started

### Web App
```bash
cd web
yarn install
cp .env.example .env        # DATABASE_URL and NEXTAUTH_SECRET are required
yarn prisma generate
yarn prisma db push         # create the schema
yarn dev
```

Checks:
```bash
yarn lint                                        # app lint
yarn eslint -c eslint.ssr.config.mjs --no-config-lookup .   # SSR/hydration safety
npx tsc --noEmit                                 # types
node scripts/auth-smoke.mjs                      # signup -> login -> session, against a running server
```

Every third-party key is optional. Without them the app serves bundled demo data,
billing returns 503, and AI analysis reports that it is unconfigured — nothing crashes.

### Mobile App
```bash
cd mobile
corepack enable && yarn install   # project pins yarn 4
npx expo start
```

Set `EXPO_PUBLIC_API_URL` to the deployed web app to run against the real backend.
Unset, the app runs on bundled demo data and the login screen offers an explicit
"Explore demo data" button.

## Deploy (Vercel)

The Next.js app lives in `web/`. A root `vercel.json` tells Vercel to install and
build that directory (the linked project currently has no Root Directory set, so
a root-level Next.js app is not detected otherwise).

If you set **Root Directory** to `web` in the Vercel project settings, `web/vercel.json`
takes over and the extra path mapping is skipped.

Set these environment variables on the Vercel project (Production + Preview):

| Name | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes for auth / saved picks | Postgres connection string |
| `NEXTAUTH_SECRET` | Yes for auth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Recommended | Public origin, e.g. `https://your-app.vercel.app` |

Sports, AI, Google, and Stripe keys stay optional — the same fallbacks as local apply.

## Authentication

The web app uses NextAuth session cookies. Native clients cannot use those, so
`/api/auth/login` and `/api/signup` additionally return a signed bearer token
(`Authorization: Bearer <token>`, signed with `NEXTAUTH_SECRET`). Every `/api/user/*`
route accepts either.
