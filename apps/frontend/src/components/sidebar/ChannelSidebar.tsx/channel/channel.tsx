import {Button} from '@/components/ui/button';
import type {TChannel, TChannelType} from '../type';
import {IconChevronDown} from '@tabler/icons-react';
import {cn} from 'cn';
import {useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import ChannelName from './components/channel-name';
import {InviteChannelButton} from './components/invite-channel-button';
import {useHeader} from '@/store/header-store';
import {channelMapper} from '../helper';
import {useAppDialog} from '@/store/dialog-store';
import InviteFriendDialog from '@/components/server/invite-friend-dialog';

interface TChannelProps {
  type: TChannelType;
  channels: TChannel[];
}
const Channel = ({type, channels}: TChannelProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const {setDialog} = useAppDialog();
  const {setHeader} = useHeader();
  const {serverName, channelName} = useParams<{serverName: string; channelName: string}>();
  function onClick(title: string, type: TChannelType) {
    setHeader({title, type});
    navigate(`/server/${serverName}/${title}`);
  }
  const channelMap = channelMapper[type];
  // TODO: Make A Solution to generate a Link
  const BaseLink = 'https://jalsa-domain/invite';
  function onClickInvite(link: string) {
    setDialog({
      title: {
        title: 'Invite Friends',
        className: 'text-center'
      },

      description: {
        description: 'Invite your friends to join your server and grow your community.',
        className: 'text-center'
      },

      content: <InviteFriendDialog inviteLink={link} />
    });
  }
  return (
    <div className='mb-5'>
      <div onClick={() => setOpen(pre => !pre)} className='cursor-pointer px-2 text-text-1 hover:text-inherit select-none flex items-center'>
        <h3 className='text-xs'>{channelMap.title}</h3>
        <IconChevronDown size={15} stroke={2} className={cn(!open && '-rotate-90')} />
      </div>
      {open && (
        <div className='flex flex-col mt-1'>
          {channels.map(channel => (
            <Button onClick={() => onClick(channel.title, type)} variant={'ghost'} size={'lg'} className={cn('group select-none text-text-1 justify-start p-2 text-sm', channelName == channel.title && 'bg-muted text-foreground')}>
              <channelMap.icon className='min-w-5 min-h-5' />
              <ChannelName title={channel.title} isOpen={channel.title == channelName} />
              <InviteChannelButton onClick={() => onClickInvite(`${BaseLink}/${serverName}/${channelName}`)} isOpen={channel.title == channelName} />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;
