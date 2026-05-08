'use client'

import { useState, useEffect } from 'react'
import { supabase, type Faq } from '@/lib/supabase'
import BookingModal from '@/components/BookingModal'

type Modal = 'book' | 'discovery' | null

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'all',          label: 'All' },
  { key: 'general',      label: 'General' },
  { key: 'booking',      label: 'Booking' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'treatment',    label: 'Treatment' },
  { key: 'billing',      label: 'Billing & Insurance' },
]

export default function FaqPage() {
  const [faqs, setFaqs]         = useState<Faq[]>([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState('all')
  const [open, setOpen]         = useState<string | null>(null)
  const [modal, setModal]       = useState<Modal>(null)

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .eq('active', true)
      .order('display_order')
      .then(({ data }) => { setFaqs(data ?? []); setLoading(false) })
  }, [])

  const visible = category === 'all' ? faqs : faqs.filter(f => f.category === category)

  return (
    <>
      {modal && <BookingModal mode={modal} onClose={() => setModal(null)} />}

      {/* PAGE HEADER */}
      <div className="bg-gradient-to-br from-navy to-navy-light py-20 px-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Home → FAQs</p>
        <h1 className="font-serif text-5xl text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Answers to the questions we hear most often. If yours isn't here, call us or book a free discovery call.
        </p>
      </div>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c.key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No FAQs in this category yet.</p>
          ) : (
            <div className="space-y-3">
              {visible.map(faq => (
                <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-slate-50 transition-colors"
                    onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  >
                    <span className="font-semibold text-navy pr-4">{faq.question}</span>
                    <span className={`text-teal text-xl flex-shrink-0 transition-transform ${open === faq.id ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {open === faq.id && (
                    <div className="px-6 pb-5 text-slate-500 leading-relaxed text-sm border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 bg-navy rounded-2xl p-10 text-center">
            <h3 className="font-serif text-2xl text-white mb-3">Still have questions?</h3>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Book a free 15-minute discovery call. We will answer your questions and help you decide if Insight Clinic is the right fit.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setModal('discovery')} className="btn-primary text-sm px-6 py-2.5">Free Discovery Call</button>
              <button onClick={() => setModal('book')} className="btn-outline text-sm px-6 py-2.5">Book a Consultation</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
