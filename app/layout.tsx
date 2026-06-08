import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Noto_Serif_KR } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-kr",
})

const shillaCulture = localFont({
  src: [
    {
      path: '../public/fonts/Shilla_Culture(M).ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Shilla_Culture(B).ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-shilla-culture',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '병풍연화 디지털 전시관',
  description: '릴레이 소설 병풍 디지털 전시관',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/floruga_favicon.png', type: 'image/png', sizes: '48x48' },
      { url: '/floruga_favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/floruga_favicon.png',
    apple: '/floruga_favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`bg-[#15110f] text-stone-100 ${shillaCulture.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKR.variable} font-sans antialiased site-background min-h-dvh touch-manipulation`}
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
