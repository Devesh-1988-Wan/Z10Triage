import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Z10Triage – Dashboard Builder',
  description: 'On‑the‑fly dashboard builder with Supabase',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
