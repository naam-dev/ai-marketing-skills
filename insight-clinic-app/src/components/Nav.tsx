'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/services',     label: 'Services' },
  { href: '/about',        label: 'Our Team' },
  { href: '/new-patients', label: 'New Patients' },
  { href: '/faq',          label: 'FAQs' },
]

export default function Nav() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link href="/" className="font-serif text-2xl text-navy font-semibold">
          Insight<span className="text-teal">Clinic</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-teal transition-colors ${pathname === l.href ? 'text-teal' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/new-patients#book" className="hidden md:block bg-teal text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-light transition-colors">
          Book a Consultation
        </Link>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className="block w-5 h-0.5 bg-navy mb-1" />
          <span className="block w-5 h-0.5 bg-navy mb-1" />
          <span className="block w-5 h-0.5 bg-navy" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-700 hover:text-teal" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/new-patients#book" className="btn-primary text-center text-sm" onClick={() => setOpen(false)}>
            Book a Consultation
          </Link>
        </div>
      )}
    </nav>
  )
}
