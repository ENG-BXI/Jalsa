import {Separator} from '@/components/ui/separator';
import ServerNameAndAction from './server-name-and-action';
import {ScrollArea} from '@/components/ui/scroll-area';
import Channel from './channel/channel';
import {useParams} from 'react-router';
import {useChannelSideBar} from '@/store/server-store';
import {useEffect} from 'react';
import {useGetAllChannel} from '@/api/channel/api';
import type {TChannel} from './type';
import ChannelSkeleton from './channel/components/channel-skeleton';
import {useGetAllDMMember} from '@/api/direct-message/api';
import Members from './dm-member-sidebar';

const ChannelSidebar = () => {
  const {serverName} = useParams<{serverName: string}>();
  const {setChannelSideBar} = useChannelSideBar();
  const {data: channelsData, isFetched, isError, isLoading} = useGetAllChannel(serverName, {enabled: !!serverName, select: res => res.data.data});
  const {data: dmMembers, isLoading: isDmMemberLoading} = useGetAllDMMember({enabled: !serverName, select: res => res.data.data});
  const server = channelsData?.server;
  const textChannels: TChannel[] = [];
  const voiceChannels: TChannel[] = [];
  channelsData?.channels?.forEach(channel => {
    if (channel.type == 'TEXT') {
      textChannels.push(channel);
    } else voiceChannels.push(channel);
  });
  useEffect(() => {
    if (isFetched && server && !isError) {
      setChannelSideBar({
        type: 'server',
        role: server.userSevers[0].role,
        channelSideBar: {
          serverId: server.id,
          serverName: server.name
        }
      });
    } else if (!serverName) {
      setChannelSideBar({
        type: 'direct-message',
        channelSideBar: {
          serverName: 'Jalsa'
        }
      });
    }
  }, [channelsData, isError, isFetched, serverName, setChannelSideBar]);

  return (
    <div className='w-50 h-full flex flex-col bg-primary-2'>
      <ServerNameAndAction />
      <Separator />
      <ScrollArea className='p-3 h-full'>
        {serverName && (
          <>
            {isLoading ? <ChannelSkeleton /> : <Channel type='text' channels={textChannels} />}
            {isLoading ? <ChannelSkeleton /> : voiceChannels.length > 0 && <Channel type='voice' channels={voiceChannels} />}
          </>
        )}
        {!serverName && <>{isDmMemberLoading ? <ChannelSkeleton /> : <Members members={dmMembers || []} />}</>}
        <div className='h-10 w-full' />
      </ScrollArea>
    </div>
  );
};

export default ChannelSidebar;
