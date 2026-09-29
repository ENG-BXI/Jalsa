import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {DELETE_USER, EDIT_USER, USER} from '../api-endpoint';
import {api, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {AxiosResponse} from 'axios';
import type {TDeleteUserResponse, TEditUserBody, TEditUserResponse, TGetUserByUserNameResponse} from './type';
import {toast} from 'sonner';
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router';
export const ME_KEY = ['me'];
export const USER_KEY = ['user'];
const cookie = new Cookies();

// Api Function

async function getUserByUserName(userName: string) {
  return await api.get<TResponse<TGetUserByUserNameResponse>>(`/${VERSION_ONE}/${USER}/${userName}`);
}

async function editUser(data: TEditUserBody) {
  return await api.patch<TResponse<TEditUserResponse>>(`/${VERSION_ONE}/${USER}/${EDIT_USER}`, data);
}

async function deleteUser() {
  return await api.delete<TResponse<TDeleteUserResponse>>(`/${VERSION_ONE}/${USER}/${DELETE_USER}`);
}

// Hooks
export function useUserByUserName<TData = AxiosResponse<TResponse<TGetUserByUserNameResponse>>>(userName: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TGetUserByUserNameResponse>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TGetUserByUserNameResponse>>, Error, TData>({
    ...queryOption,
    queryKey: USER_KEY,
    queryFn: () => getUserByUserName(userName)
  });
}

export function useEditUser(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TEditUserResponse>>, Error, TEditUserBody>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TEditUserResponse>>, Error, TEditUserBody>({
    ...option,
    mutationKey: ['editUser'],
    mutationFn: editUser,
    onSuccess: (...args) => {
      toast.success('Profile updated successfully', {
        description: 'Your profile has been updated successfully.'
      });

      const token = args[0].data.data.token;

      if (token) {
        cookie.set('token', token);
      }

      option?.onSuccess?.(...args);
    }
  });
}

export function useDeleteUser(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TDeleteUserResponse>>, Error, void>, 'mutationFn' | 'mutationKey'>) {
  const navigate = useNavigate();
  return useMutation<AxiosResponse<TResponse<TDeleteUserResponse>>, Error, void>({
    ...option,
    mutationKey: ['deleteUser'],
    mutationFn: deleteUser,
    onSuccess: (...args) => {
      toast.success('Account deleted successfully', {
        description: 'Your account has been deleted successfully.'
      });

      cookie.remove('token');
      navigate('/login');
      option?.onSuccess?.(...args);
    }
  });
}
