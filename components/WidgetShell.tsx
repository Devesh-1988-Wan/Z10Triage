'use client'
import { ReactNode } from 'react'

export default function WidgetShell({ title, children }:{ title?: string, children: ReactNode }){
  return (
    <div className="h-full w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm overflow-hidden">
      {title && <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50 dark:bg-gray-800">{title}</div>}
      <div className="p-3 h-[calc(100%-2rem)]">{children}</div>
    </div>
  )
}
