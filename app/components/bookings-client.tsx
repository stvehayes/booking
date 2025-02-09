'use client';

import { useState, useEffect } from 'react';
// import { getBookings, createBooking } from '@/lib/bookings';
import { Booking } from '@/app/types/booking';
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

const initialBookings = [
  {
    id: '1',
    guestName: 'John Doe',
    checkIn: new Date('2024-03-20'),
    checkOut: new Date('2024-03-25'),
    roomName: 'Torch Lake',
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    checkIn: new Date('2024-03-22'),
    checkOut: new Date('2024-03-24'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '13',
    guestName: 'Thomas Anderson',
    checkIn: new Date('2024-04-02'),
    checkOut: new Date('2024-04-05'),
    roomName: 'Torch Lake',
  },
  {
    id: '14',
    guestName: 'Maria Garcia',
    checkIn: new Date('2024-04-03'),
    checkOut: new Date('2024-04-07'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '15',
    guestName: 'Daniel Kim',
    checkIn: new Date('2024-04-04'),
    checkOut: new Date('2024-04-08'),
    roomName: 'Clam Lake',
  },
  {
    id: '16',
    guestName: 'Sophie Martin',
    checkIn: new Date('2024-04-05'),
    checkOut: new Date('2024-04-09'),
    roomName: 'Torch Lake',
  },
  {
    id: '17',
    guestName: 'Alex Thompson',
    checkIn: new Date('2024-04-06'),
    checkOut: new Date('2024-04-10'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '18',
    guestName: 'Rachel Chen',
    checkIn: new Date('2024-04-07'),
    checkOut: new Date('2024-04-11'),
    roomName: 'Clam Lake',
  },
  {
    id: '19',
    guestName: 'Christopher Lee',
    checkIn: new Date('2024-04-08'),
    checkOut: new Date('2024-04-12'),
    roomName: 'Torch Lake',
  },
  {
    id: '20',
    guestName: 'Isabella Silva',
    checkIn: new Date('2024-04-09'),
    checkOut: new Date('2024-04-13'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '21',
    guestName: 'Nathan Parker',
    checkIn: new Date('2024-04-10'),
    checkOut: new Date('2024-04-14'),
    roomName: 'Clam Lake',
  },
  {
    id: '22',
    guestName: 'Emma Wilson',
    checkIn: new Date('2024-04-11'),
    checkOut: new Date('2024-04-15'),
    roomName: 'Torch Lake',
  },
  {
    id: '23',
    guestName: 'Lucas Brown',
    checkIn: new Date('2024-04-12'),
    checkOut: new Date('2024-04-16'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '24',
    guestName: 'Olivia Davis',
    checkIn: new Date('2024-04-13'),
    checkOut: new Date('2024-04-17'),
    roomName: 'Clam Lake',
  },
  {
    id: '25',
    guestName: 'William Turner',
    checkIn: new Date('2024-04-14'),
    checkOut: new Date('2024-04-18'),
    roomName: 'Torch Lake',
  },
  {
    id: '26',
    guestName: 'Sophia Rodriguez',
    checkIn: new Date('2024-04-15'),
    checkOut: new Date('2024-04-19'),
    roomName: 'Lake Skegemog',
  },
  {
    id: '27',
    guestName: 'Ethan Wright',
    checkIn: new Date('2024-04-16'),
    checkOut: new Date('2024-04-20'),
    roomName: 'Clam Lake',
  },
];

export function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const itemsPerPage = 10;

  useEffect(() => {
    async function loadBookings() {
      try {
        // const data = await getBookings();
        setBookings(initialBookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  const filteredAndSortedBookings = [...initialBookings]
    .filter((booking) =>
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.guestName.localeCompare(b.guestName);
        case 'checkIn':
          return a.checkIn.getTime() - b.checkIn.getTime();
        case 'checkOut':
          return a.checkOut.getTime() - b.checkOut.getTime();
        case 'room':
          return a.roomName.localeCompare(b.roomName);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage);
  const paginatedBookings = filteredAndSortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const handleNewBooking = async (data: any) => {
  //   try {
  //     const newBooking = await createBooking({
  //       guestName: data.guestName,
  //       checkIn: new Date(data.checkIn),
  //       checkOut: new Date(data.checkOut),
  //       roomName: data.roomName,
  //     });
  //     setBookings([...bookings, newBooking]);
  //   } catch (error) {
  //     console.error('Error creating booking:', error);
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Nav />
      <div className='container mx-auto py-10'>
        <div className='mb-8 space-y-4'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Bookings Dashboard
          </h1>
          <div className='flex gap-4'>
            <Input
              placeholder='Search by name'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='max-w-xs'
            />
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Sort by Name</SelectItem>
                <SelectItem value='checkIn'>Sort by Check In</SelectItem>
                <SelectItem value='checkOut'>Sort by Check Out</SelectItem>
                <SelectItem value='room'>Sort by Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <BookingTable bookings={paginatedBookings} />
        <div className='mt-4 flex items-center justify-between'>
          <p className='text-sm text-gray-500'>
            Showing {paginatedBookings.length} of{' '}
            {filteredAndSortedBookings.length} bookings
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
