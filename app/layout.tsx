import type { Metadata } from 'next'
import { ColorSchemeScript } from '@mantine/core'
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
    <html lang="en" data-mantine-color-scheme="light" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <MantineClientProvider>
          {children}
        </MantineClientProvider>
      </body>
    </html>
  )
}
