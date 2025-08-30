'use client'
import WidgetShell from '../WidgetShell'
import { useEffect, useState } from 'react'

export default function ClockWidget({ title='Clock' }:{ title?: string }){
  const [now, setNow] = useState(new Date())
  useEffect(()=>{
    const id = setInterval(()=> setNow(new Date()), 1000)
    return ()=> clearInterval(id)
  },[])
  return (
    <WidgetShell title={title}>
      <div className="h-full flex items-center justify-center text-4xl font-mono">{now.toLocaleTimeString()}</div>
    </WidgetShell>
  )
}
