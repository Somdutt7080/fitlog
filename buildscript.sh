#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "dev" ]]; then
  echo "✅ - Build can proceed ($VERCEL_GIT_COMMIT_REF branch)"
  exit 1
else
  echo "🛑 - Build cancelled (not main or dev branch)"
  exit 0
fi