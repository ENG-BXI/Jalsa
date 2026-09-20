import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const PublicServerCardSkeleton = () => {
  return (
    <Card className='border-border-1 bg-primary-1'>
      <CardHeader className='flex-row items-center gap-4 space-y-0'>
        <Skeleton className='size-16 shrink-0 rounded-2xl' />

        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-24' />
        </div>
      </CardHeader>

      <CardContent className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-4/5' />
      </CardContent>

      <CardFooter>
        <Skeleton className='h-9 w-full' />
      </CardFooter>
    </Card>
  );
};

export default PublicServerCardSkeleton;
