import type {AxiosResponse} from 'axios';
import {ALL_MEMBERS, CHANGE_ROLE, CREATE_SERVER, DELETE_SERVER, EDIT_SERVER, LEAVE_USER_FROM_SERVER, MY_SERVERS, NAME, PUBLIC_SERVER, SERVER} from '../api-endpoint';
import {api, queryClient, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {TAllMembersResponse, TChangeRoleBody, TChangeRoleResponse, TCreateServerBody, TCreateServerResponse, TDeleteServerResponse, TEditServerBody, TEditServerResponse, TLeaveUserFromServerResponse, TMyServersResponse, TPublicServersResponse, TServerByIdResponse, TServerByNameResponse} from './type';
import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {transformMyServersFromDto} from './transform';
import type {TSideBardServer} from '@/components/sidebar/type';
import {toast} from 'sonner';

export const MY_SERVERS_KEY = ['my-servers'];
export const PUBLIC_SERVERS_KEY = ['public-servers'];
export const SERVER_BY_ID_OR_NAME_KEY = ['server'];
export const SERVER_MEMBERS_KEY = ['server-members'];

async function getMyServers() {
  const response = await api.get<TResponse<TMyServersResponse[]>>(`${VERSION_ONE}/${SERVER}/${MY_SERVERS}`);
  return {
    ...response,
    data: {
      ...response.data,
      data: transformMyServersFromDto(response.data.data)
    }
  };
}

async function getPublicServers() {
  return await api.get<TResponse<TPublicServersResponse[]>>(`${VERSION_ONE}/${SERVER}/${PUBLIC_SERVER}`);
}

async function getServerById(id: string) {
  return await api.get<TResponse<TServerByIdResponse>>(`${VERSION_ONE}/${SERVER}/${id}`);
}
async function getServerByName(name: string) {
  return await api.get<TResponse<TServerByNameResponse>>(`${VERSION_ONE}/${SERVER}/${NAME}/${name}`);
}
async function getAllMembersInServer(id: string) {
  return await api.get<TResponse<TAllMembersResponse[]>>(`${VERSION_ONE}/${SERVER}/${ALL_MEMBERS}/${id}`);
}
async function createServer(body: TCreateServerBody) {
  return await api.post<TResponse<TCreateServerResponse>>(`${VERSION_ONE}/${SERVER}/${CREATE_SERVER}`, body);
}
async function editServer({id, body}: {id: string; body: TEditServerBody}) {
  return await api.patch<TResponse<TEditServerResponse>>(`${VERSION_ONE}/${SERVER}/${EDIT_SERVER}/${id}`, body);
}
async function leaveUserFromServer({id}: {id: string}) {
  return await api.patch<TResponse<TLeaveUserFromServerResponse>>(`${VERSION_ONE}/${SERVER}/${LEAVE_USER_FROM_SERVER}/${id}`);
}
async function deleteServer({id}: {id: string}) {
  return await api.delete<TResponse<TDeleteServerResponse>>(`${VERSION_ONE}/${SERVER}/${DELETE_SERVER}/${id}`);
}
async function changeRole({id, body}: {id: string; body: TChangeRoleBody}) {
  return await api.patch<TResponse<TChangeRoleResponse>>(`${VERSION_ONE}/${SERVER}/${CHANGE_ROLE}/${id}`, body);
}
// hook ...
export function useMyServers<TData = AxiosResponse<TResponse<TSideBardServer[]>>>(queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TSideBardServer[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TSideBardServer[]>>, Error, TData>({
    ...queryOption,
    queryKey: MY_SERVERS_KEY,
    queryFn: () => getMyServers()
  });
}

export function usePublicServers<TData = AxiosResponse<TResponse<TPublicServersResponse[]>>>(queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TPublicServersResponse[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TPublicServersResponse[]>>, Error, TData>({
    ...queryOption,
    queryKey: PUBLIC_SERVERS_KEY,
    queryFn: () => getPublicServers()
  });
}

export function useServerById<TData = AxiosResponse<TResponse<TServerByIdResponse>>>(id: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TServerByIdResponse>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TServerByIdResponse>>, Error, TData>({
    ...queryOption,
    queryKey: [...SERVER_BY_ID_OR_NAME_KEY, id],
    queryFn: () => getServerById(id),
    enabled: !!id
  });
}
export function useServerByName<TData = AxiosResponse<TResponse<TServerByNameResponse>>>(name?: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TServerByNameResponse>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TServerByNameResponse>>, Error, TData>({
    ...queryOption,
    queryKey: [...SERVER_BY_ID_OR_NAME_KEY, name],
    queryFn: () => getServerByName(name!),
    enabled: !!name
  });
}

export function useAllMembersInServer<TData = AxiosResponse<TResponse<TAllMembersResponse[]>>>(id: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TAllMembersResponse[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TAllMembersResponse[]>>, Error, TData>({
    ...queryOption,
    queryKey: [...SERVER_MEMBERS_KEY, id],
    queryFn: () => getAllMembersInServer(id),
    enabled: !!id
  });
}

export function useCreateServer(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TCreateServerResponse>>, Error, TCreateServerBody>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TCreateServerResponse>>, Error, TCreateServerBody>({
    ...option,
    mutationKey: ['create-server'],
    mutationFn: createServer,
    onSuccess: (...args) => {
      toast.success('Server created successfully');
      const isPublic = args[1].isPublic;
      queryClient.invalidateQueries({
        queryKey: MY_SERVERS_KEY,
        exact: false
      });
      if (isPublic)
        queryClient.invalidateQueries({
          queryKey: PUBLIC_SERVERS_KEY,
          exact: false
        });
      option?.onSuccess?.(...args);
    }
  });
}
export function useEditServer(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TEditServerResponse>>, Error, {id: string; body: TEditServerBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TEditServerResponse>>, Error, {id: string; body: TEditServerBody}>({
    ...option,
    mutationKey: ['edit-server'],
    mutationFn: editServer,
    onSuccess: (...args) => {
      toast.success('Server Edited successfully');
      const isPublic = args[1].body.isPublic;
      queryClient.invalidateQueries({
        queryKey: MY_SERVERS_KEY,
        exact: false
      });
      if (isPublic)
        queryClient.invalidateQueries({
          queryKey: PUBLIC_SERVERS_KEY,
          exact: false
        });
      option?.onSuccess?.(...args);
    }
  });
}
export function useLeaveUserFromServer(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TLeaveUserFromServerResponse>>, Error, {id: string}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TLeaveUserFromServerResponse>>, Error, {id: string}>({
    ...option,
    mutationKey: ['leave-user-from-server'],
    mutationFn: leaveUserFromServer,
    onSuccess: (...args) => {
      toast.success('Leave From Server successfully');
      queryClient.invalidateQueries({
        queryKey: MY_SERVERS_KEY,
        exact: false
      });
      option?.onSuccess?.(...args);
    }
  });
}
export function useDeleteServer(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TDeleteServerResponse>>, Error, {id: string}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TDeleteServerResponse>>, Error, {id: string}>({
    ...option,
    mutationKey: ['delete-server'],
    mutationFn: deleteServer,
    onSuccess: (...args) => {
      toast.success('Delete Server successfully');
      const isPublic = args[0].data.data.isPublic;
      queryClient.invalidateQueries({
        queryKey: MY_SERVERS_KEY,
        exact: false
      });
      if (isPublic)
        queryClient.invalidateQueries({
          queryKey: PUBLIC_SERVERS_KEY,
          exact: false
        });
      option?.onSuccess?.(...args);
    }
  });
}
export function useChangeRole(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TChangeRoleResponse>>, Error, {id: string; body: TChangeRoleBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TChangeRoleResponse>>, Error, {id: string; body: TChangeRoleBody}>({
    ...option,
    mutationKey: ['change-role'],
    mutationFn: changeRole,
    onSuccess: (...args) => {
      const id = args[1].id;
      const role = args[1].body.role;
      toast.success(`Change User Role To ${role} successfully`);
      queryClient.invalidateQueries({
        queryKey: [...SERVER_MEMBERS_KEY, id],
        exact: false
      });
      option?.onSuccess?.(...args);
    }
  });
}
