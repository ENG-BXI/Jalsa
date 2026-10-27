import type {TServerChannelTransformDto} from '@/api/channel/transform';
import type {TCreateChannelResponse} from '@/api/channel/type';

export function transformChannelData(data: TCreateChannelResponse): TServerChannelTransformDto['channels'] {
  return [
    {
      id: data.id,
      title: data.name,
      type: data.type
    }
  ];
}
