'use client';

import { Reservation } from '@/types/reservation';
import { format, isToday, parseISO, startOfDay, isSameDay } from 'date-fns';
import { useState, useEffect } from 'react';

interface TodayViewProps {
  bookings: Reservation[];
}

export function TodayView({ bookings }: TodayViewProps) {
  const [today, setToday] = useState<Date>();

  useEffect(() => {
    setToday(startOfDay(new Date()));
  }, []);

  if (!today) return null;

  const checkingIn = bookings.filter((booking) => {
    const checkIn = startOfDay(parseISO(booking.check_in));
    console.log({
      name: `${booking.first_name} ${booking.last_name}`,
      checkIn: booking.check_in,
      parsedCheckIn: checkIn,
      today: today,
      isMatch: checkIn.getTime() === today.getTime(),
    });
    return checkIn.getTime() === today.getTime();
  });

  const checkingOut = bookings.filter((booking) => {
    const checkOut = startOfDay(parseISO(booking.check_out));
    return checkOut.getTime() === today.getTime();
  });

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Today</h2>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <h3 className='font-medium text-gray-600'>Checking In</h3>
          <div className='border rounded-lg overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'>
                    Room
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'>
                    Guest
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {checkingIn.map((booking) => (
                  <tr key={booking.id}>
                    <td className='px-4 py-2 text-sm'>{booking.room_name}</td>
                    <td className='px-4 py-2 text-sm'>
                      {booking.first_name} {booking.last_name}
                    </td>
                  </tr>
                ))}
                {checkingIn.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className='px-4 py-2 text-sm text-gray-500 text-center'
                    >
                      No check-ins today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='space-y-2'>
          <h3 className='font-medium text-gray-600'>Checking Out</h3>
          <div className='border rounded-lg overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'>
                    Room
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'>
                    Guest
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {checkingOut.map((booking) => (
                  <tr key={booking.id}>
                    <td className='px-4 py-2 text-sm'>{booking.room_name}</td>
                    <td className='px-4 py-2 text-sm'>
                      {booking.first_name} {booking.last_name}
                    </td>
                  </tr>
                ))}
                {checkingOut.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className='px-4 py-2 text-sm text-gray-500 text-center'
                    >
                      No check-outs today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
