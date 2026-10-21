import {useEffect} from 'react';
import {socket} from '../socket';

export function useServerEvent() {}

export function useServerJoin(serverId?: string) {
  useEffect(() => {
    if (serverId) socket.emit('server:join', serverId);
    return () => {
      socket.emit('server:leave', serverId);
    };
  }, [serverId]);
}
