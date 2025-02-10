import { supabase } from './supabase'
import { Reservation } from '@/types/reservation'

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Error fetching reservations:', error)
    return []
  }

  return data || []
}