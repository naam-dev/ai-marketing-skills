'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, type Appointment, type DiscoveryCall, type Lead } from '@/lib/supabase'

type Tab = 'appointments' | 'discovery' | 'leads'

const STATUS_COLOURS: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100  text-red-700',
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPage() {
  const [authed, setAuthed]           = useState(false)
  const [pw, setPw]                   = useState('')
  const [pwError, setPwError]         = useState(false)
  const [tab, setTab]                 = useState<Tab>('appointments')
  const [appointments, setAppts]      = useState<Appointment[]>([])
  const [discoveryCalls, setDiscovery]= useState<DiscoveryCall[]>([])
  const [leads, setLeads]             = useState<Lead[]>([])
  const [loading, setLoading]         = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [a, d, l] = await Promise.all([
      supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('discovery_calls').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
    ])
    setAppts(a.data ?? [])
    setDiscovery(d.data ?? [])
    setLeads(l.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) load() }, [authed, load])

  async function updateStatus(table: 'appointments' | 'discovery_calls', id: string, status: string) {
    await supabase.from(table).update({ status }).eq('id', id)
    load()
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin')) {
      setAuthed(true)
    } else {
      setPwError(true)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-lg">
          <div className="text-center mb-8">
            <span className="font-serif text-2xl text-navy font-semibold">Insight<span className="text-teal">Clinic</span></span>
            <p className="text-slate-500 text-sm mt-2">Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(false) }}
                className={`form-input ${pwError ? 'border-red-400' : ''}`}
                placeholder="Enter admin password"
                autoFocus
              />
              {pwError && <p className="text-red-600 text-xs mt-1">Incorrect password.</p>}
            </div>
            <button type="submit" className="btn-primary w-full text-center">Sign In</button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-6">
            Set your password via the <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> env var.<br />
            For production, use proper authentication.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin nav */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <span className="font-serif text-xl text-white font-semibold">Insight<span className="text-teal">Clinic</span> <span className="text-slate-400 text-sm font-sans font-normal ml-2">Admin</span></span>
        <div className="flex items-center gap-4">
          <button onClick={load} className="text-slate-400 hover:text-white text-sm">↻ Refresh</button>
          <button onClick={() => setAuthed(false)} className="text-slate-400 hover:text-white text-sm">Sign out</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Appointment requests', count: appointments.length, pending: appointments.filter(a => a.status === 'pending').length, tab: 'appointments' as Tab },
            { label: 'Discovery calls',      count: discoveryCalls.length, pending: discoveryCalls.filter(d => d.status === 'pending').length, tab: 'discovery' as Tab },
            { label: 'Email leads',          count: leads.length, pending: 0, tab: 'leads' as Tab },
          ].map(c => (
            <button
              key={c.label}
              onClick={() => setTab(c.tab)}
              className={`bg-white rounded-xl p-6 text-left border-2 transition-colors ${tab === c.tab ? 'border-teal' : 'border-transparent'} shadow-sm`}
            >
              <div className="text-3xl font-bold text-navy">{c.count}</div>
              <div className="text-slate-500 text-sm mt-1">{c.label}</div>
              {c.pending > 0 && (
                <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded-full">
                  {c.pending} pending
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-6">
          {(['appointments', 'discovery', 'leads'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-teal text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {t === 'discovery' ? 'Discovery Calls' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />)}</div>
        ) : (
          <>
            {/* Appointments */}
            {tab === 'appointments' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                    <tr>
                      {['Date', 'Name', 'Email', 'Phone', 'Service', 'Preferred date', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{fmt(a.created_at)}</td>
                        <td className="px-4 py-3 font-medium text-navy">{a.name}</td>
                        <td className="px-4 py-3 text-slate-500">{a.email}</td>
                        <td className="px-4 py-3 text-slate-400">{a.phone ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600">{a.service}</td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {a.preferred_date ? `${a.preferred_date} ${a.preferred_time ?? ''}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOURS[a.status]}`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={a.status}
                            onChange={e => updateStatus('appointments', a.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal"
                          >
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No appointment requests yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Discovery calls */}
            {tab === 'discovery' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                    <tr>
                      {['Date', 'Name', 'Email', 'Phone', 'Main concern', 'Preferred time', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {discoveryCalls.map(d => (
                      <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{fmt(d.created_at)}</td>
                        <td className="px-4 py-3 font-medium text-navy">{d.name}</td>
                        <td className="px-4 py-3 text-slate-500">{d.email}</td>
                        <td className="px-4 py-3 text-slate-400">{d.phone ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{d.main_concern ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-400">{d.preferred_time ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOURS[d.status]}`}>{d.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={d.status}
                            onChange={e => updateStatus('discovery_calls', d.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal"
                          >
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {discoveryCalls.length === 0 && (
                      <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No discovery call requests yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Leads */}
            {tab === 'leads' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                    <tr>
                      {['Date', 'Email', 'Source'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{fmt(l.created_at)}</td>
                        <td className="px-4 py-3 text-navy">{l.email}</td>
                        <td className="px-4 py-3 text-slate-400">{l.source}</td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr><td colSpan={3} className="px-4 py-12 text-center text-slate-400">No email leads yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
