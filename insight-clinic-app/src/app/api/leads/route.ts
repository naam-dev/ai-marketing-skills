import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, source } = body

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const { error } = await supabase.from('leads').insert({
    email:  String(email).slice(0, 200),
    source: source ? String(source).slice(0, 100) : 'lead-magnet',
  })

  if (error) {
    if (error.code === '23505') {
      // duplicate email — treat as success silently
      return NextResponse.json({ success: true }, { status: 200 })
    }
    console.error('lead insert error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
