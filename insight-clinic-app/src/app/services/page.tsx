'use client'

import { useState } from 'react'
import BookingModal from '@/components/BookingModal'

type Modal = 'book' | 'discovery' | null

const SERVICES = [
  {
    id: 'gp', icon: '🩺', num: '01',
    title: 'Integrative GP Consultations',
    reg: 'MBChB · MRCGP · Integrative Medicine trained',
    desc: [
      'Our integrative GP brings conventional medical training to a root-cause framework. That means you get the rigour of clinical medicine — proper examination, appropriate referrals, prescription access — combined with the depth of a functional medicine lens that asks why you are unwell, not just what label to give your symptoms.',
      'First appointments are 60 minutes. We take a full history, review all previous results and investigations, and order targeted functional tests that go beyond standard NHS panels.',
    ],
    treats: ['Chronic fatigue and post-viral fatigue, including Long COVID', 'Unexplained symptoms after normal investigations', 'Complex or multi-system presentations', 'Autoimmune conditions — Hashimoto\'s, lupus, RA, IBD', 'Metabolic health — blood sugar, cholesterol, cardiovascular risk', 'Patients seeking a second opinion'],
    details: [['⏱', 'Initial consultation', '60 minutes'], ['🔄', 'Follow-up appointments', '30 minutes'], ['📋', 'Functional tests', 'Ordered at first appointment']],
  },
  {
    id: 'acupuncture', icon: '🪡', num: '02',
    title: 'Acupuncture',
    reg: 'British Acupuncture Council (BAcC) Registered',
    desc: [
      'Our acupuncturists are BAcC-registered — the gold standard for acupuncture practice in the UK — and bring a clinical, evidence-based approach to treatment. Acupuncture at Insight Clinic isn\'t a standalone treatment; it\'s integrated with your overall care plan.',
      'NICE guidelines recommend acupuncture for chronic primary pain, tension-type headaches, and migraines. Beyond these, our practitioners have significant clinical experience in the conditions below.',
    ],
    treats: ['Chronic pain — back, neck, joint, headache, migraine', 'Anxiety and stress-related conditions', 'Fatigue and sleep disturbance', 'Hormonal conditions — PMS, PCOS, perimenopause', 'Fertility support (alongside conventional treatment)', 'Nausea and digestive symptoms'],
    details: [['⏱', 'Initial consultation', '60 minutes'], ['🔄', 'Follow-up sessions', '45 minutes'], ['📅', 'Course recommendation', '6–8 sessions initially']],
  },
  {
    id: 'nutrition', icon: '🥦', num: '03',
    title: 'Nutritional Therapy',
    reg: 'BANT Registered · CNHC Accredited',
    desc: [
      'Our nutritional therapists are BANT-registered — the professional standard for nutritional therapy in the UK. They use advanced functional testing to identify the nutritional and metabolic roots of your symptoms, then build a personalised protocol — not a generic diet plan.',
      'We work with the full functional picture, using tests rarely ordered in conventional settings to find what\'s actually driving your symptoms.',
    ],
    treats: ['Gut dysbiosis, SIBO, and intestinal permeability', 'IBS, bloating, food sensitivities, and intolerances', 'Nutrient deficiencies — magnesium, B12, iron, zinc, CoQ10', 'Blood sugar dysregulation and insulin resistance', 'Thyroid support', 'Hormonal conditions — PCOS, endometriosis, perimenopause'],
    details: [['⏱', 'Initial consultation', '75 minutes'], ['🔄', 'Review appointments', '45 minutes'], ['🔬', 'Testing', 'Stool analysis, food sensitivity, nutrient panels']],
  },
  {
    id: 'osteopathy', icon: '🦴', num: '04',
    title: 'Osteopathy',
    reg: 'General Osteopathic Council (GOsC) Registered',
    desc: [
      'Osteopathy is a whole-body approach to musculoskeletal health — regulated by the GOsC and recognised by NICE for low back pain. Our osteopaths don\'t just treat the site of pain; they investigate the postural patterns, movement habits, and systemic factors maintaining it.',
      'Within the integrative setting, our osteopaths collaborate with nutritional therapists and acupuncturists on complex cases — so patients with chronic inflammatory pain get both structural and systemic treatment.',
    ],
    treats: ['Lower back and neck pain — acute and chronic', 'Joint pain — hip, knee, shoulder, wrist', 'Sciatica and nerve pain', 'Sports injuries and post-surgical rehabilitation', 'Headaches and jaw tension (TMJ)', 'Pregnancy-related musculoskeletal pain'],
    details: [['⏱', 'Initial consultation', '60 minutes'], ['🔄', 'Follow-up sessions', '45 minutes'], ['📅', 'Typical course', '3–6 sessions for most acute conditions']],
  },
  {
    id: 'naturopathy', icon: '🌿', num: '05',
    title: 'Naturopathy',
    reg: 'General Council and Register of Naturopaths (GCRN) · Registered Medical Herbalist',
    desc: [
      'Naturopathy at Insight Clinic is clinical — not wellness-adjacent. Our naturopaths are trained in herbal medicine, lifestyle medicine, and natural therapeutics, working within your overall care plan alongside other practitioners.',
      'Naturopathy is particularly effective for hormonal conditions, immune regulation, adrenal support, and cases where patients want to reduce pharmaceutical dependency under proper supervision.',
    ],
    treats: ['Adrenal and HPA axis dysregulation', 'Thyroid support — Hashimoto\'s, sub-clinical hypothyroidism', 'Hormonal balance — PCOS, endometriosis, perimenopause', 'Immune conditions and inflammatory states', 'Anxiety and nervous system regulation', 'Skin conditions with internal drivers — acne, eczema, psoriasis'],
    details: [['⏱', 'Initial consultation', '75 minutes'], ['🔄', 'Review appointments', '45 minutes'], ['🌿', 'Herbal prescriptions', 'Individually formulated']],
  },
]

