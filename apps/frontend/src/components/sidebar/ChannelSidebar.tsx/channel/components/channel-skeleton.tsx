import {Skeleton} from '@/components/ui/skeleton';

const ChannelSkeleton = () => {
  return (
    <div className='mb-5'>
      <div className='flex h-5 items-center gap-1.5 px-2'>
        <Skeleton className='size-3 rounded-sm' />
        <Skeleton className='h-3 w-20' />
      </div>

      <div className='mt-1.5 space-y-0.5'>
        {Array.from({length: 4}).map((_, index) => (
          <div key={index} className='flex h-9 items-center gap-2 rounded-md px-2'>
            <Skeleton className='size-5 shrink-0 rounded-md' />

            <Skeleton className={`h-3.5 ${index === 0 ? 'w-24' : index === 1 ? 'w-32' : index === 2 ? 'w-20' : 'w-28'}`} />

            <div className='ml-auto'>
              <Skeleton className='size-4 rounded-sm' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSkeleton;
