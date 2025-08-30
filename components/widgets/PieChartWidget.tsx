'use client'
import WidgetShell from '../WidgetShell'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChartWidget({ title='Pie', labels, series }:{ title?: string, labels?: string[], series?: number[] }){
  const data = {
    labels: labels || ['Red','Blue','Yellow'],
    datasets: [{
      data: series || [30,40,30],
      backgroundColor: ['#ef4444','#3b82f6','#eab308'],
    }]
  }
  return (
    <WidgetShell title={title}>
      <Pie data={data} />
    </WidgetShell>
  )
}
