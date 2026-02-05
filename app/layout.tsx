import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { MantineClientProvider } from '@/components/providers/MantineClientProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vixio Worldbuilder',
  description: 'Visual asset-driven creative platform for worldbuilding and production',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-900 antialiased transition-colors">
        <MantineClientProvider>
          {children}
        </MantineClientProvider>
      </body>
    </html>
  )
}