const TESTS = [
  { label: 'Hormones',        title: 'DUTCH Complete Hormone Test',       desc: 'Dried urine test mapping oestrogen metabolism pathways, progesterone, testosterone, DHEA, and 24-hour cortisol rhythm. The gold standard for hormonal investigation.' },
  { label: 'Gut Health',      title: 'Comprehensive Stool Analysis',      desc: 'Microbiome mapping: bacterial diversity, pathogen presence, inflammatory markers, intestinal permeability, digestive enzyme function, and SCFA production.' },
  { label: 'Gut Health',      title: 'SIBO Breath Test',                  desc: 'Lactulose and glucose breath testing to detect small intestinal bacterial overgrowth — the most commonly missed cause of IBS, bloating, and associated fatigue.' },
  { label: 'Thyroid',         title: 'Advanced Thyroid Panel',            desc: 'TSH, Free T3, Free T4, Reverse T3, TPO and thyroglobulin antibodies — the complete picture that identifies subclinical hypothyroidism and Hashimoto\'s missed by standard TSH.' },
  { label: 'Nutrients',       title: 'Intracellular Nutrient Panel',      desc: 'Intracellular (not serum) levels of magnesium, zinc, B vitamins, CoQ10, omega-3 index, vitamin D, and ferritin. Reveals deficiencies standard tests miss.' },
  { label: 'Food Sensitivities', title: 'IgG Food Sensitivity Testing',   desc: 'Delayed immune reactions (IgG) to 200+ foods. Identifies food triggers driving inflammation, gut symptoms, joint pain, skin conditions, and fatigue.' },
]

export default function ServicesPage() {
  const [modal, setModal] = useState<Modal>(null)

  return (
    <>
      {modal && <BookingModal mode={modal} onClose={() => setModal(null)} />}

      {/* PAGE HEADER */}
      <div className="bg-gradient-to-br from-navy to-navy-light py-20 px-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Home → Services</p>
        <h1 className="font-serif text-5xl text-white mb-4">Our Services</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Every discipline we offer works together. When you come to Insight Clinic, you get a team — not a series of separate referrals.
        </p>
      </div>

      {/* SERVICE NAV */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex gap-2 overflow-x-auto">
        {SERVICES.map(s => (
          <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-teal hover:text-white transition-colors">
            {s.title}
          </a>
        ))}
        <a href="#testing" className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-teal hover:text-white transition-colors">
          Functional Testing
        </a>
      </div>

      {/* SERVICE BLOCKS */}
      {SERVICES.map((s, i) => (
        <div key={s.id} id={s.id} className={`py-20 px-6 border-b border-slate-200 ${i % 2 === 1 ? 'bg-slate-50' : ''}`}>
          <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div>
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="section-label">Service {s.num}</div>
              <h2 className="font-serif text-3xl text-navy mb-2">{s.title}</h2>
              <p className="text-teal text-sm font-semibold mb-5">{s.reg}</p>
              {s.desc.map((d, j) => <p key={j} className="text-slate-500 leading-relaxed mb-4">{d}</p>)}
              <h4 className="font-semibold text-navy mt-6 mb-3">We see patients with:</h4>
              <ul className="space-y-2">
                {s.treats.map(t => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-500 py-2 border-b border-slate-100 last:border-0">
                    <span className="text-teal font-bold mt-0.5">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <h4 className="font-bold text-navy mb-5">Appointment details</h4>
              {s.details.map(([icon, label, val]) => (
                <div key={label} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <strong className="block text-sm text-navy">{label}</strong>
                    <span className="text-xs text-slate-400">{val} · £[price]</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 py-3">
                <span className="text-2xl">📍</span>
                <div>
                  <strong className="block text-sm text-navy">Location</strong>
                  <span className="text-xs text-slate-400">24 Chapel Market, Islington N1 9EZ</span>
                </div>
              </div>
              <button onClick={() => setModal('book')} className="btn-primary w-full text-center mt-4">
                Book a {s.title.split(' ')[0]} Appointment
              </button>
              <button onClick={() => setModal('discovery')} className="block text-center text-sm text-teal font-medium mt-3 w-full hover:underline">
                Or start with a free 15-min discovery call
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* FUNCTIONAL TESTING */}
      <section id="testing" className="bg-navy py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label" style={{ color: '#3ab5a5' }}>Advanced Testing</div>
          <h2 className="font-serif text-4xl text-white mb-4">The tests that change everything</h2>
          <p className="text-slate-400 leading-relaxed max-w-xl mb-12">
            Standard NHS blood panels detect disease. These tests detect dysfunction — the gap where most unexplained symptoms live.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTS.map(t => (
              <div key={t.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-teal-light text-xs font-bold uppercase tracking-wider mb-2">{t.label}</div>
                <h4 className="text-white font-semibold mb-2">{t.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-3">Ready to find your root cause?</h2>
          <p className="text-white/85 mb-8">Book your first consultation or start with a free 15-minute discovery call to find the right service for you.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => setModal('book')} className="bg-white text-teal px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition-colors">
              Book a Consultation
            </button>
            <button onClick={() => setModal('discovery')} className="border-2 border-white/50 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Free Discovery Call
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
