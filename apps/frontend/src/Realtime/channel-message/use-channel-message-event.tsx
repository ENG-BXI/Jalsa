import {useEffect, useState} from 'react';
import {socket} from '../socket';
import {CHANNEL_MESSAGE_EVENT} from './channel-message-event';
import type {TChannelIsTypingEventResponse, TDeleteChannelMessageEventResponse, TEditChannelMessageEventResponse, TIsTypingStateHook, TNewChannelMessageEventResponse} from './type';
import {queryClient} from '@/api/instance';
import {CHANNEL_MESSAGE_KEY} from '@/api/channel-message/api';
import type {AxiosResponse} from 'axios';
import type {TResponse} from '@/api/type';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';

function useChannelMessageEvent({channelId}: {channelId?: string}) {
  useEffect(() => {
    if (!channelId) return;
    socket.on(CHANNEL_MESSAGE_EVENT.NEW_MESSAGE, (data: TNewChannelMessageEventResponse) => {
      queryClient.setQueryData([...CHANNEL_MESSAGE_KEY, channelId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        if (!data.fromUser?.id) return oldData;
        if (!oldData.data.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [
                {
                  id: data.id,
                  text: data.text,
                  imageUrl: data.imageUrl,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  softDelete: data.softDelete,
                  from: data.from || '',
                  user: {
                    id: data.fromUser?.id,
                    name: data.fromUser?.name,
                    userName: data.fromUser?.userName,
                    jointAt: data.fromUser?.jointAt
                  }
                }
              ]
            }
          };
        } else {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [
                ...oldData.data.data,
                {
                  id: data.id,
                  text: data.text,
                  imageUrl: data.imageUrl,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  softDelete: data.softDelete,
                  from: data.from || '',
                  user: {
                    id: data.fromUser?.id,
                    name: data.fromUser?.name,
                    userName: data.fromUser?.userName,
                    jointAt: data.fromUser?.jointAt
                  }
                }
              ]
            }
          };
        }
      });
    });

    socket.on(CHANNEL_MESSAGE_EVENT.EDIT_MESSAGE, (data: TEditChannelMessageEventResponse) => {
      queryClient.setQueryData([...CHANNEL_MESSAGE_KEY, channelId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        const updatedMessages = oldData.data.data?.map(message => {
          if (message.id === data.messageId) {
            return {
              ...message,
              text: data.data.text,
              imageUrl: data.data.imageUrl,
              updatedAt: data.data.updatedAt
            };
          }
          return message;
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: updatedMessages
          }
        };
      });
    });

    socket.on(CHANNEL_MESSAGE_EVENT.DELETE_MESSAGE, (data: TDeleteChannelMessageEventResponse) => {
      queryClient.setQueryData([...CHANNEL_MESSAGE_KEY, channelId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        const updatedMessages = oldData.data.data?.map(message => {
          if (message.id === data.messageId) {
            return {
              ...message,
              text: data.data.text,
              imageUrl: data.data.imageUrl,
              softDelete: true
            };
          } else return message;
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: updatedMessages
          }
        };
      });
    });

    return () => {
      socket.off(CHANNEL_MESSAGE_EVENT.NEW_MESSAGE);
      socket.off(CHANNEL_MESSAGE_EVENT.EDIT_MESSAGE);
      socket.off(CHANNEL_MESSAGE_EVENT.DELETE_MESSAGE);
    };
  }, [channelId]);
}

export function useJoinToChannel({channelId}: {channelId?: string}) {
  useEffect(() => {
    socket.emit(CHANNEL_MESSAGE_EVENT.JOIN_CHANNEL, channelId);
    return () => {
      socket.emit(CHANNEL_MESSAGE_EVENT.LEAVE_CHANNEL, channelId);
    };
  }, [channelId]);
}

export function useChannelIsTyping({channelId}: {channelId?: string}) {
  const [isTyping, setIsTyping] = useState<TIsTypingStateHook>({isTyping: false, users: []});
  function handleIsTyping({isTyping, fromUserId, fromUserName}: Omit<TChannelIsTypingEventResponse, 'channelId'>) {
    socket.emit(CHANNEL_MESSAGE_EVENT.IS_TYPING, {isTyping, fromUserId, fromUserName, channelId} as TChannelIsTypingEventResponse);
  }
  useEffect(() => {
    socket.on(CHANNEL_MESSAGE_EVENT.IS_TYPING, (data: Omit<TChannelIsTypingEventResponse, 'channelId'>) => {
      setIsTyping(prev => {
        const userExists = prev.users.some(user => user.userId === data.fromUserId);
        if (data.isTyping) {
          if (!userExists) {
            return {
              isTyping: true,
              users: [...prev.users, {userId: data.fromUserId, userName: data.fromUserName}]
            };
          } else return prev;
        } else {
          return {
            isTyping: prev.users.length > 1,
            users: prev.users.filter(user => user.userId !== data.fromUserId)
          };
        }
      });
    });
    return () => {
      socket.off(CHANNEL_MESSAGE_EVENT.IS_TYPING);
    };
  }, [channelId]);
  return {isTyping, handleIsTyping};
}

export default useChannelMessageEvent;
