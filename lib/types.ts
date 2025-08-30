export type WidgetType =
  | 'kpi' | 'line' | 'bar' | 'pie' | 'table' | 'markdown' | 'image' | 'iframe' | 'clock'

export interface WidgetConfigBase {
  id: string
  type: WidgetType
  x: number
  y: number
  w: number
  h: number
  title?: string
  options?: Record<string, any>
  data?: any
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  is_public: boolean
  share_slug?: string | null
  theme?: Record<string, string>
  layout: WidgetConfigBase[]
  owner_external_id?: string | null
  created_at?: string
}
