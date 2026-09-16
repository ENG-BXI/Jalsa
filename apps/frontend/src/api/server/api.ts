import type {AxiosResponse} from 'axios';
import {ALL_MEMBERS, CREATE_SERVER, MY_SERVERS, PUBLIC_SERVER, SERVER} from '../api-endpoint';
import {api, queryClient, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {TAllMembersResponse, TCreateServerBody, TCreateServerResponse, TMyServersResponse, TPublicServersResponse, TServerByIdResponse} from './type';
import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {transformMyServersFromDto} from './transform';
import type {TSideBardServer} from '@/components/sidebar/type';
import {toast} from 'sonner';

export const MY_SERVERS_KEY = ['my-servers'];
export const PUBLIC_SERVERS_KEY = ['public-servers'];
export const SERVER_BY_ID_KEY = ['server'];
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
async function getAllMembersInServer(id: string) {
  return await api.get<TResponse<TAllMembersResponse[]>>(`${VERSION_ONE}/${SERVER}/${ALL_MEMBERS}/${id}`);
}
async function createServer(body: TCreateServerBody) {
  return await api.post<TResponse<TCreateServerResponse>>(`${VERSION_ONE}/${SERVER}/${CREATE_SERVER}`, body);
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
    queryKey: [...SERVER_BY_ID_KEY, id],
    queryFn: () => getServerById(id),
    enabled: !!id
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
