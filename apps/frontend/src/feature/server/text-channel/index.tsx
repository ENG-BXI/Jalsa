import EmptyChannelPage from '@/components/empty-channel-page';
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
  return <div className='px-4 h-full'>{isEmpty ? <EmptyChannelPage title={title} /> : 'TextChannelPage'}</div>;
};

export default TextChannelPage;
