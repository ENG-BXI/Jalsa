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
import type {EditChannelEventResponse, TDeleteChannelEventResponse} from './type';

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
    const onEditChannel = (data: EditChannelEventResponse) => {
      queryClient.setQueryData([...CHANNEL_KEY, serverName], (oldData: AxiosResponse<TResponse<TServerChannelTransformDto>>): AxiosResponse<TResponse<TServerChannelTransformDto>> => {
        const oldChannel = oldData.data.data.channels.find(channel => channel.id === data.channelId);
        if (!oldChannel) return oldData;
        const newChannels = oldData.data.data.channels.map(channel => {
          if (channel.id === data.channelId) {
            return {
              id: data.channelId,
              title: data.data.name,
              type: data.data.type
            };
          } else return channel;
        });
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              server: oldData.data.data.server,
              channels: newChannels
            }
          }
        };
      });
    };
    const onDeleteChannel = (data: TDeleteChannelEventResponse) => {
      queryClient.setQueryData([...CHANNEL_KEY, serverName], (oldData: AxiosResponse<TResponse<TServerChannelTransformDto>>): AxiosResponse<TResponse<TServerChannelTransformDto>> => {
        const newChannels = oldData.data.data.channels.filter(channel => channel.id !== data.channelId);
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: {
              server: oldData.data.data.server,
              channels: newChannels
            }
          }
        };
      });
    };
    socket.on(CHANNEL_EVENT.CREATE_CHANNEL, onCreateChannel);
    socket.on(CHANNEL_EVENT.EDIT_CHANNEL, onEditChannel);
    socket.on(CHANNEL_EVENT.DELETE_CHANNEL, onDeleteChannel);
    return () => {
      socket.off(CHANNEL_EVENT.CREATE_CHANNEL, onCreateChannel);
      socket.off(CHANNEL_EVENT.EDIT_CHANNEL, onEditChannel);
    };
  }, [serverName]);
}
