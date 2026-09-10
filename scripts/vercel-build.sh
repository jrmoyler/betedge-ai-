#!/usr/bin/env bash
set -euo pipefail

# Prisma generate only needs a parseable URL; it does not connect.
export DATABASE_URL="${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/build}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-build-only-placeholder-not-used-at-runtime}"

yarn --cwd web prisma generate
yarn --cwd web build
ln -sfn web/.next .next
