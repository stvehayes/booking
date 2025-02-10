'use client';

import { NewBookingFormData } from '@/types/new-booking-form-data';
import { Nav } from './ui/nav';

interface LayoutProps {
  children: React.ReactNode;
  onNewBooking?: (data: NewBookingFormData) => Promise<void>;
}

export function Layout({ children, onNewBooking }: LayoutProps) {
  return (
    <>
      <Nav onNewBooking={onNewBooking!} />
      <div className='container mx-auto py-10'>{children}</div>
    </>
  );
}
