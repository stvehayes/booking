'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  format,
  startOfWeek,
  startOfMonth,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Reservation } from '@/types/reservation';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingDialog } from './booking-dialog';
import { CalendarLegend } from './calendar-legend';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { NewBookingDialog } from './new-booking-dialog';
import { NewBookingFormData } from '../types/new-booking-form-data';
import { createBooking } from '@/lib/bookings';

type ViewType = 'day' | 'week' | 'month';

interface CalendarViewProps {
  bookings: Reservation[];
}

const ROOMS = [
  'Torch Lake',
  'Lake Skegemog',
  'Lake Bellaire',
  'Elk Lake',
  'Clam Lake',
];

export function CalendarView({
  bookings,
  onBookingsChange,
}: CalendarViewProps & {
  onBookingsChange?: () => void;
}) {
  const [viewType, setViewType] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState<Date>();
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBookingDialogOpen, setNewBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const dateRangeText = useMemo(() => {
    if (!currentDate) return '';

    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);

    if (format(start, 'MMM') === format(end, 'MMM')) {
      return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    } else {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  }, [currentDate]);

  useEffect(() => {
    setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 0 }));
  }, []);

  if (!currentDate) return null;

  const moveWeek = (direction: 'forward' | 'backward') => {
    setCurrentDate((prev) => {
      if (direction === 'forward') {
        return addWeeks(prev!, 1);
      } else {
        return addWeeks(prev!, -1);
      }
    });
  };

  const resetToToday = () => {
    setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 0 }));
  };

  const getDaysToShow = () => {
    switch (viewType) {
      case 'day':
        return [currentDate];
      case 'week':
        const weekStart = startOfWeek(currentDate);
        return [...Array(7)].map((_, i) => addDays(weekStart, i));
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const start = startOfWeek(monthStart);
        const end = endOfWeek(monthEnd);
        return eachDayOfInterval({ start, end });
    }
  };

  const days = getDaysToShow();
  const gridCols =
    viewType === 'day' ? 2 : viewType === 'week' ? 8 : days.length + 1;

  const getBookingStyle = (booking: Reservation, days: Date[]) => {
    const checkIn = parseISO(booking.check_in);
    const checkOut = parseISO(booking.check_out);
    const firstDay = days.findIndex((day) => isSameDay(day, checkIn));
    const lastDay = days.findIndex((day) =>
      isSameDay(addDays(checkOut, -1), day)
    );
    const duration = lastDay - firstDay + 1;

    return {
      gridColumn: `span ${duration}`,
      backgroundColor: '#EBF5FF',
      border: '1px solid #BEE3F8',
      borderRadius: '4px',
      margin: '2px 4px',
    };
  };

  const getBookingForDay = (room: string, day: Date) => {
    return bookings.find((booking) => {
      const checkIn = startOfDay(parseISO(booking.check_in));
      const checkOut = startOfDay(parseISO(booking.check_out));
      const currentDay = startOfDay(day);

      return (
        booking.room_name === room &&
        isWithinInterval(currentDay, {
          start: checkIn,
          end: checkOut, // Show the actual check-out date
        })
      );
    });
  };

  const getCellStyle = (booking: Reservation | undefined, day: Date) => {
    if (!booking) return 'hover:bg-gray-100 border-gray-200';

    const checkIn = startOfDay(parseISO(booking.check_in));
    const checkOut = startOfDay(parseISO(booking.check_out));
    const currentDay = startOfDay(day);

    if (isSameDay(currentDay, checkIn))
      return 'bg-green-100 hover:bg-green-200 border-[0.5px] border-green-200';
    if (isSameDay(currentDay, checkOut))
      // Show orange on actual check-out date
      return 'bg-orange-100 hover:bg-orange-200 border-[0.5px] border-orange-200';
    return 'bg-blue-100 hover:bg-blue-200 border-[0.5px] border-blue-200';
  };

  const handleNewBooking = async (data: NewBookingFormData) => {
    try {
      await createBooking(data);
      onBookingsChange?.();
      setNewBookingDialogOpen(false);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Select
          value={viewType}
          onValueChange={(value) => setViewType(value as ViewType)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='day'>Day</SelectItem>
            <SelectItem value='week'>Week</SelectItem>
            <SelectItem value='month'>Month</SelectItem>
          </SelectContent>
        </Select>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => moveWeek('backward')}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <div className='w-44 text-center text-sm text-gray-600'>
            {dateRangeText}
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={() => moveWeek('forward')}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='default'
            onClick={resetToToday}
            className='ml-2'
          >
            Today
          </Button>
        </div>
        <CalendarLegend />
      </div>

      <div className='border rounded-lg overflow-auto'>
        <div className='grid grid-cols-[150px_1fr]'>
          <div className='border-r'>
            <div className='h-[60px] p-4 font-medium text-gray-500 truncate border-b flex items-center'>
              Rooms
            </div>
            {ROOMS.map((room) => (
              <div
                key={room}
                className='h-[60px] p-4 font-medium border-b flex items-center whitespace-nowrap'
              >
                {room}
              </div>
            ))}
          </div>

          <div className='overflow-auto'>
            <div
              className='grid'
              style={{
                gridTemplateColumns: `repeat(${days.length}, minmax(120px, 1fr))`,
              }}
            >
              {/* Days header */}
              <div className='contents'>
                {days.map((day) => (
                  <div
                    key={day.toString()}
                    className={`h-[60px] p-4 text-center border-b border-r flex flex-col justify-center ${
                      isSameDay(day, new Date()) ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className='font-medium'>{format(day, 'EEE')}</div>
                    <div className='text-sm text-gray-500'>
                      {format(day, 'MMM d')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Room rows */}
              {ROOMS.map((room) => (
                <div
                  key={room}
                  className='contents'
                >
                  {days.map((day) => {
                    const booking = getBookingForDay(room, day);
                    const cellStyle = getCellStyle(booking, day);

                    return (
                      <TooltipProvider key={day.toString()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                min-h-[60px] border cursor-pointer
                                ${cellStyle}
                                transition-colors duration-200
                              `}
                              onClick={() => {
                                if (booking) {
                                  setSelectedBooking(booking);
                                  setDialogOpen(true);
                                } else {
                                  setSelectedDate(day);
                                  setSelectedRoom(room);
                                  setNewBookingDialogOpen(true);
                                }
                              }}
                            />
                          </TooltipTrigger>
                          {booking && (
                            <TooltipContent>
                              <div className='text-sm'>
                                <div className='font-medium'>
                                  {booking.first_name} {booking.last_name}
                                </div>
                                <div className='text-gray-500'>
                                  {format(parseISO(booking.check_in), 'MMM d')}{' '}
                                  -{' '}
                                  {format(
                                    parseISO(booking.check_out),
                                    'MMM d, yyyy'
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDialog
          booking={selectedBooking}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onBookingUpdated={() => {
            setDialogOpen(false);
            onBookingsChange?.();
          }}
        />
      )}

      <NewBookingDialog
        open={newBookingDialogOpen}
        onOpenChange={setNewBookingDialogOpen}
        defaultDate={selectedDate}
        defaultRoom={selectedRoom}
        onSubmit={handleNewBooking}
      />
    </div>
  );
}
