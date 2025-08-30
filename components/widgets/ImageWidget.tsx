'use client'
import WidgetShell from '../WidgetShell'

export default function ImageWidget({ title='Image', url='https://picsum.photos/800/400', contain=false }:{ title?: string, url?: string, contain?: boolean }){
  return (
    <WidgetShell title={title}>
      <img src={url} className={`w-full h-full ${contain? 'object-contain':'object-cover'}`} alt={title} />
    </WidgetShell>
  )
}
