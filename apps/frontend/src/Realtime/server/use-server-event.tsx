import {useEffect} from 'react';
import {socket} from '../socket';
import {SERVER_EVENT} from './server-event';
import type {TAddUserToServerEventResponse, TChangeRoleInServerEventResponse, TCreateServerEventResponse, TDeleteServerEventResponse, TEditServerEventResponse, TLeaveFromServerEventResponse} from './type';
import {queryClient} from '@/api/instance';
import {MY_SERVERS_KEY, PUBLIC_SERVERS_KEY, SERVER_BY_ID_OR_NAME_KEY, SERVER_MEMBERS_KEY} from '@/api/server/api';
import type {AxiosResponse} from 'axios';
import type {TResponse, TUserRole} from '@/api/type';
import type {TAllMembersResponse, TPublicServersResponse, TServerByIdResponse} from '@/api/server/type';
import type {TSideBardServer} from '@/components/sidebar/type';
import {useUser} from '@/store/user-info-store';

export function useServerEvent(
  serverId?: string,
  options?: {
    onEdit?: (data: TSideBardServer) => void;
    onDelete?: (data: TSideBardServer) => void;
    onKick?: (data: {id: string}) => void;
    onChangeRole?: (data: {id: string,role:TUserRole}) => void;
  }
) {
  const currentUser = useUser(state => state.user);
  useEffect(() => {
    socket.on(SERVER_EVENT.CREATE_SERVER, (data: TCreateServerEventResponse) => {
      if (data.isPublic)
        queryClient.setQueriesData({queryKey: PUBLIC_SERVERS_KEY}, (oldData: AxiosResponse<TResponse<TPublicServersResponse[]>>): AxiosResponse<TResponse<TPublicServersResponse[]>> => {
          if (!oldData.data.data)
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: [
                  {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    memberCount: 1,
                    avatar_url: data.avatar_url
                  }
                ]
              }
            };
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [
                ...oldData.data.data,
                {
                  id: data.id,
                  name: data.name,
                  description: data.description,
                  memberCount: 1,
                  avatar_url: data.avatar_url
                }
              ]
            }
          };
        });
    });

    socket.on(SERVER_EVENT.EDIT_SERVER, (data: TEditServerEventResponse) => {
      if (data.data.isPublic)
        queryClient.setQueriesData({queryKey: PUBLIC_SERVERS_KEY}, (oldData: AxiosResponse<TResponse<TPublicServersResponse[]>>): AxiosResponse<TResponse<TPublicServersResponse[]>> => {
          const updatedServers: TPublicServersResponse[] = oldData.data.data?.map(server => {
            if (server.id === data.data.id) {
              return {
                id: data.data.id,
                name: data.data.name,
                description: data.data.description,
                memberCount: server.memberCount,
                avatar_url: data.data.avatar_url
              };
            } else return server;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
      if (serverId) {
        queryClient.setQueryData(MY_SERVERS_KEY, (oldData: AxiosResponse<TResponse<TSideBardServer[]>>): AxiosResponse<TResponse<TSideBardServer[]>> => {
          const updatedServers: TSideBardServer[] = oldData.data.data?.map(server => {
            if (server.id === data.data.id) {
              return {
                id: data.data.id,
                image: data.data.avatar_url,
                type: 'server',
                icon: undefined,
                name: data.data.name,
                description: data.data.description
              };
            } else return server;
          });
          options?.onEdit?.({id: data.data.id, image: data.data.avatar_url, type: 'server', icon: undefined, name: data.data.name});

          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
        queryClient.setQueryData([...SERVER_BY_ID_OR_NAME_KEY, serverId], (oldData: AxiosResponse<TResponse<TServerByIdResponse>>): AxiosResponse<TResponse<TServerByIdResponse>> => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...oldData.data.data,
                name: data.data.name,
                description: data.data.description,
                avatar_url: data.data.avatar_url,
                isPublic: data.data.isPublic
              }
            }
          };
        });
      }
    });

    socket.on(SERVER_EVENT.DELETE_SERVER, (data: TDeleteServerEventResponse) => {
      if (data.data.isPublic)
        queryClient.setQueriesData({queryKey: PUBLIC_SERVERS_KEY}, (oldData: AxiosResponse<TResponse<TPublicServersResponse[]>>): AxiosResponse<TResponse<TPublicServersResponse[]>> => {
          const updatedServers: TPublicServersResponse[] = oldData.data.data?.filter(server => server.id !== data.data.id);
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
      if (serverId)
        queryClient.setQueryData(MY_SERVERS_KEY, (oldData: AxiosResponse<TResponse<TSideBardServer[]>>): AxiosResponse<TResponse<TSideBardServer[]>> => {
          const updatedServers: TSideBardServer[] = oldData.data.data?.filter(server => server.id !== data.data.id);
          options?.onDelete?.({id: data.data.id, image: data.data.avatar_url, type: 'server', icon: undefined, name: data.data.name});
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
    });

    socket.on(SERVER_EVENT.ADD_USER_TO_SERVER, (data: TAddUserToServerEventResponse) => {
      if (data.data.server?.isPublic)
        queryClient.setQueriesData({queryKey: PUBLIC_SERVERS_KEY}, (oldData: AxiosResponse<TResponse<TPublicServersResponse[]>>): AxiosResponse<TResponse<TPublicServersResponse[]>> => {
          const updatedServers: TPublicServersResponse[] = oldData.data.data?.map(server => {
            if (server.id === data.serverId) {
              return {
                ...server,
                memberCount: server.memberCount + 1
              };
            } else return server;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
      if (data.data.user)
        queryClient.setQueryData([...SERVER_MEMBERS_KEY, serverId], (oldData: AxiosResponse<TResponse<TAllMembersResponse[]>>): AxiosResponse<TResponse<TAllMembersResponse[]>> => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [
                ...oldData.data.data,
                {
                  role: data.data.role,
                  user: {
                    id: data.data.user!.id,
                    name: data.data.user!.name,
                    userName: data.data.user!.userName,
                    jointAt: data.data.user!.jointAt
                  }
                }
              ]
            }
          };
        });
    });

    socket.on(SERVER_EVENT.LEAVE_FROM_SERVER, (data: TLeaveFromServerEventResponse) => {
      if (data.data.server?.isPublic)
        queryClient.setQueriesData({queryKey: PUBLIC_SERVERS_KEY}, (oldData: AxiosResponse<TResponse<TPublicServersResponse[]>>): AxiosResponse<TResponse<TPublicServersResponse[]>> => {
          const updatedServers: TPublicServersResponse[] = oldData.data.data?.map(server => {
            if (server.id === data.serverId) {
              return {
                id: server.id,
                name: server.name,
                description: server.description,
                avatar_url: server.avatar_url,
                memberCount: server.memberCount - 1
              };
            } else return server;
          });
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedServers
            }
          };
        });
      if (data.data.user) {
        if (data.data.user?.id == currentUser?.id) {
          queryClient.setQueryData(MY_SERVERS_KEY, (oldData: AxiosResponse<TResponse<TSideBardServer[]>>): AxiosResponse<TResponse<TSideBardServer[]>> => {
            const updatedServers: TSideBardServer[] = oldData.data.data?.filter(server => server.id !== data.serverId);
            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updatedServers
              }
            };
          });
          options?.onKick?.({id: data.serverId});
        }

        queryClient.setQueryData([...SERVER_MEMBERS_KEY, serverId], (oldData: AxiosResponse<TResponse<TAllMembersResponse[]>>): AxiosResponse<TResponse<TAllMembersResponse[]>> => {
          const updatedMembers: TAllMembersResponse[] = oldData.data?.data?.filter(member => member.user?.id !== data.data.user!.id);
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: updatedMembers
            }
          };
        });
      }
    });

    socket.on(SERVER_EVENT.CHANGE_ROLE_IN_SERVER, (data: TChangeRoleInServerEventResponse) => {
      if (data.data.userId === currentUser?.id) {
        options?.onChangeRole?.({
          id: data.serverId, role: data.data.role,
        });
      }
      queryClient.setQueryData( [...SERVER_MEMBERS_KEY, serverId], (oldData: AxiosResponse<TResponse<TAllMembersResponse[]>>): AxiosResponse<TResponse<TAllMembersResponse[]>> => {
        const updatedMembers: TAllMembersResponse[] = oldData.data?.data?.map(member => {
          if (member.user?.id === data.data.userId) return {...member, role: data.data.role};
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
    });
    return () => {
      socket.off(SERVER_EVENT.CREATE_SERVER);
      socket.off(SERVER_EVENT.EDIT_SERVER);
      socket.off(SERVER_EVENT.DELETE_SERVER);
      socket.off(SERVER_EVENT.ADD_USER_TO_SERVER);
      socket.off(SERVER_EVENT.LEAVE_FROM_SERVER);
      socket.off(SERVER_EVENT.CHANGE_ROLE_IN_SERVER);
    };
  }, [serverId]);
}

export function useServerJoin(serverId?: string) {
  useEffect(() => {
    if (serverId) socket.emit(SERVER_EVENT.JOIN_SERVER, serverId);
    return () => {
      socket.emit(SERVER_EVENT.LEAVE_SERVER, serverId);
    };
  }, [serverId]);
}
