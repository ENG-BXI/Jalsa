import {useGetChannelById} from '@/api/channel/api';
import type {TChannelType} from '@/api/type';
import {useChannel} from '@/store/use-channel';
import type {ReactElement} from 'react';
import TextChannelPage from '../text-channel';
import VoiceChannelPage from '../voice-channel';

const ChannelRedirect: Record<TChannelType, () => ReactElement> = {
  TEXT: TextChannelPage,
  VOICE: VoiceChannelPage
};
const Index = () => {
  const {channel} = useChannel();
  const {data, isLoading} = useGetChannelById(channel.id, {select: data => data.data.data});
  const channelType = data?.type;
  if (isLoading) return <div>Loading...</div>;
  if (data && !isLoading && channelType) {
    const RenderPage = ChannelRedirect[channelType];
    return <RenderPage />;
  }
  return <div />;
};

export default Index;
