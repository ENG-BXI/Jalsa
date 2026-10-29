import {IconCheck, IconUsers} from '@tabler/icons-react';

import {Button} from '@/components/ui/button';

import type {TPublicServersResponse} from '@/api/server/type';
import JoinServerForm from './join-server-form';
import {useAppDialog} from '@/store/dialog-store';
import {useAddUserToServer} from '@/api/server/api';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';

type PublicServerCardProps = {
  server: TPublicServersResponse['data'][number];
  isJoin: boolean;
};

const PublicServerCard = ({ server, isJoin }: PublicServerCardProps) => {
  const {dialog, setDialog, onClose} = useAppDialog();
  const navigate = useNavigate();
  const {mutate: joinToServer, isPending} = useAddUserToServer();
  const handleJoinServer = () => {
    setDialog({
      title: 'Join Server',
      description: 'You are about to join this community.',
      content: <JoinServerForm server={server} />,
      primaryAction: {
        text: 'Join',
        className: 'min-w-24',
        onClick: () => {
          joinToServer(
            {id: server.id},
            {
              onSuccess: ({data}) => {
                const serverName = data.data.server.name;
                onClose();
                navigate(`/server/${serverName}`);
              }
            }
          );
        }
      },
      secondaryAction: {
        text: 'Cancel'
      }
    });
  };
  useEffect(() => {
    if (!dialog) return;
    setDialog({
      ...dialog,
      primaryAction: {
        ...dialog.primaryAction,
        text: isPending ? 'Joining' : 'Join',
        disabled: isPending
      },
      secondaryAction: {
        ...dialog.secondaryAction,
        text: dialog.secondaryAction?.text || '',
        disabled: isPending
      }
    });
  }, [isPending]);
  return (
    <article className='group overflow-hidden rounded-xl border border-border-1 bg-primary-1'>
      <div className='h-24 bg-primary-3' />

      <div className='relative px-5 pb-5'>
        <div className='-mt-10 mb-3'>{server.avatar_url ? <img src={server.avatar_url} alt={server.name} className='size-20 rounded-2xl border-4 border-primary-1 object-cover' /> : <div className='flex size-20 items-center justify-center rounded-2xl border-4 border-primary-1 bg-primary-3 text-2xl font-bold uppercase text-white'>{server.name.charAt(0)}</div>}</div>

        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <h3 className='truncate text-lg font-semibold text-white'>{server.name}</h3>

            <p className='mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-text-1'>{server.description || 'No description available.'}</p>
          </div>

          <Button onClick={handleJoinServer} size='sm' variant={isJoin ? 'outline' : 'secondary'} disabled={isJoin} className='shrink-0'>
            {isJoin ? (
              <>
                <IconCheck data-icon='inline-start' />
                Joined
              </>
            ) : (
              'Join'
            )}
          </Button>
        </div>

        <div className='mt-4 flex items-center gap-1.5 text-xs text-text-1'>
          <IconUsers className='size-4' />
          <span>{server.memberCount.toLocaleString()} Members</span>
        </div>
      </div>
    </article>
  );
};

export default PublicServerCard;
