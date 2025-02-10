import { TableCell, TableRow } from './table';

export function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
          </TableCell>
          <TableCell>
            <div className='h-4 w-28 bg-gray-200 rounded animate-pulse' />
          </TableCell>
          <TableCell>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
          </TableCell>
          <TableCell>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
