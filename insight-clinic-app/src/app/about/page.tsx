import { supabase, type Practitioner } from '@/lib/supabase'

export const revalidate = 3600

async function getPractitioners(): Promise<Practitioner[]> {
  const { data } = await supabase
    .from('practitioners')
    .select('*')
    .eq('active', true)
    .order('display_order')
  return data ?? []
}

export default async function AboutPage() {
  const practitioners = await getPractitioners()

  return (
    <>
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-br from-navy to-navy-light py-20 px-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Home → Our Team</p>
        <h1 className="font-serif text-5xl text-white mb-4">Our Practitioners</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Experienced, registered practitioners who collaborate on complex cases. You get the benefit of multiple clinical perspectives.
        </p>
      </div>

      {/* ETHOS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label">Our Approach</div>
            <h2 className="section-title">A Clinic Built on Collaboration</h2>
            <p className="text-slate-500 leading-relaxed mb-5">
              At Insight Clinic, practitioners don't operate in silos. When a patient presents with a complex multi-system picture, we draw on the relevant expertise across our team — so you benefit from a GP, acupuncturist, and nutritional therapist all considering your case.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Every practitioner at Insight Clinic is registered with their relevant UK regulatory body. We don't use unregistered practitioners or unproven modalities. Our standard is clinical — the same evidence base and professional rigour you would expect from conventional healthcare.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🏥', label: 'Regulated practitioners only', sub: 'Every practitioner registered with their UK body' },
              { icon: '🤝', label: 'Collaborative care', sub: 'Practitioners collaborate on complex cases' },
              { icon: '🔬', label: 'Evidence-based', sub: 'Evidence-informed approaches throughout' },
              { icon: '👤', label: 'Patient-centred', sub: '60–90 minute appointments — not 10 minutes' },
            ].map(v => (
              <div key={v.label} className="bg-slate-50 rounded-xl p-5">
                <div className="text-2xl mb-2">{v.icon}</div>
                <strong className="block text-navy text-sm mb-1">{v.label}</strong>
                <p className="text-slate-500 text-xs leading-relaxed">{v.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">The Team</div>
          <h2 className="section-title">Meet Our Practitioners</h2>
          {practitioners.length === 0 ? (
            <p className="text-slate-400 mt-6">Practitioner information will appear here once added to the database.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {practitioners.map(p => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-sm">
                    {p.photo_url
                      ? <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                      : '📸 Photo'}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy">{p.name}</h3>
                    <p className="text-teal text-sm font-semibold mt-1 mb-2">{p.role}</p>
                    {p.qualifications && <p className="text-xs text-slate-400 mb-2">{p.qualifications}</p>}
                    {p.bio && <p className="text-sm text-slate-500 leading-relaxed">{p.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="section-label">Our Standards</div>
          <h2 className="section-title mx-auto">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { title: 'Regulated, always', desc: 'We will never employ an unregistered practitioner or use an unproven therapeutic modality. Every treatment we offer has an evidence base and a regulatory framework.' },
              { title: 'Honest with complexity', desc: 'Integrative medicine doesn\'t have all the answers. When a patient needs NHS referral, a specialist, or an investigation outside our scope, we say so — and facilitate it.' },
              { title: 'Transparent about costs', desc: 'Private healthcare is expensive. We are upfront about all costs, provide detailed invoices for insurance claims, and discuss whether treatment is likely to be effective before you commit.' },
            ].map(v => (
              <div key={v.title} className="card">
                <h3 className="font-bold text-navy text-lg mb-3">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
