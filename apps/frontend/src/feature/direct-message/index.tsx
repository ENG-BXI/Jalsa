import {useHeader} from '@/store/header-store';
import {useEffect} from 'react';
import {useParams} from 'react-router';

const DirectMessagePage = () => {
  const params = useParams<{channelName: string; serverId: string}>();
  const title = params.channelName || '';
  const {setHeader} = useHeader();

  useEffect(() => {
    setHeader({title: title, type: 'text'});
  }, [setHeader, title]);
  return <div>{/* Empty Page */}</div>;
};

export default DirectMessagePage;
