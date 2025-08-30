# Z10Triage: Story Mode, Live Presence, Mobile Layouts (PR)

## What’s included
- **Story / Presentation mode**: `/story/[slug]/[page]` with per-page layouts, speaker notes and full-screen deck.
- **Live presence** (Supabase Realtime): see who is viewing; groundwork for co-presentation.
- **Per-breakpoint layouts**: better mobile via react-grid-layout responsive layouts (saved as `layouts.{lg,md,sm}` in dashboard rows).
- **Safer Supabase client guards** (optional file described below).
- **SQL**: new tables `scenes` (story pages) and `comments` (for future annotation), plus policies.

> This PR only **adds new files** (to avoid merge conflicts). After merge, you can swap existing widgets to use the new schema at your pace.

## How to run
1. Ensure env vars in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
2. Apply SQL in **Supabase SQL editor** from `supabase/2025-08-30_scenes_comments.sql` and `supabase/2025-08-30_policies.sql`.
3. Install deps:
```
bun add react-grid-layout @supabase/supabase-js next-themes zod
# or npm/pnpm equivalents
```
4. Start dev server:
```
bun run dev
```
5. Build a story:
   - Save/publish a dashboard as usual to get a `share_slug`.
   - Insert one or more **scene** rows referencing that `share_slug`.
   - Open `/story/<share_slug>/1` to present.

## Notes
- Export to PDF/PNG is proposed in roadmap; we’ll add a follow-up PR using a headless renderer.
- Presence uses the anon/publishable key; only public dashboards/slides are viewable for anon.
