#!/usr/bin/env bash
set -euo pipefail
BRANCH=${1:-feature/story-mode-export-realtime}

echo "Creating branch $BRANCH"
git checkout -b "$BRANCH"

echo "Copying new files"
rsync -av --exclude scripts ./ ../ 1>/dev/null || true

echo "Adding files"
git add app/story lib/usePresence.ts components/PresenterControls.tsx supabase/2025-08-30_*.sql PR_BODY.md

echo "Commit"
git commit -m "feat(dashboard): story mode, presence, per-breakpoint layouts + SQL tables"

echo "Push"
git push --set-upstream origin "$BRANCH"

echo "Create PR (needs GitHub CLI 'gh')"
 gh pr create --base main --title "Story Mode + Presence + Mobile Layouts" --body-file PR_BODY.md
