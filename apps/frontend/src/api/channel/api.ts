import type {AxiosResponse} from 'axios';
import {CHANNEL, CREATE_CHANNEL, DELETE_CHANNEL, EDIT_CHANNEL, SERVER} from '../api-endpoint';
import {api, queryClient, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {TCreateChannelBody, TCreateChannelResponse, TDeleteChannelResponse, TEditChannelBody, TEditChannelResponse, TGetAllChannelResponse, TGetChannelByIdResponse} from './type';
import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {toast} from 'sonner';
import {transformServerChannelFromDto, type TServerChannelTransformDto} from './transform';

export const CHANNEL_KEY = ['channels'];

export async function getAllChannel(serverName: string) {
  const response = await api.get<TResponse<TGetAllChannelResponse>>(`${VERSION_ONE}/${CHANNEL}/${SERVER}/${serverName}`);
  return {
    ...response,
    data: {
      ...response.data,
      data: transformServerChannelFromDto(response.data.data)
    }
  };
}
export async function createChannel({body}: {body: TCreateChannelBody}) {
  return await api.post<TResponse<TCreateChannelResponse>>(`${VERSION_ONE}/${CHANNEL}/${CREATE_CHANNEL}`, body);
}
export async function editChannel({serverId, channelId, body}: {serverId: string; channelId: string; body: TEditChannelBody}) {
  return await api.patch<TResponse<TEditChannelResponse>>(`${VERSION_ONE}/${CHANNEL}/${EDIT_CHANNEL}/${serverId}/${channelId}`, body);
}
export async function deleteChannel({serverId, channelId}: {serverId: string; channelId: string}) {
  return await api.delete<TResponse<TDeleteChannelResponse>>(`${VERSION_ONE}/${CHANNEL}/${DELETE_CHANNEL}/${serverId}/${channelId}`);
}
export async function getChannelById(channelId: string) {
  return await api.get<TResponse<TGetChannelByIdResponse>>(`${VERSION_ONE}/${CHANNEL}/${channelId}`);
}
// hooks
export function useGetAllChannel<TData = AxiosResponse<TResponse<TServerChannelTransformDto>>>(serverName?: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TServerChannelTransformDto>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TServerChannelTransformDto>>, Error, TData>({
    ...queryOption,
    queryKey: [...CHANNEL_KEY, serverName],
    queryFn: () => getAllChannel(serverName!)
  });
}
export function useCreateChannel(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TCreateChannelResponse>>, Error, {body: TCreateChannelBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TCreateChannelResponse>>, Error, {body: TCreateChannelBody}>({
    ...option,
    mutationKey: ['create-channel'],
    mutationFn: createChannel,
    onSuccess: (...args) => {
      toast.success('Create Channel successfully');
      queryClient.invalidateQueries({
        queryKey: CHANNEL_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
export function useEditChannel(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TEditChannelResponse>>, Error, {serverId: string; channelId: string; body: TEditChannelBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TEditChannelResponse>>, Error, {serverId: string; channelId: string; body: TEditChannelBody}>({
    ...option,
    mutationKey: ['edit-channel'],
    mutationFn: editChannel,
    onSuccess: (...args) => {
      toast.success('Edit Channel successfully');
      queryClient.invalidateQueries({
        queryKey: CHANNEL_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
export function useDeleteChannel(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TDeleteChannelResponse>>, Error, {serverId: string; channelId: string}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TDeleteChannelResponse>>, Error, {serverId: string; channelId: string}>({
    ...option,
    mutationKey: ['delete-channel'],
    mutationFn: deleteChannel,
    onSuccess: (...args) => {
      toast.success('Delete Channel successfully');
      queryClient.invalidateQueries({
        queryKey: CHANNEL_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
export function useGetChannelById<TData = AxiosResponse<TResponse<TGetChannelByIdResponse>>>(channelId: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TGetChannelByIdResponse>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TGetChannelByIdResponse>>, Error, TData>({
    ...queryOption,
    queryKey: CHANNEL_KEY,
    queryFn: () => getChannelById(channelId)
  });
}
