'use client'
import WidgetShell from '../WidgetShell'

export default function IframeWidget({ title='Embed', url='https://www.bing.com' }:{ title?: string, url?: string }){
  return (
    <WidgetShell title={title}>
      <iframe src={url} className="w-full h-full" />
    </WidgetShell>
  )
}
