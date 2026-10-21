import {useEffect} from 'react';
import {socket} from '../socket';
import {CHANNEL_EVENT} from './channel.event';
import {queryClient} from '@/api/instance';
import {CHANNEL_KEY} from '@/api/channel/api';
import type {TServerChannelTransformDto} from '@/api/channel/transform';
import type {TCreateChannelResponse} from '@/api/channel/type';
import {transformChannelData} from './transform';
import type {AxiosResponse} from 'axios';
import type {TResponse} from '@/api/type';

export function useChannelEvent(serverName: string) {
  useEffect(() => {
    const onCreateChannel = (data: TCreateChannelResponse) => {
      queryClient.setQueryData([...CHANNEL_KEY, serverName], (oldData: AxiosResponse<TResponse<TServerChannelTransformDto>>): AxiosResponse<TResponse<TServerChannelTransformDto>> => {
        if (!oldData) queryClient.invalidateQueries({queryKey: [...CHANNEL_KEY, serverName], exact: false});

        if (oldData.data.data.channels.find(channel => channel.id === data.id)) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              server: oldData.data.data.server,
              channels: [...oldData.data.data.channels, ...transformChannelData(data)]
            }
          }
        };
      });
    };

    socket.on(CHANNEL_EVENT.CREATE_CHANNEL, onCreateChannel);

    return () => {
      socket.off(CHANNEL_EVENT.CREATE_CHANNEL, onCreateChannel);
    };
  }, [serverName]);
}
