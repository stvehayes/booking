import { useState } from 'react';
import { Reservation } from '@/types/reservation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { TableSkeleton } from './ui/table-skeleton';
import { BookingDialog } from './booking-dialog';
import { format, parseISO } from 'date-fns';

interface BookingTableProps {
  bookings: Reservation[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBookingUpdated?: () => void;
  onSort: (column: string) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export function BookingTable({
  bookings,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onBookingUpdated,
  onSort,
  sortBy,
  sortDirection,
}: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBookingUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'
              onClick={() => onSort('first_name')}
            >
              First Name{' '}
              {sortBy === 'first_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'
              onClick={() => onSort('last_name')}
            >
              Last Name{' '}
              {sortBy === 'last_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'
              onClick={() => onSort('check_in')}
            >
              Check In{' '}
              {sortBy === 'check_in' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'
              onClick={() => onSort('check_out')}
            >
              Check Out{' '}
              {sortBy === 'check_out' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className='px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer hover:bg-gray-100'
              onClick={() => onSort('room_name')}
            >
              Room{' '}
              {sortBy === 'room_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            bookings.map((booking) => (
              <TableRow
                key={booking.id}
                onClick={() => {
                  setSelectedBooking(booking);
                  setDialogOpen(true);
                }}
                className='cursor-pointer hover:bg-gray-100'
              >
                <TableCell>{booking.first_name}</TableCell>
                <TableCell>{booking.last_name}</TableCell>
                <TableCell>
                  {format(parseISO(booking.check_in), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {format(parseISO(booking.check_out), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{booking.room_name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedBooking && (
        <BookingDialog
          booking={selectedBooking}
          open={!!selectedBooking}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
          onBookingUpdated={() => {
            setSelectedBooking(null);
            onBookingUpdated?.();
          }}
        />
      )}
    </>
  );
}
