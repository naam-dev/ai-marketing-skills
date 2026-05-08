'use client'

import { useState } from 'react'
import Link from 'next/link'
import BookingModal from '@/components/BookingModal'
import type { Practitioner } from '@/lib/supabase'

const SERVICES = [
  { icon: '🩺', title: 'Integrative GP', desc: 'Conventional clinical expertise with a root-cause lens. We order the tests your standard GP doesn\'t, and interpret them in full context.' },
  { icon: '🪡', title: 'Acupuncture',    desc: 'BAcC-registered practitioners treating chronic pain, anxiety, fatigue, and hormonal conditions. Evidence-based, not mystical.' },
  { icon: '🥦', title: 'Nutritional Therapy', desc: 'BANT-registered nutritionists using advanced testing to identify deficiencies, food sensitivities, and metabolic imbalances.' },
  { icon: '🦴', title: 'Osteopathy',     desc: 'GOsC-registered osteopaths treating musculoskeletal pain with a whole-body approach — addressing structure and systemic drivers.' },
  { icon: '🌿', title: 'Naturopathy',    desc: 'Herbal medicine, lifestyle medicine, and natural therapeutics — effective for hormonal balance, adrenal support, and immune regulation.' },
  { icon: '🔬', title: 'Functional Testing', desc: 'Advanced panels beyond standard NHS tests: DUTCH hormone testing, comprehensive stool analysis, SIBO breath test, and more.' },
]

const TESTIMONIALS = [
  { quote: '"After years of being told my fatigue was \'stress\', Insight Clinic found I had Hashimoto\'s with low Free T3 and significant magnesium depletion. Six months later I feel like a different person."', author: 'Emma T.', location: 'Highbury', service: 'Nutritional therapy' },
  { quote: '"The IBS I\'d had for 12 years turned out to be SIBO. A targeted protocol and my symptoms were gone in 8 weeks. I only wish I\'d found this place sooner."', author: 'James K.', location: 'Angel', service: 'Naturopathy' },
  { quote: '"My perimenopause symptoms were written off as anxiety by two GPs. Insight Clinic ran a DUTCH test, found oestrogen dominance, and gave me a plan that actually worked."', author: 'Caroline W.', location: 'Islington', service: 'Integrative GP' },
]

type Modal = 'book' | 'discovery' | 'lead' | null

