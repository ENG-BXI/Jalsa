import type {TSideBardServer} from '@/components/sidebar/type';
import type {TMyServersResponse} from './type';
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
