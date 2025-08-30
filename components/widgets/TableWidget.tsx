'use client'
import WidgetShell from '../WidgetShell'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TableWidget({ title='Table', table='samples', columns='*', limit=20 }:{ title?: string, table?: string, columns?: string, limit?: number }){
  const [rows, setRows] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  useEffect(()=>{
    (async()=>{
      const { data, error } = await supabase.from(table).select(columns).limit(limit)
      if (error) setError(error.message)
      else setRows(data || [])
    })()
  },[table, columns, limit])

  return (
    <WidgetShell title={title}>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="overflow-auto h-full">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              {rows[0] && Object.keys(rows[0]).map(k=> <th key={k} className="px-2 py-1 border-b">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                {Object.values(r).map((v,j)=> <td key={j} className="px-2 py-1 border-b">{String(v)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetShell>
  )
}
