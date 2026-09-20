import {Separator} from '@/components/ui/separator';
import ServerNameAndAction from './server-name-and-action';
import {dummyTextChannels, dummyVoiceChannels} from './helper';
import {ScrollArea} from '@/components/ui/scroll-area';
import Channel from './channel/channel';
import {useServerByName} from '@/api/server/api';
import {useParams} from 'react-router';
import {useChannelSideBar} from '@/store/server-store';
import {useEffect} from 'react';

const ChannelSidebar = () => {
  const {serverName} = useParams<{serverName: string}>();
  const {setChannelSideBar} = useChannelSideBar();
  // TODO : Make it With channel api get Server Type
  // GetChannels and GetServerByName ib Same Api
  const {data, isFetched, isError} = useServerByName(serverName, {select: res => res.data.data});
  useEffect(() => {
    if (isFetched && data && !isError) {
      setChannelSideBar({
        type: 'server',
        role: data.userSevers[0].role,
        channelSideBar: {
          id: data?.id,
          name: data.name
        }
      });
    } else if (!serverName) {
      setChannelSideBar({
        type: 'direct-message',
        channelSideBar: {
          name: 'Jalsa'
        }
      });
    }
  }, [data, isError, isFetched, serverName, setChannelSideBar]);

  return (
    <div className='w-50 h-full flex flex-col bg-primary-2'>
      <ServerNameAndAction />
      <Separator />
      <ScrollArea className='p-3 h-full'>
        <Channel type='text' channels={dummyTextChannels} />
        <Channel type='voice' channels={dummyVoiceChannels} />
        <div className='h-10 w-full' />
      </ScrollArea>
    </div>
  );
};

export default ChannelSidebar;
