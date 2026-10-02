import type {TSideBardServer} from '@/components/sidebar/type';
import type {TMyServersResponse, TServerByIdResponse} from './type';
import {BACKEND_URL} from '@/lib/env';

export function transformMyServersFromDto(data: TMyServersResponse[]): TSideBardServer[] {
  return data.map(data => {
    return {
      id: data.server.id,
      name: data.server.name,
      image: data.server.avatar_url ? `${BACKEND_URL}/${data.server.avatar_url}` : undefined,
      type: 'server'
    };
  });
}

export function transformServerByIdFromDto(data: TServerByIdResponse): TServerByIdResponse {
  return {
    ...data,
    avatar_url: data.avatar_url ? `${BACKEND_URL}/${data.avatar_url}` : undefined
  };
}
