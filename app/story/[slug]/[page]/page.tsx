'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import WidgetRenderer from '@/components/WidgetRenderer'
import { usePresence } from '@/lib/usePresence'

export default function StoryPage({ params }:{ params: { slug: string, page: string }}){
  const supabase = useMemo(()=> createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ),[])

  const [scene, setScene] = useState<any>(null)
  const viewers = usePresence(`story:${params.slug}:${params.page}`)

  useEffect(()=>{
    (async()=>{
      const { data, error } = await supabase.from('scenes').select('*')
        .eq('share_slug', params.slug).eq('page', Number(params.page)).single()
      if (!error) {
        setScene(data)
        const primary = (data.theme && data.theme.primary) || '#4f46e5'
        document.documentElement.style.setProperty('--color-primary', primary)
      }
    })()
  },[params.slug, params.page, supabase])

  if (!scene) return <div className="p-8">Loading…</div>

  return (
    <div className="min-h-screen w-full p-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">{scene.title || `Slide ${params.page}`}</h1>
        <div className="text-sm text-gray-500">Viewers: {viewers.length}</div>
      </div>
      <div className="grid grid-cols-12 gap-3 auto-rows-[120px]">
        {(scene.layout || []).map((w:any)=> (
          <div key={w.id} className="col-span-12 md:col-span-6 lg:col-span-4" style={{ height: w.h*30 }}>
            <WidgetRenderer cfg={w} />
          </div>
        ))}
      </div>
      {scene.notes && (
        <aside className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded text-sm whitespace-pre-wrap">
          {scene.notes}
        </aside>
      )}
    </div>
  )
}
