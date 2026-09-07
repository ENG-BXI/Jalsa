import {Button} from '@/components/ui/button';
import type {TChannel} from '../type';
import {IconChevronDown, IconHash} from '@tabler/icons-react';
import {cn} from 'cn';
import {useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import ChannelName from './components/channel-name';
import {InviteChannelButton} from './components/invite-channel-button';

interface TTextChannelProps {
  channels: TChannel[];
}
const TextChannel = ({channels}: TTextChannelProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const {serverId, channelName} = useParams<{serverId: string; channelName: string}>();
  return (
    <div>
      <div onClick={() => setOpen(pre => !pre)} className='cursor-pointer px-2 text-text-1 hover:text-inherit select-none flex items-center'>
        <h3 className='text-xs'>Text Channels</h3>
        <IconChevronDown size={15} stroke={2} className={cn(!open && '-rotate-90')} />
      </div>
      {open && (
        <div className='flex flex-col mt-1'>
          {channels.map(channel => (
            <Button onClick={() => navigate(`/server/${serverId}/${channel.title}`)} variant={'ghost'} className={cn('group text-text-1 justify-start p-2 text-sm', channelName == channel.title && 'bg-muted text-foreground')}>
              <IconHash className='min-w-5 min-h-5' />
              <ChannelName title={channel.title} isOpen={channel.title == channelName} />
              <InviteChannelButton isOpen={channel.title == channelName} />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextChannel;
