import { NewBookingDialog } from '../new-booking-dialog';
import Link from 'next/link';

export function Nav({ onNewBooking }: { onNewBooking: (data: any) => void }) {
  return (
    <nav className='border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <Link
          href='/'
          className='font-semibold'
        >
          Booking Dashboard
        </Link>
        <NewBookingDialog onSubmit={onNewBooking} />
      </div>
    </nav>
  );
}
