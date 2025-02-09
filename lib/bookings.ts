// import { supabase } from './supabase';
// import { Booking } from '@/app/types/booking';

// export async function getBookings() {
//   const { data, error } = await supabase
//     .from('bookings')
//     .select('*')
//     .order('checkIn', { ascending: true });

//   if (error) throw error;
//   return data as Booking[];
// }

// export async function createBooking(booking: Omit<Booking, 'id'>) {
//   const { data, error } = await supabase
//     .from('bookings')
//     .insert([booking])
//     .select()
//     .single();

//   if (error) throw error;
//   return data as Booking;
// }

// export async function deleteBooking(id: string) {
//   const { error } = await supabase.from('bookings').delete().eq('id', id);

//   if (error) throw error;
// }