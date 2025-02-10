import { supabase } from './supabase';
import { Reservation } from '@/types/reservation';
import { startOfDay } from 'date-fns';

export async function getBookings(): Promise<Reservation[]> {
  console.log('Fetching bookings...');

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('check_in', { ascending: true });

  if (error) {
    console.error('Supabase error:', error.message);
    console.error('Error details:', error);
    throw error;
  }

  console.log('Fetched reservations:', data);
  if (!data || data.length === 0) {
    console.log('No reservations found in the database');
  }

  return data || [];
}

export async function isRoomAvailable(room: string, checkIn: string, checkOut: string, excludeBookingId?: string) {
  const bookings = await getBookings();

  // Filter out the booking we're currently updating (if any)
  const existingBookings = bookings.filter(b => b.id !== excludeBookingId);

  return !existingBookings.some(booking => {
    if (booking.room_name !== room) return false;

    const existingStart = new Date(booking.check_in);
    const existingEnd = new Date(booking.check_out);
    const newStart = new Date(checkIn);
    const newEnd = new Date(checkOut);

    // Check for any overlap
    return (
      (newStart >= existingStart && newStart < existingEnd) || // New check-in during existing stay
      (newEnd > existingStart && newEnd <= existingEnd) || // New check-out during existing stay
      (newStart <= existingStart && newEnd >= existingEnd) // New stay completely encompasses existing stay
    );
  });
}

export async function createBooking(booking: Omit<Reservation, 'id' | 'created_at' | 'in_season'>) {
  // Ensure dates are handled in local timezone at start of day
  const checkIn = startOfDay(new Date(booking.check_in)).toISOString();
  const checkOut = startOfDay(new Date(booking.check_out)).toISOString();

  const { data, error } = await supabase
    .from('reservations')
    .insert([{
      ...booking,
      check_in: checkIn,
      check_out: checkOut,
      in_season: true
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateBooking(booking: Reservation) {
  const isAvailable = await isRoomAvailable(booking.room_name, booking.check_in, booking.check_out, booking.id);

  if (!isAvailable) {
    throw new Error('Room is not available for these dates');
  }

  // Ensure dates are handled in local timezone at start of day
  const checkIn = startOfDay(new Date(booking.check_in)).toISOString();
  const checkOut = startOfDay(new Date(booking.check_out)).toISOString();

  const { data, error } = await supabase
    .from('reservations')
    .update({
      ...booking,
      check_in: checkIn,
      check_out: checkOut,
    })
    .eq('id', booking.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}