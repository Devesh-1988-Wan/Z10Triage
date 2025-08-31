
# Z10Triage (Enhanced)

A fast, offline‑capable triage board for incidents/defects with keyboard + drag‑and‑drop, IndexedDB persistence, import/export, and PWA support. Designed to deploy on GitHub Pages.

## Features
- **Columns**: New → In Progress → Blocked → Done
- **Create/Edit/Delete** items with fields: title, description, priority, severity, assignee, tags, due, status
- **Drag & drop** between columns + **keyboard shortcuts** (Enter = open, Delete = remove, Ctrl+Arrow = move across columns)
- **Search & filters** (text, priority, assignee)
- **Offline‑first** via **IndexedDB** & **Service Worker** (PWA)
- **Import/Export** JSON
- **Accessible** landmarks, focus states, ARIA roles, color‑contrast friendly
- **Theming** (light/dark toggle)

> Service Worker & Manifest follow MDN/web.dev guidance for PWAs; use Lighthouse to verify performance and PWA compliance. 

## Quick start
```bash
# serve locally (any static server)
python -m http.server 8080  # or: npx serve .
# then open http://localhost:8080
```

## Deploy to GitHub Pages (via Actions)
This repo includes `.github/workflows/pages.yml`. Push to `main` to publish.

## Architecture
- **UI**: `index.html`, `styles.css`
- **Logic**: `app.js`
- **Persistence**: `db.js` (IndexedDB object store `items`)
- **PWA**: `manifest.webmanifest`, `sw.js`

### Data model (`items`)
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "priority": "Critical|High|Medium|Low",
  "severity": "S1|S2|S3|S4",
  "assignee": "string",
  "tags": ["string"],
  "due": "YYYY-MM-DD|null",
  "status": "new|in_progress|blocked|done"
}
```

### Import/Export
- **Export**: Downloads `z10triage-export.json`
- **Import**: Select a JSON array; missing IDs auto‑generated

### Security
- **CSP** meta blocks inline scripts & 3rd‑party resources by default; adjust `connect-src` if you add APIs.
- **No external scripts** or fonts by default.

## Optional: Supabase adapter
If you want multi‑user sync and auth, add a `remote.js` with Supabase client. Keep CSP `connect-src https://*.supabase.co`.

## Accessibility notes
- Semantic landmarks (`header`, `main`, `section`)
- Keyboard shortcuts and focus outlines
- ARIA roles for lists/listitems

## License
MIT
