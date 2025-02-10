'use client';

import { useState, useEffect } from 'react';
import { getBookings } from '@/lib/bookings';
import { Reservation } from '@/types/reservation';
import { CalendarView } from './calendar-view';
import { TodayView } from './today-view';
import { Layout } from './layout';
import { NewBookingFormData } from '@/types/new-booking-form-data';
import { createBooking } from '@/lib/bookings';

export function FrontDeskClient() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewBooking = async (data: NewBookingFormData) => {
    try {
      await createBooking(data);
      loadBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout onNewBooking={handleNewBooking}>
      <div className='space-y-8'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-xl font-bold'>Front Desk</h1>
          </div>
          <CalendarView
            bookings={bookings}
            onBookingsChange={loadBookings}
          />
        </div>
        <TodayView bookings={bookings} />
      </div>
    </Layout>
  );
}