export default function HomepageClient({ practitioners }: { practitioners: Practitioner[] }) {
  const [modal, setModal] = useState<Modal>(null)

  return (
    <>
      {modal && <BookingModal mode={modal} onClose={() => setModal(null)} />}

      {/* HERO */}
      <section className="bg-gradient-to-br from-navy to-navy-light py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal/20 text-teal-light px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              ⚕ Islington's Integrative Health Centre
            </div>
            <h1 className="font-serif text-5xl text-white leading-tight mb-5">
              Treat the <span className="text-gold">Root Cause</span> — Not Just the Symptoms
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              We combine conventional clinical assessment with evidence-based complementary therapies to find what's actually driving your symptoms — and resolve it properly.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setModal('book')} className="btn-primary">Book Your First Consultation</button>
              <button onClick={() => setModal('discovery')} className="btn-outline">Free 15-Min Discovery Call</button>
            </div>
            <div className="flex gap-10 mt-10 pt-10 border-t border-white/10">
              {[['12+', 'Years in practice'], ['1,000+', 'Patients helped'], ['4.9★', 'Google rating']].map(([num, label]) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-white">{num}</div>
                  <div className="text-xs text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl aspect-[4/3] text-slate-500 text-sm">
            📸 Clinic interior photography here
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-slate-50 border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {['British Acupuncture Council (BAcC)', 'BANT Registered Nutritionist', 'General Osteopathic Council (GOsC)', '2 mins from Angel Tube · N1 9EZ'].map(t => (
            <div key={t} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="bg-slate-100 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label">The Problem</div>
            <h2 className="section-title">Told Your Results Are Normal — But You Don't Feel Normal?</h2>
            <p className="section-sub mb-8">
              Standard GP blood tests detect serious disease. They're not designed to detect sub-optimal function. There's a significant gap between "normal" and "thriving" — and that's where most people live.
            </p>
            <div className="space-y-6">
              {[
                { icon: '😮‍💨', title: 'Persistent fatigue your GP can't explain', desc: 'Standard panels miss thyroid conversion issues, adrenal dysregulation, intracellular nutrient deficiencies, and gut-driven energy problems.' },
                { icon: '🫁', title: 'Digestive issues labelled "just IBS"', desc: 'IBS is a symptom, not a diagnosis. We identify whether it\'s SIBO, dysbiosis, food sensitivity, or gut permeability — and treat accordingly.' },
                { icon: '⚡', title: 'Hormonal symptoms dismissed or medicated', desc: 'PCOS, perimenopause, PMS, and thyroid dysfunction all have root causes that respond to integrative treatment.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 pb-6 border-b border-slate-200 last:border-0">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <strong className="block text-navy mb-1 font-semibold">{item.title}</strong>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy rounded-2xl p-10 text-white">
            <div className="text-gold text-lg mb-4">★★★★★</div>
            <blockquote className="font-serif text-2xl leading-relaxed mb-6">
              "I'd had chronic fatigue for three years and been told my bloods were fine. Within four months at Insight Clinic my energy is completely transformed."
            </blockquote>
            <cite className="text-slate-400 text-sm not-italic">— Sarah M., Islington · Integrative GP patient</cite>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">What We Offer</div>
          <h2 className="section-title">Integrated Care Under One Roof</h2>
          <p className="section-sub mb-12">Our practitioners collaborate on complex cases — so you get a whole team thinking about your health, not a series of siloed appointments.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="card">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                <Link href="/services" className="text-sm text-teal font-semibold hover:underline">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-navy py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label" style={{ color: '#3ab5a5' }}>The Process</div>
          <h2 className="font-serif text-4xl text-white leading-tight mb-4">How Integrative Care Works</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl mb-14">
            Not a 10-minute appointment and a referral. A proper investigation into what's driving your symptoms — and a plan to resolve them.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Comprehensive Intake', desc: 'Your first appointment is 60–90 minutes. We take a full history — symptoms, lifestyle, stress, sleep, diet, cycle, medications — and order targeted functional tests.' },
              { num: 2, title: 'Root Cause Analysis',  desc: 'We review your results through a whole-body lens — identifying the interconnected factors driving your symptoms, not just treating each in isolation.' },
              { num: 3, title: 'Personalised Plan',    desc: 'A coordinated plan drawing on whichever of our disciplines best addresses your root causes — reviewed and adjusted as you progress.' },
            ].map(step => (
              <div key={step.num} className="text-center px-4">
                <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">{step.num}</div>
                <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">Patient Stories</div>
          <h2 className="section-title">What Patients Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="bg-white border border-slate-200 rounded-xl p-8">
                <div className="text-gold text-sm mb-3">★★★★★</div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-5">{t.quote}</p>
                <div>
                  <strong className="text-navy text-sm">{t.author}</strong>
                  <span className="text-slate-400 text-sm ml-2">· {t.location} · {t.service}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-slate-50 rounded-xl p-6 flex flex-wrap items-center justify-center gap-6">
            <div>
              <div className="text-4xl font-bold text-navy">4.9</div>
              <div className="text-gold text-sm">★★★★★</div>
            </div>
            <p className="text-slate-600 text-sm">Based on 60+ Google Reviews</p>
            <a href="#" className="text-teal text-sm font-semibold hover:underline">Read all reviews →</a>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-teal to-[#1a7a70] rounded-2xl p-12 grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl text-white mb-3">Free Download: The 5 Root Causes of Fatigue</h2>
            <p className="text-white/85 leading-relaxed mb-6">The self-assessment guide that tells you which root cause is most likely driving your exhaustion — and what to do about it.</p>
            <button onClick={() => setModal('lead')} className="bg-navy text-white px-6 py-3 rounded-lg font-bold hover:bg-navy-light transition-colors">
              Send Me the Free Guide
            </button>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center bg-white/15 rounded-xl p-8 text-white/80 text-sm min-w-[160px]">
            <span className="text-5xl mb-2">📄</span>
            Free PDF Guide
          </div>
        </div>
      </section>

      {/* TEAM */}
      {practitioners.length > 0 && (
        <section className="bg-slate-100 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="section-label">Our Practitioners</div>
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-sub mb-12">Experienced, registered practitioners who collaborate on complex cases.</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {practitioners.map(p => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-sm">
                    {p.photo_url ? <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" /> : '📸 Photo'}
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-navy mb-1">{p.name}</h4>
                    <div className="text-teal text-sm font-semibold mb-2">{p.role}</div>
                    {p.qualifications && <div className="text-xs text-slate-500 mb-2">{p.qualifications}</div>}
                    {p.bio && <p className="text-xs text-slate-500 leading-relaxed">{p.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="bg-navy py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-white mb-4">Ready to Find Your Root Cause?</h2>
          <p className="text-slate-400 text-lg mb-10">Book your first consultation or start with a free 15-minute discovery call.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setModal('book')} className="btn-primary">Book a Consultation</button>
            <button onClick={() => setModal('discovery')} className="btn-outline">Free Discovery Call</button>
          </div>
          <p className="text-slate-500 text-sm mt-6">📍 24 Chapel Market, Islington N1 9EZ · 2 minutes from Angel tube</p>
        </div>
      </section>
    </>
  )
}
