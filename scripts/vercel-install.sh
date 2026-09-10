#!/usr/bin/env bash
set -euo pipefail

# Used when the Vercel project Root Directory is the repo root (current setup).
# Yarn 4 + the Next.js builder both need the app to look like it lives at cwd.

corepack enable
corepack prepare yarn@4.12.0 --activate

export DATABASE_URL="${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/build}"
yarn --cwd web install

for p in node_modules package.json next.config.js public app tsconfig.json auth.ts lib components prisma types tailwind.config.ts postcss.config.js instrumentation-client.js; do
  ln -sfn "web/$p" "$p"
done
