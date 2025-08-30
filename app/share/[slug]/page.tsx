'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import WidgetRenderer from '@/components/WidgetRenderer'
import type { Dashboard } from '@/lib/types'

export default function SharePage({ params }:{ params: { slug: string }}){
  const [dash, setDash] = useState<Dashboard | null>(null)

  useEffect(()=>{
    (async()=>{
      const { data, error } = await supabase.from('dashboards').select('*').eq('share_slug', params.slug).eq('is_public', true).single()
      if (!error) {
        setDash(data as any)
        const primary = (data.theme && data.theme.primary) || '#4f46e5'
        document.documentElement.style.setProperty('--color-primary', primary)
      }
    })()
  },[params.slug])

  if (!dash) return <div className="p-8">Loading…</div>

  return (
    <div className="min-h-screen p-3">
      <h1 className="text-2xl font-semibold mb-3">{dash.name}</h1>
      <div className="grid grid-cols-12 gap-3 auto-rows-[120px]">
        {dash.layout.map(w=> (
          <div key={w.id} className="col-span-12 md:col-span-6 lg:col-span-4" style={{ height: w.h*30 }}>
            <WidgetRenderer cfg={w} />
          </div>
        ))}
      </div>
    </div>
  )
}
