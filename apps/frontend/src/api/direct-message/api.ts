import type {AxiosResponse} from 'axios';
import {ALL_MESSAGE_FOR_DM, DIRECT_MESSAGE, DM_MEMBERS} from '../api-endpoint';
import {api, queryClient, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {TDeleteDMMessageResponse, TEditDMMessageBody, TEditDMMessageResponse, TGetAllDMMember, TGetAllDMMessage, TSendDMMessageBody, TSendDMMessageResponse} from './type';
import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {transformDMMessageWithUserFromDto} from './transform';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';

export const DIRECT_MESSAGE_KEY = ['direct-message'];
export const DIRECT_MEMBER_KEY = ['direct-member'];

async function getAllDMMessage(receiverId: string) {
  const response = await api.get<TResponse<TGetAllDMMessage[]>>(`${VERSION_ONE}/${DIRECT_MESSAGE}/${ALL_MESSAGE_FOR_DM}/${receiverId}`);
  return {
    ...response,
    data: {
      ...response.data,
      data: transformDMMessageWithUserFromDto(response.data.data)
    }
  };
}
async function getAllDMMember() {
  return await api.get<TResponse<TGetAllDMMember[]>>(`${VERSION_ONE}/${DIRECT_MESSAGE}/${DM_MEMBERS}`);
}
async function sendDMMessage({receiverId, message}: {receiverId: string; message: TSendDMMessageBody}) {
  const formData = new FormData();
  if (message.text) {
    formData.append('text', message.text);
  }
  if (message.image) {
    formData.append('image', message.image);
  }
  return await api.post<TResponse<TSendDMMessageResponse>>(`${VERSION_ONE}/${DIRECT_MESSAGE}/${receiverId}`, formData);
}
async function editDMMessage({messageId, message}: {messageId: string; message: TEditDMMessageBody}) {
  return await api.patch<TResponse<TEditDMMessageResponse>>(`${VERSION_ONE}/${DIRECT_MESSAGE}/${messageId}`, message);
}
async function deleteDMMessage({messageId}: {messageId: string}) {
  return await api.delete<TResponse<TDeleteDMMessageResponse>>(`${VERSION_ONE}/${DIRECT_MESSAGE}/${messageId}`);
}

// hooks...
export function useGetAllDMMessage<TData = AxiosResponse<TResponse<TMessageWithUser[]>>>(receiverId: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TMessageWithUser[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TMessageWithUser[]>>, Error, TData>({
    ...queryOption,
    queryKey: [...DIRECT_MESSAGE_KEY, receiverId],
    queryFn: () => getAllDMMessage(receiverId),
    enabled: !!receiverId
  });
}
export function useGetAllDMMember<TData = AxiosResponse<TResponse<TGetAllDMMember[]>>>(queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TGetAllDMMember[]>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TGetAllDMMember[]>>, Error, TData>({
    ...queryOption,
    queryKey: DIRECT_MEMBER_KEY,
    queryFn: () => getAllDMMember()
  });
}
export function useSendDMMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TSendDMMessageResponse>>, Error, {receiverId: string; message: TSendDMMessageBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TSendDMMessageResponse>>, Error, {receiverId: string; message: TSendDMMessageBody}>({
    ...option,
    mutationKey: ['send-dm-message'],
    mutationFn: sendDMMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: DIRECT_MESSAGE_KEY,
        exact: false
      });
      const receiverId = args[1].receiverId;
      const cachedMembers = queryClient.getQueryData<AxiosResponse<TResponse<TGetAllDMMember[]>>>(DIRECT_MEMBER_KEY);
      const membersIds = cachedMembers?.data.data.map(member => member.id);
      const members = new Set(membersIds);
      const memberExists = members.has(receiverId);
      if (!memberExists)
        queryClient.invalidateQueries({
          queryKey: DIRECT_MEMBER_KEY,
          exact: false
        });
      option?.onSuccess?.(...args);
    }
  });
}
export function useEditDMMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TEditDMMessageResponse>>, Error, {messageId: string; message: TEditDMMessageBody}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TEditDMMessageResponse>>, Error, {messageId: string; message: TEditDMMessageBody}>({
    ...option,
    mutationKey: ['edit-dm-message'],
    mutationFn: editDMMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: DIRECT_MESSAGE_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
export function useDeleteDMMessage(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TDeleteDMMessageResponse>>, Error, {messageId: string}>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TDeleteDMMessageResponse>>, Error, {messageId: string}>({
    ...option,
    mutationKey: ['delete-dm-message'],
    mutationFn: deleteDMMessage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: DIRECT_MESSAGE_KEY,
        exact: false
      });

      option?.onSuccess?.(...args);
    }
  });
}
