import { supabase, type Practitioner } from '@/lib/supabase'
import HomepageClient from './HomepageClient'

export const revalidate = 3600

async function getPractitioners(): Promise<Practitioner[]> {
  const { data } = await supabase
    .from('practitioners')
    .select('*')
    .eq('active', true)
    .order('display_order')
  return data ?? []
}

export default async function HomePage() {
  const practitioners = await getPractitioners()
  return <HomepageClient practitioners={practitioners} />
}
