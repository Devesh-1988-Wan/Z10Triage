'use client'
import Link from 'next/link'

export default function PresenterControls({ slug, page, pageCount }:{ slug: string, page: number, pageCount: number }){
  const prev = page>1 ? page-1 : 1
  const next = page<pageCount ? page+1 : page
  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Link href={`/story/${slug}/${prev}`} className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700">Prev</Link>
      <Link href={`/story/${slug}/${next}`} className="px-3 py-2 rounded bg-brand-500 text-white">Next</Link>
      <button onClick={()=> document.documentElement.requestFullscreen()} className="px-3 py-2 rounded border">Full screen</button>
    </div>
  )
}
