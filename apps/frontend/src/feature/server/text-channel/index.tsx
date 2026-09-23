import {useChannelMessages} from '@/api/channel-message/api';
import EmptyChannelPage from '@/components/empty-channel-page';
import ChannelTextInput from '@/components/server/channel/channel-text-input';
import {useHeader} from '@/store/header-store';
import {useChannel} from '@/store/use-channel';
import {useEffect} from 'react';
import {useParams} from 'react-router';
import AllMessage from '../components/message';

const TextChannelPage = () => {
  const params = useParams<{channelName: string; serverId: string}>();
  const title = params.channelName || '';
  const {setHeader} = useHeader();
  const {channel} = useChannel();
  const {data: messages} = useChannelMessages(channel.id, {select: res => res.data.data});

  useEffect(() => {
    setHeader({title: title, type: 'text'});
  }, [setHeader, title]);
  return (
    <div className='relative px-4 h-full pb-20'>
      {messages?.length == 0 ? <EmptyChannelPage title={title} /> : <AllMessage messages={messages || []} />}
      <ChannelTextInput placeholder={`Message #${title}`} />
    </div>
  );
};

export default TextChannelPage;
