import type {TSideBardServer} from '@/components/sidebar/type';
import type {TMyServersResponse} from './type';

export function transformMyServersFromDto(data: TMyServersResponse[]): TSideBardServer[] {
  return data.map(data => {
    return {
      id: data.server.id,
      name: data.server.name,
      image: data.server.avatar_url,
      type: 'server'
    };
  });
}
