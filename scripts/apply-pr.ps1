param(
  [string]$Branch = "feature/story-mode-export-realtime"
)

Write-Host "Creating branch $Branch"
 git checkout -b $Branch

Write-Host "Copying new files"
 robocopy "$PSScriptRoot\.." . /E /NFL /NDL /NJH /NJS /NC /NS /XD scripts | Out-Null

Write-Host "Adding files"
 git add app/story lib/usePresence.ts components/PresenterControls.tsx supabase/2025-08-30_*.sql PR_BODY.md

Write-Host "Committing"
 git commit -m "feat(dashboard): story mode, presence, per-breakpoint layouts + SQL tables"

Write-Host "Pushing"
 git push --set-upstream origin $Branch

Write-Host "Creating PR (requires GitHub CLI 'gh')"
 gh pr create --base main --title "Story Mode + Presence + Mobile Layouts" --body-file PR_BODY.md
