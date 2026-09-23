import {Button} from '@/components/ui/button';
import type {TChannel, TChannelType} from '../type';
import {IconChevronDown} from '@tabler/icons-react';
import {cn} from 'cn';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import ChannelName from './components/channel-name';
import {ChannelSetting} from './components/channel-setting';
import {useHeader} from '@/store/header-store';
import {channelMapper} from '../helper';
import {useChannelSideBar} from '@/store/server-store';
import {useChannel} from '@/store/use-channel';

interface TChannelProps {
  type: TChannelType;
  channels: TChannel[];
}
const Channel = ({type, channels}: TChannelProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const {setHeader} = useHeader();
  const {setChannel} = useChannel();
  const {serverName, channelName} = useParams<{serverName: string; channelName: string}>();
  const {channelSideBar} = useChannelSideBar();
  function onClick(title: string, type: TChannelType) {
    setHeader({title, type});
    navigate(`/server/${serverName}/${title}`);
  }
  const channelMap = channelMapper[type];
  const role = channelSideBar.role;
  // Set Channel Data to store to use in any place
  useEffect(() => {
    const currentChannel = channels.find(val => {
      return val.title == channelName;
    });
    if (currentChannel) {
      setChannel({
        id: currentChannel.id,
        name: currentChannel.title,
        type
      });
    }
  }, [channelName, channels, type]);
  return (
    <div className='mb-5'>
      <div onClick={() => setOpen(pre => !pre)} className='cursor-pointer px-2 text-text-1 hover:text-inherit select-none flex items-center'>
        <h3 className='text-xs'>{channelMap.title}</h3>
        <IconChevronDown size={15} stroke={2} className={cn(!open && '-rotate-90')} />
      </div>
      {open && (
        <div className='flex flex-col mt-1'>
          {channels.map(channel => (
            <Button key={channel.id} onClick={() => onClick(channel.title, type)} variant={'ghost'} size={'lg'} className={cn('group select-none text-text-1 justify-start p-2 text-sm', channelName == channel.title && 'bg-muted text-foreground')}>
              <channelMap.icon className='min-w-5 min-h-5' />
              <ChannelName title={channel.title} isOpen={channel.title == channelName} />
              {channel.title !== 'general' && role !== 'MEMBER' && <ChannelSetting channelId={channel.id} role='OWNER' isOpen={channel.title == channelName} />}{' '}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;
