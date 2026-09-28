import {useMutation, useQuery, type UseMutationOptions, type UseQueryOptions} from '@tanstack/react-query';
import {AUTH, IS_USER_NAME_AVAILABLE, LOGIN, ME, REGISTER, USER} from '../api-endpoint';
import {api, VERSION_ONE} from '../instance';
import type {TResponse} from '../type';
import type {AxiosResponse} from 'axios';
import type {TGetUserByUserNameResponse, TIsUserNameAvailableBody, TIsUserNameAvailableResponse, TLoginBody, TLoginResponse, TMe, TRegisterBody, TRegisterResponse} from './type';
import {toast} from 'sonner';
import Cookies from 'universal-cookie';

export const ME_KEY = ['me'];
export const USER_KEY = ['user'];
const cookie = new Cookies();
// Api Function
async function getUserByUserName(userName: string) {
  return await api.get<TResponse<TGetUserByUserNameResponse>>(`/${VERSION_ONE}/${USER}/${userName}`);
}
async function getMe() {
  return await api.get<TResponse<TMe>>(`/${VERSION_ONE}/${AUTH}/${ME}`);
}
async function login(data: TLoginBody) {
  return await api.post<TResponse<TLoginResponse>>(`${VERSION_ONE}/${AUTH}/${LOGIN}`, data);
}
async function register(data: TRegisterBody) {
  return await api.post<TResponse<TRegisterResponse>>(`${VERSION_ONE}/${AUTH}/${REGISTER}`, data);
}
async function isUserNameAvailable(data: TIsUserNameAvailableBody) {
  return api.post<TResponse<TIsUserNameAvailableResponse>>(`${VERSION_ONE}/${AUTH}/${IS_USER_NAME_AVAILABLE}`, data);
}
// hook ...
export function useUserByUserName<TData = AxiosResponse<TResponse<TGetUserByUserNameResponse>>>(userName: string, queryOption?: Omit<UseQueryOptions<AxiosResponse<TResponse<TGetUserByUserNameResponse>>, Error, TData>, 'queryKey' | 'queryFn'>) {
  return useQuery<AxiosResponse<TResponse<TGetUserByUserNameResponse>>, Error, TData>({
    ...queryOption,
    queryKey: USER_KEY,
    queryFn: () => getUserByUserName(userName)
  });
}
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
export function useRegister(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TRegisterResponse>>, Error, TRegisterBody>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TRegisterResponse>>, Error, TRegisterBody>({
    ...option,
    mutationKey: ['register'],
    mutationFn: register,
    onSuccess: (...args) => {
      toast.success('Registration successful', {
        description: 'Your account has been created successfully.'
      });
      cookie.set('token', args[0].data.data.token);
      option?.onSuccess?.(...args);
    }
  });
}
export function useIsUserNameAvailable(option?: Omit<UseMutationOptions<AxiosResponse<TResponse<TIsUserNameAvailableResponse>>, Error, TIsUserNameAvailableBody>, 'mutationFn' | 'mutationKey'>) {
  return useMutation<AxiosResponse<TResponse<TIsUserNameAvailableResponse>>, Error, TIsUserNameAvailableBody>({
    ...option,
    mutationKey: ['isUserNameAvailable'],
    mutationFn: isUserNameAvailable,
    onSuccess: (...args) => {
      option?.onSuccess?.(...args);
    }
  });
}
