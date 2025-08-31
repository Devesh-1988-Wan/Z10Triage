
# Z10 Dashboard (AMLA-themed, widgetized)

A fully client-side, editable dashboard that lets you add, configure, drag, and resize widgets. No build tools or servers required. Works offline (PWA) and saves layout in IndexedDB.

## Features
- **Widget registry**: KPI, Bar, Pie, Trend, Table, Roadmap
- **Edit mode**: drag via handle, resize via corner; add/configure/remove widgets
- **Data binding**: `source + query` path (sample JSON, uploaded JSON, or Supabase adapter stub)
- **Import/Export** entire layout + data as JSON
- **PWA** offline and installable
- **AMLA** theme tokens driven via CSS variables

## Quick start
```bash
python -m http.server 8080
# open http://localhost:8080
```

## Data model
See `data/sample-data.json`. A widget reads `query` path like `bugs.weeklySummary`.

## Add new widgets
Create a file in `/widgets/<type>.js` and register: `window.Widgets['type'] = { render(el, cfg, dataset){...} }`.

## Persisted layout
Uses IndexedDB `kv['layout']`. Delete via DevTools or `Reset layout` button.

## Security
CSP blocks third-party resources by default. If using Supabase, endpoints are already allowed in `connect-src`.
