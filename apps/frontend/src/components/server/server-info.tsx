import {IconLock, IconLockOpen, IconUsers} from '@tabler/icons-react';

import {formatText} from '@/lib/utils';

import {Skeleton} from '../ui/skeleton';
import {Badge} from '../ui/badge';

type ServerInfoProps = {
  name?: string;
  description?: string;
  avatarUrl?: string;
  isPublic?: boolean;
  isLoading?: boolean;
};

const ServerInfo = ({name, description, avatarUrl, isPublic = false, isLoading = false}: ServerInfoProps) => {
  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-2'>
        <IconUsers className='size-5' />
        <h3 className='font-semibold'>Server Information</h3>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <Skeleton className='size-20 rounded-xl' />

            <div className='flex-1 space-y-2'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-64' />
            </div>
          </div>

          <Skeleton className='h-16 w-full' />
        </div>
      ) : (
        <div className='space-y-5'>
          <div className='flex items-center gap-4'>
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className='size-20 shrink-0 rounded-xl object-cover' />
            ) : (
              <div className='flex size-20 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-2xl font-semibold uppercase'>
                {formatText(name || '', {
                  mode: 'first-letter-of-words'
                })}
              </div>
            )}

            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <h4 className='truncate text-lg font-semibold'>{name || 'Unnamed Server'}</h4>

                <Badge variant='outline' className='shrink-0 gap-1'>
                  {isPublic ? <IconLockOpen className='size-3' /> : <IconLock className='size-3' />}
                  {isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>

              <p className='text-sm text-muted-foreground'>{description || 'No description'}</p>
            </div>
          </div>

          <div className='space-y-1'>
            <p className='text-sm font-medium'>Description</p>

            <p className='rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground'>{description || 'No description'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerInfo;
