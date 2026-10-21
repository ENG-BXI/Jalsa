import {useEffect} from 'react';
import {socket} from '../socket';
import {SERVER_EVENT} from './server-event';

export function useServerEvent() {}

export function useServerJoin(serverId?: string) {
  useEffect(() => {
    if (serverId) socket.emit(SERVER_EVENT.JOIN_SERVER, serverId);
    return () => {
      socket.emit(SERVER_EVENT.LEAVE_SERVER, serverId);
    };
  }, [serverId]);
}
