import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, main_concern, preferred_time } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
  }

  const { error } = await supabase.from('discovery_calls').insert({
    name:           String(name).slice(0, 200),
    email:          String(email).slice(0, 200),
    phone:          phone         ? String(phone).slice(0, 50)         : null,
    main_concern:   main_concern  ? String(main_concern).slice(0, 2000): null,
    preferred_time: preferred_time? String(preferred_time).slice(0, 100): null,
  })

  if (error) {
    console.error('discovery_call insert error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
