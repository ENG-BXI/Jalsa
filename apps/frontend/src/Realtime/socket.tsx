import {useMe} from '@/api/auth/api';
import {env} from '@/lib/env';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const socket = io(env.BACKEND_URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: cb => cb({token: cookie.get('token')})
});

export function useSocketSetup() {
  const {data: userId} = useMe({
    select: res => res.data.data.id
  });

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
       console.log('====================================');
       console.log('Connnecteng', socket.connected);
       console.log('====================================');
      setIsConnected(true);
    }
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = (err: Error) => console.error('Socket connection failed:', err.message);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.disconnect();
    };
  }, [userId]);

  return isConnected;
}
