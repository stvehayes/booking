'use client';

import { useState, useEffect } from 'react';
import { getBookings, createBooking } from '@/lib/bookings';
import { Reservation } from '@/types/reservation';
import { BookingTable } from './booking-table';
import { Nav } from './ui/nav';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Layout } from './layout';
import { CalendarView } from './calendar-view';
import { TodayView } from './today-view';
import { NewBookingFormData } from '@/types/new-booking-form-data';

export function BookingsClient() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Failed to load bookings. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // First filter
  const filteredBookings = bookings.filter((booking) => {
    const fullName = `${booking.first_name} ${booking.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Then sort the filtered results
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'first_name':
        comparison = a.first_name.localeCompare(b.first_name);
        break;
      case 'last_name':
        comparison = a.last_name.localeCompare(b.last_name);
        break;
      case 'check_in':
        comparison =
          new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
        break;
      case 'check_out':
        comparison =
          new Date(a.check_out).getTime() - new Date(b.check_out).getTime();
        break;
      case 'room_name':
        comparison = a.room_name.localeCompare(b.room_name);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Then paginate
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewBooking = async (data: NewBookingFormData) => {
    try {
      await createBooking(data);
      loadBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const refreshBookings = () => {
    loadBookings();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // If clicking the same column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking new column, set it with ascending direction
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <Layout onNewBooking={handleNewBooking}>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-bold'>Reservations</h1>
          <div className='w-72'>
            <Input
              type='search'
              placeholder='Search by guest name...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full'
            />
          </div>
        </div>
        <div className='border rounded-lg'>
          <BookingTable
            bookings={paginatedBookings}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onBookingUpdated={refreshBookings}
            onSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </Layout>
  );
}
