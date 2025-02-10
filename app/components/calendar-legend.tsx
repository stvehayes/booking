export function CalendarLegend() {
  return (
    <div className='flex gap-4 text-sm text-gray-600'>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 bg-blue-100 border border-blue-200 rounded'></div>
        <span>Booked</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 bg-green-100 border border-green-200 rounded'></div>
        <span>Check-in</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 bg-orange-100 border border-orange-200 rounded'></div>
        <span>Check-out</span>
      </div>
    </div>
  );
}
