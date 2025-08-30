import Link from 'next/link'
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Z10Triage – Dashboard Builder</h1>
        <p className="text-gray-600 dark:text-gray-300">Create, customize, and share dashboards in minutes.</p>
        <Link href="/builder" className="px-4 py-2 rounded bg-brand-500 text-white">Open Builder</Link>
      </div>
    </main>
  )
}
