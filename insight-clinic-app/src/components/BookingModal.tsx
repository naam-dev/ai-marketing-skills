'use client'

import { useState } from 'react'

type Mode = 'book' | 'discovery' | 'lead'

type Props = {
  mode: Mode
  onClose: () => void
}

const SERVICES = [
  'Integrative GP Consultation',
  'Acupuncture',
  'Nutritional Therapy',
  'Osteopathy',
  'Naturopathy',
  'Functional Testing Consultation',
  'Not sure — I need guidance',
]

export default function BookingModal({ mode, onClose }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    const endpoint =
      mode === 'book'      ? '/api/book' :
      mode === 'discovery' ? '/api/discovery' :
                             '/api/leads'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again or call us directly.')
    }
  }

  const title =
    mode === 'book'      ? 'Book a Consultation' :
    mode === 'discovery' ? 'Free 15-Min Discovery Call' :
                           'Get the Free Guide'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-serif text-2xl text-navy">{title}</h2>
              {mode === 'book'      && <p className="text-sm text-slate-500 mt-1">We will confirm your appointment within 2 business hours.</p>}
              {mode === 'discovery' && <p className="text-sm text-slate-500 mt-1">A 15-minute call to find the right service for you — no commitment.</p>}
              {mode === 'lead'      && <p className="text-sm text-slate-500 mt-1">We will email you the guide instantly.</p>}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none ml-4">×</button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-serif text-xl text-navy mb-2">
                {mode === 'lead' ? 'Guide on its way!' : 'Request received!'}
              </h3>
              <p className="text-slate-500 text-sm">
                {mode === 'lead'
                  ? 'Check your inbox for the guide within a few minutes.'
                  : 'We will be in touch within 2 business hours to confirm.'}
              </p>
              <button onClick={onClose} className="mt-6 btn-primary text-sm px-6 py-2.5">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== 'lead' && (
                <>
                  <div>
                    <label className="form-label">Full name *</label>
                    <input name="name" required className="form-input" placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="form-label">Email address *</label>
                    <input name="email" type="email" required className="form-input" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label className="form-label">Phone number</label>
                    <input name="phone" type="tel" className="form-input" placeholder="07700 900000" />
                  </div>
                </>
              )}

              {mode === 'book' && (
                <>
                  <div>
                    <label className="form-label">Service *</label>
                    <select name="service" required className="form-input">
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Preferred date</label>
                      <input name="preferred_date" type="date" className="form-input" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="form-label">Preferred time</label>
                      <select name="preferred_time" className="form-input">
                        <option value="">Any time</option>
                        <option>Morning (8am–12pm)</option>
                        <option>Afternoon (12pm–5pm)</option>
                        <option>Evening (5pm–7pm)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Brief description of your concern</label>
                    <textarea name="message" rows={3} className="form-input resize-none" placeholder="Briefly describe what you would like to discuss…" />
                  </div>
                </>
              )}

              {mode === 'discovery' && (
                <>
                  <div>
                    <label className="form-label">Main health concern</label>
                    <textarea name="main_concern" rows={3} className="form-input resize-none" placeholder="Briefly describe your main symptoms or what you are hoping to address…" />
                  </div>
                  <div>
                    <label className="form-label">Preferred call time</label>
                    <select name="preferred_time" className="form-input">
                      <option value="">Any time</option>
                      <option>Morning (8am–12pm)</option>
                      <option>Afternoon (12pm–5pm)</option>
                      <option>Evening (5pm–7pm)</option>
                    </select>
                  </div>
                </>
              )}

              {mode === 'lead' && (
                <div>
                  <label className="form-label">Email address *</label>
                  <input name="email" type="email" required className="form-input" placeholder="jane@example.com" />
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading'
                  ? 'Sending…'
                  : mode === 'book'      ? 'Request Appointment'
                  : mode === 'discovery' ? 'Book My Discovery Call'
                  :                        'Send Me the Guide'}
              </button>

              <p className="text-xs text-center text-slate-400">
                Your data is never shared. By submitting you agree to our Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
