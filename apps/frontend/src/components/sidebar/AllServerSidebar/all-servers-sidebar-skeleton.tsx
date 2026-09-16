import {Separator} from '@/components/ui/separator';
import {ScrollArea} from '../../ui/scroll-area';
import {Skeleton} from '@/components/ui/skeleton';

const AllServersSidebarSkeleton = () => {
  return (
    <div className='relative h-full bg-primary-2 w-min'>
      <ScrollArea className='h-full'>
        <div className='h-full flex flex-col flex-1 p-3'>
          <Skeleton className='size-10 rounded-lg' />

          <Separator className='mb-2 mt-2' />

          {Array.from({length: 15}).map((_, index) => (
            <Skeleton key={index} className='size-10 rounded-lg mb-2' />
          ))}

          <Skeleton className='size-10 rounded-lg mt-auto' />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AllServersSidebarSkeleton;
