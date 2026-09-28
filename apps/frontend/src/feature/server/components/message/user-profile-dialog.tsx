import {IconMessageCircle} from '@tabler/icons-react';
import {Button} from '@/components/ui/button';
import {formatDate, formatText} from '@/lib/utils';
import {useUser} from '@/store/user-info-store';

interface UserProfileDialogProps {
  user: {name: string; userName: string; jointAt: string};
  onMessage: () => void;
}

const UserProfileDialog = ({user, onMessage}: UserProfileDialogProps) => {
  const {user: currentUser} = useUser();
  const isCurrentUser = currentUser?.userName === user.userName;

  return (
    <div className='w-full overflow-hidden rounded-xl bg-primary-1'>
      <div className='h-24 bg-primary-3' />

      <div className='px-5 pb-5'>
        <div className='relative -mt-10 mb-4 flex items-end justify-between'>
          <div className='relative flex size-20 items-center justify-center rounded-full border-4 border-primary-1 bg-primary-3 text-2xl font-bold uppercase text-white'>{formatText(user.userName, {mode: 'first-letter-of-words'})}</div>

          {isCurrentUser ? (
            <div className='flex h-8 items-center rounded-md border border-border-1 bg-primary-3/30 px-3 text-xs font-medium text-text-1'>This is you</div>
          ) : (
            <Button onClick={onMessage} size='sm' className='gap-2'>
              <IconMessageCircle size={16} />
              Message
            </Button>
          )}
        </div>

        <div className='mb-5'>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold text-white'>{user.name}</h2>
            {isCurrentUser && <span className='rounded bg-primary-3 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white'>YOU</span>}
          </div>
          <p className='text-sm text-text-1'>@{user.userName}</p>
        </div>

        <div className='rounded-lg border border-border-1 bg-primary-3/30 p-4'>
          <h3 className='text-xs font-semibold uppercase tracking-wider text-text-1'>Member Since</h3>
          <p className='mt-1 text-sm font-medium text-white'>{formatDate(user.jointAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDialog;
