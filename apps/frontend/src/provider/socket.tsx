import {useMe} from '@/api/auth/api';
import {env} from '@/lib/env';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Cookies from 'universal-cookie';

const cookie = new Cookies();
const socket = io(env.BACKEND_URL, {
  autoConnect: false,
  auth: {
    token: cookie.get('token')
  }
});

export function useSocketSetup() {
  const {data} = useMe({
    select: res => res.data.data
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!data?.id) return;

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [data?.id]);

  return isConnected;
}
