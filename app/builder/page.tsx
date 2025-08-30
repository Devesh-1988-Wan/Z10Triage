'use client'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { useEffect, useMemo, useState } from 'react'
import Toolbar from '@/components/Toolbar'
import WidgetRenderer from '@/components/WidgetRenderer'
import type { Dashboard, WidgetConfigBase } from '@/lib/types'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

const ResponsiveGridLayout = WidthProvider(Responsive)

function defaultWidget(type: WidgetConfigBase['type']): WidgetConfigBase {
  return { id: uuidv4(), type, x:0, y: Infinity, w: 3, h: 4, title: type.toUpperCase() }
}

export default function BuilderPage(){
  const [widgets, setWidgets] = useState<WidgetConfigBase[]>([])
  const [dashboardId, setDashboardId] = useState<string>('')
  const [shareUrl, setShareUrl] = useState<string>('')
  const [themeColor, setThemeColor] = useState<string>('#4f46e5')

  useEffect(()=>{ document.documentElement.style.setProperty('--color-primary', themeColor) }, [themeColor])

  const layouts = useMemo(()=>({ lg: widgets.map(w=> ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })) }), [widgets])

  const onLayoutChange = (current:any) => {
    setWidgets(prev=> prev.map(w=> {
      const l = current.find((i:any)=> i.i === w.id)
      return l ? { ...w, x:l.x, y:l.y, w:l.w, h:l.h } : w
    }))
  }

  const addWidget = (type: string) => setWidgets(prev=> [...prev, defaultWidget(type as any)])

  const save = async () => {
    const owner_external_id = getOwnerId()
    const payload: Partial<Dashboard> = {
      id: dashboardId || uuidv4(),
      name: 'My Dashboard',
      is_public: false,
      layout: widgets,
      theme: { primary: themeColor },
      owner_external_id
    }
    const { data, error } = await supabase.from('dashboards').upsert(payload as any).select().single()
    if (error) alert(error.message); else {
      setDashboardId(data.id)
      alert('Saved!')
    }
  }

  const load = async () => {
    const owner_external_id = getOwnerId()
    const { data, error } = await supabase.from('dashboards').select('*').eq('owner_external_id', owner_external_id).order('created_at', { ascending: false }).limit(1).single()
    if (error) { alert(error.message); return }
    setDashboardId(data.id)
    setWidgets(data.layout || [])
    setThemeColor((data.theme && data.theme.primary) || '#4f46e5')
  }

  const publish = async () => {
    if (!dashboardId) { alert('Save the dashboard first.'); return }
    const slug = uuidv4().split('-')[0]
    const { data, error } = await supabase.from('dashboards').update({ is_public: true, share_slug: slug }).eq('id', dashboardId).select().single()
    if (error) { alert(error.message); return }
    const url = `${window.location.origin}/share/${data.share_slug}`
    setShareUrl(url)
    await navigator.clipboard.writeText(url)
    alert('Published! Link copied to clipboard: ' + url)
  }

  return (
    <div className="min-h-screen">
      <Toolbar onAddWidget={addWidget} onSave={save} onLoad={load} onPublish={publish} onThemeChange={setThemeColor} />
      {shareUrl && <div className="p-2 text-center bg-green-50 dark:bg-green-900">Shared: <a className="underline" href={shareUrl} target="_blank">{shareUrl}</a></div>}
      <div className="p-3">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          rowHeight={30}
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
          onLayoutChange={(_, all)=> onLayoutChange(all.lg)}
        >
          {widgets.map(w=> (
            <div key={w.id} data-grid={{ x:w.x, y:w.y, w:w.w, h:w.h }}>
              <WidgetRenderer cfg={w} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}

function getOwnerId(){
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('owner_external_id')
  if (!id){ id = uuidv4(); localStorage.setItem('owner_external_id', id) }
  return id
}
