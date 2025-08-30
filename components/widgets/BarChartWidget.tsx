'use client'
import WidgetShell from '../WidgetShell'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function BarChartWidget({ title='Bar Chart', labels, series }:{ title?: string, labels?: string[], series?: number[] }){
  const data = {
    labels: labels || ['A','B','C','D','E'],
    datasets: [{
      label: 'Series',
      data: series || [5,12,8,14,10],
      backgroundColor: 'rgba(79,70,229,0.6)'
    }]
  }
  return (
    <WidgetShell title={title}>
      <Bar data={data} options={{ maintainAspectRatio: false }} />
    </WidgetShell>
  )
}
