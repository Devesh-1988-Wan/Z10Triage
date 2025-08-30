'use client'
import WidgetShell from '../WidgetShell'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function LineChartWidget({ title='Line Chart', labels, series }:{ title?: string, labels?: string[], series?: number[] }){
  const data = {
    labels: labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      label: 'Series',
      data: series || [10, 20, 15, 22, 18, 25, 30],
      borderColor: 'rgb(79,70,229)',
      backgroundColor: 'rgba(79,70,229,0.2)'
    }]
  }
  return (
    <WidgetShell title={title}>
      <Line data={data} options={{ maintainAspectRatio: false }} />
    </WidgetShell>
  )
}
