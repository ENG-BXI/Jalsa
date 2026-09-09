import EmptyChannelPage from '@/components/empty-channel-page';
import ChannelTextInput from '@/components/server/channel/channel-text-input';
import {useHeader} from '@/store/header-store';
import {useEffect} from 'react';
import {useParams} from 'react-router';

const TextChannelPage = () => {
  const params = useParams<{channelName: string; serverId: string}>();
  const title = params.channelName || '';
  const {setHeader} = useHeader();
  useEffect(() => {
    setHeader({title: title, type: 'text'});
  }, [setHeader, title]);
  // Check if Channel is Empty
  const isEmpty = true;
  return (
    <div className='relative px-4 h-full pb-20'>
      {isEmpty ? <EmptyChannelPage title={title} /> : 'TextChannelPage'}
      <ChannelTextInput placeholder={`Message #${title}`} />
    </div>
  );
};

export default TextChannelPage;
