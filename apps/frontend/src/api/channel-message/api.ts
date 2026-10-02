import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {ALL_MESSAGE, CHANNEL_MESSAGE} from '../api-endpoint';
import {api, queryClient, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {TAllChannelMessageResponse, TSendMessageBody, TSendMessageResponse} from './type';
import type {AxiosResponse} from 'axios';
import {transformMessageWithUserFromDto} from './transform';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';

export const CHANNEL_MESSAGE_KEY = ['channel-message'];

// Function
export async function getAllChannelMessage(channelId: string) {
  const response = await api.get<TResponse<TAllChannelMessageResponse[]>>(`${VERSION_ONE}/${CHANNEL_MESSAGE}/${ALL_MESSAGE}/${channelId}`);
  return {
    ...response,
    data: {
      ...response.data,
      data: transformMessageWithUserFromDto(response.data.data)
    }
  };
}

export async function sendMessage({channelId, message}: {channelId: string; message: TSendMessageBody}) {
  const formData = new FormData();
  if (message.text) {
    formData.append('text', message.text);
  }
  if (message.image) {
    formData.append('image', message.image);
  }
  return await api.post<TResponse<TSendMessageResponse>>(`${VERSION_ONE}/${CHANNEL_MESSAGE}/${channelId}`, formData);
}
export async function editMessage({channelId, messageId, message}: {channelId: string; messageId: string; message: TSendMessageBody}) {
  return await api.patch<TResponse<TSendMessageResponse>>(`${VERSION_ONE}/${CHANNEL_MESSAGE}/${channelId}/${messageId}`, message);
}
export async function deleteMessage({channelId, messageId}: {channelId: string; messageId: string}) {
  return await api.delete<TResponse<TSendMessageResponse>>(`${VERSION_ONE}/${CHANNEL_MESSAGE}/${channelId}/${messageId}`);
}

// Hook....
export function useChannelMessages<TData = AxiosResponse<TResponse<TMessageWithUser[]>>>(id: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TMessageWithUser[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TMessageWithUser[]>>, Error, TData>({
    ...queryOption,
    queryKey: [...CHANNEL_MESSAGE_KEY, id],
    queryFn: () => getAllChannelMessage(id),
    enabled: !!id
  });
}

export function useSendMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; message: TSendMessageBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; message: TSendMessageBody}>({
    ...option,
    mutationKey: ['send-message'],
    mutationFn: sendMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CHANNEL_MESSAGE_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
export function useEditMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; messageId: string; message: TSendMessageBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; messageId: string; message: TSendMessageBody}>({
    ...option,
    mutationKey: ['edit-message'],
    mutationFn: editMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CHANNEL_MESSAGE_KEY,
        exact: false
      });
      option?.onSuccess?.(...args);
    }
  });
}
export function useDeleteMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; messageId: string}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TSendMessageResponse>>, Error, {channelId: string; messageId: string}>({
    ...option,
    mutationKey: ['delete-message'],
    mutationFn: deleteMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CHANNEL_MESSAGE_KEY,
        exact: false
      });
      option?.onSuccess?.(...args);
    }
  });
}
