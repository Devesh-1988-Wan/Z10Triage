'use client'
import WidgetShell from '../WidgetShell'

export default function KPIWidget({ value=1234, delta=5, title='KPI' }:{ value?: number, delta?: number, title?: string }){
  const up = delta>=0
  return (
    <WidgetShell title={title}>
      <div className="h-full flex flex-col items-start justify-center gap-2">
        <div className="text-4xl font-bold">{value.toLocaleString()}</div>
        <div className={up? 'text-green-600' : 'text-red-600'}>
          {up ? '▲' : '▼'} {Math.abs(delta)}%
        </div>
      </div>
    </WidgetShell>
  )
}
