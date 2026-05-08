'use client'

import { useState } from 'react'
import BookingModal from '@/components/BookingModal'

type Modal = 'book' | 'discovery' | null

export default function NewPatientsPage() {
  const [modal, setModal] = useState<Modal>(null)

  return (
    <>
      {modal && <BookingModal mode={modal} onClose={() => setModal(null)} />}

      {/* PAGE HEADER */}
      <div className="bg-gradient-to-br from-navy to-navy-light py-20 px-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Home → New Patients</p>
        <h1 className="font-serif text-5xl text-white mb-4">New Patients</h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Everything you need to know before your first appointment at Insight Clinic.
        </p>
      </div>

      {/* BOOKING OPTIONS */}
      <section id="book" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">Book an Appointment</div>
          <h2 className="section-title">How Would You Like to Start?</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="bg-navy text-white rounded-2xl p-10">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-serif text-2xl mb-3">Book a Consultation</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                Book your first 60–90 minute appointment directly. We will confirm within 2 business hours and send you intake paperwork to complete beforehand.
              </p>
              <ul className="text-sm text-slate-400 space-y-2 mb-8">
                <li className="flex gap-2"><span className="text-teal">✓</span> All services available to book</li>
                <li className="flex gap-2"><span className="text-teal">✓</span> Confirmed within 2 business hours</li>
                <li className="flex gap-2"><span className="text-teal">✓</span> Intake forms sent by email</li>
              </ul>
              <button onClick={() => setModal('book')} className="btn-primary w-full text-center">
                Book a Consultation
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-10 border border-slate-200">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-serif text-2xl text-navy mb-3">Free Discovery Call</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Not sure where to start? Book a free 15-minute call with a practitioner. We will talk through your symptoms and history, and recommend the most appropriate service — or honest tell you if we can't help.
              </p>
              <ul className="text-sm text-slate-500 space-y-2 mb-8">
                <li className="flex gap-2"><span className="text-teal">✓</span> Free, no commitment</li>
                <li className="flex gap-2"><span className="text-teal">✓</span> 15 minutes by phone or video</li>
                <li className="flex gap-2"><span className="text-teal">✓</span> Honest guidance on whether we can help</li>
              </ul>
              <button onClick={() => setModal('discovery')} className="btn-outline-dark w-full text-center">
                Book a Discovery Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">What to Expect</div>
          <h2 className="section-title">Your First Appointment</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { step: '1', title: 'Before you arrive', items: ['Complete your intake form (sent by email)', 'Gather any previous blood tests or letters from specialists', 'Write a brief timeline of your symptoms', 'List all current medications and supplements'] },
              { step: '2', title: 'During your appointment', items: ['60–90 minutes with your practitioner', 'Full case history and symptom review', 'Discussion of your health goals', 'Agreement on the next investigative steps'] },
              { step: '3', title: 'After your appointment', items: ['Receive a written summary within 48 hours', 'Functional test instructions where relevant', 'Clear follow-up plan and timeline', 'Results review appointment booked'] },
            ].map(block => (
              <div key={block.step} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg mb-4">{block.step}</div>
                <h3 className="font-bold text-navy mb-4">{block.title}</h3>
                <ul className="space-y-2">
                  {block.items.map(item => (
                    <li key={item} className="flex gap-2 text-sm text-slate-500">
                      <span className="text-teal mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRACTICAL INFO */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <div className="section-label">Practical Information</div>
            <h2 className="section-title">Finding Us</h2>
            <div className="space-y-5 mt-6">
              {[
                { icon: '📍', label: 'Address',    val: '24 Chapel Market, Islington, London N1 9EZ' },
                { icon: '🚇', label: 'Tube',       val: 'Angel (Northern line) — 2-minute walk' },
                { icon: '🚌', label: 'Bus',         val: '19, 38, 341 stop nearby' },
                { icon: '⏰', label: 'Hours',       val: 'Mon–Fri 8am–7pm · Sat 9am–2pm' },
                { icon: '📞', label: 'Phone',       val: '020 1234 5678' },
                { icon: '✉',  label: 'Email',       val: 'hello@insightclinic.care' },
              ].map(r => (
                <div key={r.label} className="flex gap-4">
                  <span className="text-2xl flex-shrink-0">{r.icon}</span>
                  <div>
                    <strong className="block text-navy text-sm">{r.label}</strong>
                    <span className="text-slate-500 text-sm">{r.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Costs & Insurance</div>
            <h2 className="section-title">Fees</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Our fees reflect the time and expertise of our practitioners. All prices are confirmed at the time of booking.
            </p>
            <div className="space-y-3">
              {[
                ['Integrative GP — initial (60 min)', '£[price]'],
                ['Integrative GP — follow-up (30 min)', '£[price]'],
                ['Acupuncture — initial (60 min)', '£[price]'],
                ['Acupuncture — follow-up (45 min)', '£[price]'],
                ['Nutritional Therapy — initial (75 min)', '£[price]'],
                ['Osteopathy — initial (60 min)', '£[price]'],
                ['Naturopathy — initial (75 min)', '£[price]'],
              ].map(([service, price]) => (
                <div key={service} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-0">
                  <span className="text-sm text-slate-600">{service}</span>
                  <span className="text-sm font-semibold text-navy">{price}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">Many services are covered by private health insurance. We provide receipts in a format suitable for insurance claims.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-3">Ready to Book?</h2>
          <p className="text-white/85 mb-8">Book your first appointment or start with a free 15-minute discovery call.</p>
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
