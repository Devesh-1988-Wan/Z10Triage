# Z10Triage – Dashboard Builder (Supabase)

A plug‑and‑play, on‑the‑fly dashboard builder you can publish to leadership. Drag, resize, theme, and share. Uses **Supabase** for persistence.

## Features
- Drag‑and‑drop layout (react‑grid‑layout)
- Widget library: KPI, Line, Bar, Pie, Table (from Supabase), Markdown, Image, iFrame, Clock
- Theme: light/dark + primary color picker stored per dashboard
- Save / Load dashboards (tied to a device id or Supabase auth user)
- Publish: generate a public, read‑only link `/share/[slug]`

## Getting started

1. **Clone & install**
```bash
pnpm install # or npm i / bun install
```

2. **Configure Supabase**
Create a project and set env vars:
```
cp .env.local.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

3. **Create tables & RLS** (SQL in `supabase/`)
Run these SQL files in the Supabase SQL editor:
- `supabase/schema.sql`
- `supabase/policies.sql`

4. **Run**
```bash
pnpm dev
```
Open http://localhost:3000

### Notes
- For the `Table` widget, ensure the selected table has **RLS** allowing read for `anon` or authenticated users as appropriate.
- Optional: set `SUPABASE_SERVICE_ROLE_KEY` if you later add server actions needing elevated privileges.
