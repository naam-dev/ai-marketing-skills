import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

export type Appointment = {
  id: string
  name: string
  email: string
  phone: string | null
  service: string
  preferred_date: string | null
  preferred_time: string | null
  message: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export type DiscoveryCall = {
  id: string
  name: string
  email: string
  phone: string | null
  main_concern: string | null
  preferred_time: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export type Lead = {
  id: string
  email: string
  source: string
  created_at: string
}

export type Practitioner = {
  id: string
  name: string
  role: string
  qualifications: string | null
  bio: string | null
  photo_url: string | null
  display_order: number
  active: boolean
}

export type Faq = {
  id: string
  question: string
  answer: string
  category: string
  display_order: number
  active: boolean
}
