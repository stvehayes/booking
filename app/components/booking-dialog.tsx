'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Reservation } from '@/types/reservation';
import { deleteBooking, updateBooking } from '@/lib/bookings';
import { format, parseISO, startOfDay } from 'date-fns';

interface BookingDialogProps {
  booking: Reservation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingUpdated: () => void;
}

export function BookingDialog({
  booking,
  open,
  onOpenChange,
  onBookingUpdated,
}: BookingDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(booking);

  const handleDelete = async () => {
    try {
      await deleteBooking(booking.id);
      onBookingUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedBooking = {
        ...formData,
        check_in: startOfDay(
          new Date(formData.check_in + 'T00:00:00')
        ).toISOString(),
        check_out: startOfDay(
          new Date(formData.check_out + 'T00:00:00')
        ).toISOString(),
      };
      await updateBooking(updatedBooking);
      onBookingUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  if (isDeleting) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>Are you sure you want to delete this booking?</p>
            <p className='text-sm text-gray-500'>
              This action cannot be undone. This will permanently delete the
              booking for {booking.first_name} {booking.last_name}.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleting(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isEditing) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='first_name'>First Name</Label>
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
              <Label htmlFor='last_name'>Last Name</Label>
              <Input
                id='last_name'
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='check_in'>Check In Date</Label>
              <Input
                id='check_in'
                type='date'
                value={format(parseISO(formData.check_in), 'yyyy-MM-dd')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    check_in: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='check_out'>Check Out Date</Label>
              <Input
                id='check_out'
                type='date'
                value={format(parseISO(formData.check_out), 'yyyy-MM-dd')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    check_out: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='room_name'>Room</Label>
              <Select
                value={formData.room_name}
                onValueChange={(value) =>
                  setFormData({ ...formData, room_name: value })
                }
              >
                <SelectTrigger>
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
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='primary'
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Guest</h3>
            <p className='mt-1'>
              {booking.first_name} {booking.last_name}
            </p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Room</h3>
            <p className='mt-1'>{booking.room_name}</p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Check in</h3>
            <p className='mt-1'>
              {format(parseISO(booking.check_in), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Check out</h3>
            <p className='mt-1'>
              {format(parseISO(booking.check_out), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Season</h3>
            <p className='mt-1'>
              {booking.in_season ? 'In Season' : 'Off Season'}
            </p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Booking ID</h3>
            <p className='mt-1 font-mono text-sm'>{booking.id}</p>
          </div>
          <div>
            <h3 className='font-medium text-sm text-gray-500'>Created</h3>
            <p className='mt-1'>
              {new Date(booking.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
          <Button
            variant='destructive'
            onClick={() => setIsDeleting(true)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
