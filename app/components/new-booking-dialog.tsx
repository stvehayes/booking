'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { format, addDays, startOfDay, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';

interface NewBookingFormData {
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  room_name: string;
}

interface NewBookingDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDate?: Date | null;
  defaultRoom?: string | null;
  onSubmit: (data: NewBookingFormData) => Promise<void>;
}

type Duration = '1 night' | '3 nights' | '1 week';

const DURATION_DAYS: Record<Duration, number> = {
  '1 night': 1,
  '3 nights': 3,
  '1 week': 7,
};

export function NewBookingDialog({
  open,
  onOpenChange = () => {},
  defaultDate,
  defaultRoom,
  onSubmit,
}: NewBookingDialogProps) {
  const [formData, setFormData] = useState<NewBookingFormData>({
    first_name: '',
    last_name: '',
    check_in: format(new Date(), 'yyyy-MM-dd'),
    check_out: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    room_name: '',
  });
  const [selectedDuration, setSelectedDuration] = useState<Duration | ''>('');

  // Update form when defaultDate or defaultRoom changes
  useEffect(() => {
    if (defaultDate || defaultRoom) {
      setFormData((prev) => ({
        ...prev,
        check_in: defaultDate
          ? format(defaultDate, 'yyyy-MM-dd')
          : prev.check_in,
        check_out: defaultDate
          ? format(addDays(defaultDate, 1), 'yyyy-MM-dd')
          : prev.check_out,
        room_name: defaultRoom || prev.room_name,
      }));
    }
  }, [defaultDate, defaultRoom]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        first_name: '',
        last_name: '',
        check_in: format(new Date(), 'yyyy-MM-dd'),
        check_out: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        room_name: defaultRoom || '',
      });
      setSelectedDuration('');
    }
  }, [open, defaultRoom]);

  const updateCheckOutDate = (checkIn: Date, duration: Duration) => {
    const days = DURATION_DAYS[duration];
    return format(addDays(checkIn, days), 'yyyy-MM-dd');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onOpenChange(false);
      setFormData({
        first_name: '',
        last_name: '',
        check_in: format(new Date(), 'yyyy-MM-dd'),
        check_out: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        room_name: '',
      });
      setSelectedDuration('');
    } catch (error) {
      console.error('Failed to submit booking:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button variant='primary'>New Booking</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='first_name'>First name</Label>
            <Input
              id='first_name'
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='last_name'>Last name</Label>
            <Input
              id='last_name'
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
          </div>
          <div className='grid grid-cols-[1fr_auto] gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='check_in'>Check in</Label>
              <div className='relative'>
                <Input
                  id='check_in'
                  type='date'
                  value={formData.check_in}
                  onChange={(e) =>
                    setFormData({ ...formData, check_in: e.target.value })
                  }
                  required
                  className='pr-10'
                />
                <Calendar className='h-4 w-4 absolute right-3 top-3 text-gray-500' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Duration</Label>
              <Select
                value={selectedDuration}
                onValueChange={(value: Duration) => {
                  setSelectedDuration(value);
                  if (formData.check_in) {
                    const checkIn = parseISO(formData.check_in);
                    const checkOut = updateCheckOutDate(checkIn, value);
                    setFormData({ ...formData, check_out: checkOut });
                  }
                }}
              >
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder='Select'>
                    {selectedDuration}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1 night'>1 night</SelectItem>
                  <SelectItem value='3 nights'>3 nights</SelectItem>
                  <SelectItem value='1 week'>1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='check_out'>Check out</Label>
            <div className='relative'>
              <Input
                id='check_out'
                type='date'
                value={formData.check_out}
                onChange={(e) =>
                  setFormData({ ...formData, check_out: e.target.value })
                }
                required
                className='pr-10'
              />
              <Calendar className='h-4 w-4 absolute right-3 top-3 text-gray-500' />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='room_name'>Room</Label>
            <Select
              value={formData.room_name}
              onValueChange={(value) =>
                setFormData({ ...formData, room_name: value })
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a room' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Torch Lake'>Torch Lake</SelectItem>
                <SelectItem value='Lake Skegemog'>Lake Skegemog</SelectItem>
                <SelectItem value='Lake Bellaire'>Lake Bellaire</SelectItem>
                <SelectItem value='Elk Lake'>Elk Lake</SelectItem>
                <SelectItem value='Clam Lake'>Clam Lake</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end gap-4 mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
            >
              Create Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
