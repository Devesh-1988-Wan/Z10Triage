import type { WidgetType } from './types'

export const WIDGETS: { type: WidgetType; name: string; description: string }[] = [
  { type: 'kpi', name: 'KPI', description: 'Single metric with delta' },
  { type: 'line', name: 'Line Chart', description: 'Time series or categories' },
  { type: 'bar', name: 'Bar Chart', description: 'Compare categories' },
  { type: 'pie', name: 'Pie / Donut', description: 'Part of whole' },
  { type: 'table', name: 'Table (Supabase)', description: 'Query a table' },
  { type: 'markdown', name: 'Markdown', description: 'Rich text notes' },
  { type: 'image', name: 'Image', description: 'Show an image' },
  { type: 'iframe', name: 'iFrame', description: 'Embed external URL' },
  { type: 'clock', name: 'Clock', description: 'Live time' },
]
