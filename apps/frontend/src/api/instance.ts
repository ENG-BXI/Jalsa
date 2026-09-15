import {BACKEND_URL} from '@/lib/env';
import {QueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {toast} from 'sonner';
import Cookies from 'universal-cookie';
/**
 * BaseUrl
 */
const baseURL = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL
});

const cookie = new Cookies();
export const VERSION_ONE = 'v1';
export const queryClient = new QueryClient({
  defaultOptions: {queries: {refetchOnWindowFocus: false}}
});

api.interceptors.request.use(config => {
  const token = cookie.get('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status == 401) cookie.remove('token');
    console.log(error.response?.data);

    console.error(`API Error [${error.response?.status ?? 'Network'}]`, error.response?.data ?? error.message);
    toast.error(`${error.response?.data.error ?? 'Network'}`, error.response?.data.error ?? error.message);
    return Promise.reject(error);
  }
);
