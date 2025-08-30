'use client'
import dynamic from 'next/dynamic'
import type { WidgetConfigBase } from '@/lib/types'

const KPI = dynamic(()=> import('@/components/widgets/KPIWidget'))
const Line = dynamic(()=> import('@/components/widgets/LineChartWidget'))
const Bar = dynamic(()=> import('@/components/widgets/BarChartWidget'))
const Pie = dynamic(()=> import('@/components/widgets/PieChartWidget'))
const TableW = dynamic(()=> import('@/components/widgets/TableWidget'))
const Markdown = dynamic(()=> import('@/components/widgets/MarkdownWidget'))
const ImageW = dynamic(()=> import('@/components/widgets/ImageWidget'))
const IframeW = dynamic(()=> import('@/components/widgets/IframeWidget'))
const ClockW = dynamic(()=> import('@/components/widgets/ClockWidget'))

export default function WidgetRenderer({ cfg }:{ cfg: WidgetConfigBase }){
  const common = { title: cfg.title, ...(cfg.options||{}), ...(cfg.data||{}) }
  switch(cfg.type){
    case 'kpi': return <KPI {...common} />
    case 'line': return <Line {...common} />
    case 'bar': return <Bar {...common} />
    case 'pie': return <Pie {...common} />
    case 'table': return <TableW {...common} />
    case 'markdown': return <Markdown {...common} />
    case 'image': return <ImageW {...common} />
    case 'iframe': return <IframeW {...common} />
    case 'clock': return <ClockW {...common} />
    default: return <div>Unknown widget: {cfg.type}</div>
  }
}
