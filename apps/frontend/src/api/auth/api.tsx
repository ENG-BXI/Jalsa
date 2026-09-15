import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {AUTH, LOGIN, ME} from '../api-endpoint';
import {api, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {AxiosResponse} from 'axios';
import type {TLoginBody, TLoginResponse, TMe} from './type';
import {toast} from 'sonner';
import Cookies from 'universal-cookie';

export const ME_KEY = ['me'];
const cookie = new Cookies();
// Api Function
async function getMe() {
  return await api.get<TResponse<TMe>>(`/${VERSION_ONE}/${AUTH}/${ME}`);
}
async function login(data: TLoginBody) {
  return await api.post(`${VERSION_ONE}/${AUTH}/${LOGIN}`, data);
}
// hook ...
export function useMe<TData = AxiosResponse<TResponse<TMe>>>(queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TMe>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TMe>>, Error, TData>({
    ...queryOption,
    queryKey: ME_KEY,
    queryFn: () => getMe()
  });
}

export function useLogin(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TLoginResponse>>, Error, TLoginBody>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TLoginResponse>>, Error, TLoginBody>({
    ...option,
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (...args) => {
      toast.success('Login successful', {
        description: 'Welcome back! You have been logged in successfully.'
      });
      cookie.set('token', args[0].data.data.token);
      option?.onSuccess?.(...args);
    }
  });
}
