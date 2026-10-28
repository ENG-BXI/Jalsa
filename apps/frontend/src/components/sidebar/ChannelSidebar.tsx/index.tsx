import {Separator} from '@/components/ui/separator';
import ServerNameAndAction from './server-name-and-action';
import {ScrollArea} from '@/components/ui/scroll-area';
import Channel from './channel/channel';
import {useNavigate, useParams} from 'react-router';
import {useChannelSideBar} from '@/store/server-store';
import {useEffect, useMemo} from 'react';
import {useGetAllChannel} from '@/api/channel/api';
import type {TChannel} from './type';
import ChannelSkeleton from './channel/components/channel-skeleton';
import {useGetAllDMMember} from '@/api/direct-message/api';
import Members from './dm-member-sidebar';
import {useChannelEvent} from '@/Realtime/channel/use-channel-event';
import {useServerEvent, useServerJoin} from '@/Realtime/server/use-server-event';
import useSideBar from '@/hooks/use-side-bar';
import type {TGetAllDMMember} from '@/api/direct-message/type';
import {cn} from 'cn';
import {useChannel} from '@/store/use-channel';
const ChannelSidebar = () => {
  const {serverName, channelName} = useParams<{serverName: string; channelName: string}>();
  const {setChannelSideBar} = useChannelSideBar();
  const {data: channelsData, isFetched, isError, isLoading} = useGetAllChannel(serverName, {enabled: !!serverName, select: res => res.data.data});
  const {data: dmMembers, isLoading: isDmMemberLoading} = useGetAllDMMember({enabled: !serverName, select: res => res.data.data});
  const server = channelsData?.server;
  const params = useParams<{channelName: string; serverName: string}>();
  const navigate = useNavigate();
  const {hideSideBar} = useSideBar();
  const {setChannel} = useChannel();
  // Loop through the channels and separate them into text and voice channels
  const {textChannels, voiceChannels} = useMemo(() => {
    const textChannels: TChannel[] = [];
    const voiceChannels: TChannel[] = [];
    if (!serverName || !channelsData?.channels || isError) {
      return {textChannels, voiceChannels};
    }
    if (channelsData?.channels || isFetched || !isError) {
      channelsData.channels.forEach(channel => {
        if (channel.type === 'TEXT') {
          textChannels.push(channel);
        } else {
          voiceChannels.push(channel);
        }
      });
    }

    return {textChannels, voiceChannels};
  }, [serverName, channelsData, channelsData?.channels, isError, isFetched]);
  // Real-time event listeners for server events
  useServerJoin(server?.id);
  useChannelEvent(serverName || '');
  useServerEvent(server?.id, {
    onEdit: data => {
      setChannelSideBar({
        type: 'server',
        role: server?.userSevers[0].role,
        channelSideBar: {
          serverId: data.id,
          serverName: data.name
        }
      });
      navigate(`server/${data.name}/${params.channelName}`);
    },
    onDelete: () => {
      navigate(`/direct-message`);
    },
    onKick: () => {
      navigate(`/direct-message`);
    },
    onChangeRole: data => {
      setChannelSideBar({
        type: 'server',
        role: data.role,
        channelSideBar: {
          serverId: data.id,
          serverName: serverName || ''
        }
      });
    }
  });
  // Set Channel Data to store to use in any place
  useEffect(() => {
    const currentChannel = channelsData?.channels.find(val => {
      return val.title == channelName;
    });
    if (currentChannel) {
      setChannel({
        id: currentChannel.id,
        name: currentChannel.title,
        type: currentChannel.type == 'TEXT' ? 'text' : 'voice'
      });
    }
  }, [channelName, channelsData?.channels]);

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

  if (hideSideBar) {
    return <div />;
  }

  return <ChannelSideBarItem serverName={serverName} isLoading={isLoading} textChannels={textChannels} voiceChannels={voiceChannels} dmMembers={dmMembers} isDmMemberLoading={isDmMemberLoading} />;
};

export default ChannelSidebar;
interface ChannelSideBarItemProps {
  serverName?: string;
  isLoading?: boolean;
  textChannels: TChannel[];
  voiceChannels: TChannel[];
  dmMembers?: TGetAllDMMember[];
  isDmMemberLoading?: boolean;
}
function ChannelSideBarItem({serverName, isLoading, textChannels, voiceChannels, dmMembers, isDmMemberLoading}: ChannelSideBarItemProps) {
  const {isMobile, isMessagesPage} = useSideBar();
  return (
    <div className={cn('w-50 min-h-full flex flex-col', isMobile && !isMessagesPage && 'w-full')}>
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
}
