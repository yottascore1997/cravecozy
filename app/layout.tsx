import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

// Polyfill `location` for server-side / static generation to avoid
// `ReferenceError: location is not defined` coming from Next.js router internals.
if (typeof window === 'undefined' && typeof (globalThis as any).location === 'undefined') {
  ;(globalThis as any).location = {
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    href: '/',
    pathname: '/',
    search: '',
    hash: '',
  } as any
}

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'CraveCozy - Fashion E-Commerce',
  description: 'Shop the latest fashion trends at CraveCozy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
