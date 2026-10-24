import {useEffect, useState} from 'react';
import {socket} from '../socket';
import {DM_EVENT} from './dm-event';
import type {TDeleteMessageEventResponse, TEditMessageEventResponse, TIsTypingEvent, TSendMessageEventResponse} from './type';
import {queryClient} from '@/api/instance';
import {DIRECT_MESSAGE_KEY} from '@/api/direct-message/api';
import type {AxiosResponse} from 'axios';
import type {TResponse} from '@/api/type';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import {getFileViewUrl} from '@/lib/utils';
import {APPWRITE_BUCKETS_IDS} from '@/lib/env';

const useDmEvent = ({receiverUserName}: {receiverUserName?: string}) => {
  useEffect(() => {
    if (!receiverUserName) return;
    socket.on(DM_EVENT.NEW_MESSAGE, (data: TSendMessageEventResponse) => {
      queryClient.setQueryData([...DIRECT_MESSAGE_KEY, receiverUserName], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        if (!data.fromUser) return oldData;
        if (!oldData?.data?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [
                {
                  ...data,
                  imageUrl: data.imageUrl ? `${getFileViewUrl(APPWRITE_BUCKETS_IDS.image, data.imageUrl)}` : undefined,
                  from: data.fromUser.id,
                  user: {
                    id: data.fromUser.id,
                    name: data.fromUser.name,
                    userName: data.fromUser.userName,
                    jointAt: data.fromUser.jointAt
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
                  ...data,
                  from: data.fromUser.id,
                  imageUrl: data.imageUrl ? `${getFileViewUrl(APPWRITE_BUCKETS_IDS.image, data.imageUrl)}` : undefined,
                  user: {
                    id: data.fromUser.id,
                    name: data.fromUser.name,
                    userName: data.fromUser.userName,
                    jointAt: data.fromUser.jointAt
                  }
                }
              ]
            }
          };
        }
      });
    });

    socket.on(DM_EVENT.EDIT_MESSAGE, (data: TEditMessageEventResponse) => {
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      queryClient.setQueryData([...DIRECT_MESSAGE_KEY, receiverUserName], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        const updatedMessages = oldData?.data?.data?.map(message => {
          if (message.id === data.id) {
            return {
              ...message,
              text: data.text,
              updatedAt: data.updatedAt
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

    socket.on(DM_EVENT.DELETE_MESSAGE, (data: TDeleteMessageEventResponse) => {
      queryClient.setQueryData([...DIRECT_MESSAGE_KEY, receiverUserName], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
        const updatedMessages = oldData?.data?.data?.map(message => {
          if (message.id === data.id) {
            return {
              ...message,
              text: data.text,
              imageUrl: data.imageUrl,
              softDelete: true
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

    return () => {
      socket.off(DM_EVENT.NEW_MESSAGE);
      socket.off(DM_EVENT.EDIT_MESSAGE);
      socket.off(DM_EVENT.DELETE_MESSAGE);
    };
  }, [receiverUserName]);
};

export const useIsDmTypingEvent = ({receiverUserId}: {receiverUserId?: string}) => {
  const [isTyping, setIsTyping] = useState<TIsTypingEvent>({isTyping: false, toUserId: '', toUserName: ''});
  function handleIsTypingEvent(data: Omit<TIsTypingEvent, 'toUserId'>) {
    socket.emit(DM_EVENT.IS_TYPING, {...data, toUserId: receiverUserId} as TIsTypingEvent);
  }
  useEffect(() => {
    if (!receiverUserId) return;
    socket.on(DM_EVENT.IS_TYPING, (data: TIsTypingEvent) => {
      setIsTyping(data);
    });
    return () => {
      socket.off(DM_EVENT.IS_TYPING);
    };
  }, [receiverUserId]);

  return {isTyping, handleIsTypingEvent};
};

export default useDmEvent;
