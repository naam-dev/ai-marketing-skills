import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Insight Clinic Islington — Integrative Health Centre',
  description: 'Root-cause integrative medicine in Islington. Conventional clinical expertise combined with evidence-based complementary therapies.',
  keywords: 'integrative medicine, acupuncture, nutritional therapy, osteopathy, Islington, London, root cause medicine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
