'use client'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

export default function Toolbar({ onAddWidget, onSave, onLoad, onPublish, onThemeChange }:{
  onAddWidget: (type: string) => void
  onSave: () => void
  onLoad: () => void
  onPublish: () => void
  onThemeChange: (hex: string) => void
}) {
  const { theme, setTheme } = useTheme()

  const signIn = async () => {
    const email = prompt('Enter email for magic link sign-in:')
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Magic link sent! Check your email.')
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white/70 dark:bg-black/30 sticky top-0 z-10 backdrop-blur">
      <button className="px-3 py-1 rounded bg-brand-500 text-white" onClick={() => onAddWidget('kpi')}>+ KPI</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('line')}>+ Line</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('bar')}>+ Bar</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('pie')}>+ Pie</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('table')}>+ Table</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('markdown')}>+ Markdown</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('iframe')}>+ iFrame</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('image')}>+ Image</button>
      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700" onClick={() => onAddWidget('clock')}>+ Clock</button>

      <div className="ml-auto flex items-center gap-2">
        <input type="color" title="Theme color" onChange={(e)=> onThemeChange(e.target.value)} />
        <select value={theme} onChange={e=> setTheme(e.target.value)} className="px-2 py-1 rounded border bg-transparent">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <button className="px-3 py-1 rounded border" onClick={onLoad}>Load</button>
        <button className="px-3 py-1 rounded border" onClick={onSave}>Save</button>
        <button className="px-3 py-1 rounded border" onClick={onPublish}>Publish</button>
        <button className="px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black" onClick={signIn}>Sign in</button>
      </div>
    </div>
  )
}
