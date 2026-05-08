import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, service, preferred_date, preferred_time, message } = body

  if (!name || !email || !service) {
    return NextResponse.json({ error: 'name, email, and service are required' }, { status: 400 })
  }

  const { error } = await supabase.from('appointments').insert({
    name:           String(name).slice(0, 200),
    email:          String(email).slice(0, 200),
    phone:          phone   ? String(phone).slice(0, 50)   : null,
    service:        String(service).slice(0, 200),
    preferred_date: preferred_date || null,
    preferred_time: preferred_time ? String(preferred_time).slice(0, 100) : null,
    message:        message ? String(message).slice(0, 2000) : null,
  })

  if (error) {
    console.error('appointment insert error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
