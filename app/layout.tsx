import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mi Itinerario - Talent Land 2026',
  description:
    'Itinerario personal para Talent Land Mexico 2026. Modos Intenso y Relajado con 3 dias de sesiones, workshops y keynotes.',
  openGraph: {
    title: 'Mi Itinerario - Talent Land 2026',
    description: 'Itinerario personal para Talent Land Mexico 2026',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TL26',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0f1e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
