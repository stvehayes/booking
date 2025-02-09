'use client';

import { useState } from 'react';
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

interface NewBookingFormData {
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
}

export function NewBookingDialog({
  onSubmit,
}: {
  onSubmit: (data: NewBookingFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewBookingFormData>({
    guestName: '',
    checkIn: '',
    checkOut: '',
    roomName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    setFormData({ guestName: '', checkIn: '', checkOut: '', roomName: '' });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant='default'>New Booking</Button>
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
            <Label htmlFor='guestName'>Guest Name</Label>
            <Input
              id='guestName'
              value={formData.guestName}
              onChange={(e) =>
                setFormData({ ...formData, guestName: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='checkIn'>Check In Date</Label>
            <Input
              id='checkIn'
              type='date'
              value={formData.checkIn}
              onChange={(e) =>
                setFormData({ ...formData, checkIn: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='checkOut'>Check Out Date</Label>
            <Input
              id='checkOut'
              type='date'
              value={formData.checkOut}
              onChange={(e) =>
                setFormData({ ...formData, checkOut: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='roomName'>Room</Label>
            <Select
              value={formData.roomName}
              onValueChange={(value) =>
                setFormData({ ...formData, roomName: value })
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a room' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Torch Lake'>Torch Lake</SelectItem>
                <SelectItem value='Lake Skegemog'>Lake Skegemog</SelectItem>
                <SelectItem value='Clam Lake'>Clam Lake</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Add Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
