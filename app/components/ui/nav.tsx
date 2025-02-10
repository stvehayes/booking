import { NewBookingDialog } from '../new-booking-dialog';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavProps {
  onNewBooking: (data: NewBookingFormData) => Promise<void>;
}

export function Nav({ onNewBooking }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className='border-b'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link
            href='/'
            className='font-semibold'
          >
            Booking Dashboard
          </Link>
          <Tabs defaultValue={pathname === '/' ? 'reservations' : 'front-desk'}>
            <TabsList className='bg-transparent'>
              <TabsTrigger
                value='reservations'
                onClick={() => router.push('/')}
                className={cn(
                  'data-[state=active]:bg-transparent data-[state=active]:shadow-none h-16 -mb-[2px]',
                  pathname === '/' && 'border-b-2 border-gray-900'
                )}
              >
                Reservations
              </TabsTrigger>
              <TabsTrigger
                value='front-desk'
                onClick={() => router.push('/front-desk')}
                className={cn(
                  'data-[state=active]:bg-transparent data-[state=active]:shadow-none h-16 -mb-[2px]',
                  pathname === '/front-desk' && 'border-b-2 border-gray-900'
                )}
              >
                Front Desk
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <NewBookingDialog onSubmit={onNewBooking} />
      </div>
    </nav>
  );
}
