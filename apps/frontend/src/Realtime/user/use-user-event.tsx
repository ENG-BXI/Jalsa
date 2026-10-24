import {useEffect} from 'react';
import {USER_EVENT} from './user.event';
import {socket} from '../socket';
import type {TEditUserEventResponse} from './type';
import {queryClient} from '@/api/instance';
import {SERVER_MEMBERS_KEY} from '@/api/server/api';
import type {TAllMembersResponse} from '@/api/server/type';
import type {AxiosResponse} from 'axios';
import type {TResponse} from '@/api/type';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import {CHANNEL_MESSAGE_KEY} from '@/api/channel-message/api';
import {DIRECT_MEMBER_KEY, DIRECT_MESSAGE_KEY} from '@/api/direct-message/api';
import type {TGetAllDMMember} from '@/api/direct-message/type';
import {useUser} from '@/store/user-info-store';

export function useUserEvent({serverId, channelId, receiverId, onEditUser}: {serverId?: string; channelId?: string; receiverId?: string; onEditUser?: (data: TEditUserEventResponse) => void}) {
  const user = useUser(state => state.user);

  useEffect(() => {
    socket.on(USER_EVENT.EDIT_USER, (data: TEditUserEventResponse) => {
      if (serverId) {
        queryClient.setQueryData([...SERVER_MEMBERS_KEY, serverId], (oldData: AxiosResponse<TResponse<TAllMembersResponse[]>>): AxiosResponse<TResponse<TAllMembersResponse[]>> => {
          const updatedMembers: TAllMembersResponse[] = oldData.data?.data?.map(member => {
            if (member.user?.id === data.userId)
              return {
                user: {
                  id: data.data.id,
                  jointAt: data.data.jointAt,
                  name: data.data.name,
                  userName: data.data.userName
                },
                role: member.role
              };
            return member;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedMembers
            }
          };
        });
      }
      if (channelId) {
        queryClient.setQueryData([...CHANNEL_MESSAGE_KEY, channelId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
          const updatedMessages: TMessageWithUser[] = oldData.data?.data?.map(message => {
            if (message.user?.id === data.userId) {
              return {
                ...message,
                user: {
                  ...message.user,
                  name: data.data.name,
                  userName: data.data.userName
                }
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
      }
      if (receiverId) {
        queryClient.setQueryData([...DIRECT_MESSAGE_KEY, receiverId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
          const updatedMessages: TMessageWithUser[] = oldData.data?.data?.map(message => {
            if (message.user?.id === data.userId) {
              return {
                ...message,
                user: {
                  ...message.user,
                  name: data.data.name,
                  userName: data.data.userName
                }
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
      }
      queryClient.setQueryData(DIRECT_MEMBER_KEY, (oldData: AxiosResponse<TResponse<TGetAllDMMember[]>>): AxiosResponse<TResponse<TGetAllDMMember[]>> => {
        const updatedMembers: TGetAllDMMember[] = oldData.data?.data?.map(member => {
          if (member.id === data.userId) {
            return {
              ...member,
              name: data.data.name,
              userName: data.data.userName
            };
          }
          return member;
        });
        if (user?.id !== data.userId) {
          onEditUser?.(data);
        }
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: updatedMembers
          }
        };
      });
    });

    //TODO : Handle delete user event
    // socket.on(USER_EVENT.DELETE_USER, (data: TDeleteUserEventResponse) => {
    //   if (serverId) {
    //     queryClient.setQueryData([...SERVER_MEMBERS_KEY, serverId], (oldData: AxiosResponse<TResponse<TAllMembersResponse[]>>): AxiosResponse<TResponse<TAllMembersResponse[]>> => {
    //       const updatedMembers: TAllMembersResponse[] = oldData.data?.data?.map(member => {
    //         if (member.user?.id === data.userId)
    //           return {
    //             user: {
    //               id: data.data.id,
    //               jointAt: data.data.jointAt,
    //               name: data.data.name,
    //               userName: data.data.userName
    //             },
    //             role: member.role
    //           };
    //         return member;
    //       });
    //       return {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           data: updatedMembers
    //         }
    //       };
    //     });
    //   }
    //   if (channelId) {
    //     queryClient.setQueryData([...CHANNEL_MESSAGE_KEY, channelId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
    //       const updatedMessages: TMessageWithUser[] = oldData.data?.data?.map(message => {
    //         if (message.user?.id === data.userId) {
    //           return {
    //             ...message,
    //             user: {
    //               ...message.user,
    //               name: data.data.name,
    //               userName: data.data.userName
    //             }
    //           };
    //         }
    //         return message;
    //       });
    //       return {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           data: updatedMessages
    //         }
    //       };
    //     });
    //   }
    //   if (receiverId) {
    //     queryClient.setQueryData([...DIRECT_MESSAGE_KEY, receiverId], (oldData: AxiosResponse<TResponse<TMessageWithUser[]>>): AxiosResponse<TResponse<TMessageWithUser[]>> => {
    //       const updatedMessages: TMessageWithUser[] = oldData.data?.data?.map(message => {
    //         if (message.user?.id === data.userId) {
    //           return {
    //             ...message,
    //             user: {
    //               ...message.user,
    //               name: data.data.name,
    //               userName: data.data.userName
    //             }
    //           };
    //         }
    //         return message;
    //       });

    //       return {
    //         ...oldData,
    //         data: {
    //           ...oldData.data,
    //           data: updatedMessages
    //         }
    //       };
    //     });
    //   }
    //   queryClient.setQueryData(DIRECT_MEMBER_KEY, (oldData: AxiosResponse<TResponse<TGetAllDMMember[]>>): AxiosResponse<TResponse<TGetAllDMMember[]>> => {
    //     const updatedMembers: TGetAllDMMember[] = oldData.data?.data?.map(member => {
    //       if (member.id === data.userId) {
    //         return {
    //           ...member,
    //           name: data.data.name,
    //           userName: data.data.userName
    //         };
    //       }
    //       return member;
    //     });
    //     return {
    //       ...oldData,
    //       data: {
    //         ...oldData.data,
    //         data: updatedMembers
    //       }
    //     };
    //   });
    // });
    return () => {
      socket.off(USER_EVENT.EDIT_USER);
      socket.off(USER_EVENT.DELETE_USER);
    };
  }, [serverId, channelId]);
}
