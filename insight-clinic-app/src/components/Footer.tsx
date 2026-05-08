import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl text-white font-semibold">
              Insight<span className="text-teal">Clinic</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Integrative health care in the heart of Islington. Treating the root cause — not just the symptoms — since 2012.
            </p>
            <div className="mt-4 text-sm space-y-1">
              <p>📍 24 Chapel Market, Islington N1 9EZ</p>
              <p>📞 <a href="tel:+442012345678" className="hover:text-teal">020 1234 5678</a></p>
              <p>✉ <a href="mailto:hello@insightclinic.care" className="hover:text-teal">hello@insightclinic.care</a></p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <div className="flex flex-col gap-2 text-sm">
              {['Integrative GP', 'Acupuncture', 'Nutritional Therapy', 'Osteopathy', 'Naturopathy', 'Functional Testing'].map(s => (
                <Link key={s} href="/services" className="hover:text-teal transition-colors">{s}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Clinic</h4>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { href: '/about',        label: 'Our Team' },
                { href: '/new-patients', label: 'New Patients' },
                { href: '/faq',          label: 'FAQs' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="hover:text-teal transition-colors">{l.label}</Link>
              ))}
              <p className="text-sm mt-2">Mon–Fri 8am–7pm</p>
              <p className="text-sm">Sat 9am–2pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-light pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} Insight Clinic. All rights reserved. All practitioners are registered with their relevant UK regulatory body.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-teal">Privacy Policy</Link>
            <Link href="#" className="hover:text-teal">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
