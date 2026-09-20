import type {TChannel} from '@/components/sidebar/ChannelSidebar.tsx/type';
import type {TChannelResponse, TGetAllChannelResponse} from './type';
import type {TChannelType} from '../type';
import type {TServerByNameResponse} from '../server/type';

type TChannelTransformDto = TChannel & {type: TChannelType};
function transformChannelFromDto(data: TChannelResponse[]): TChannelTransformDto[] {
  return data.map(channel => {
    return {
      id: channel.id,
      title: channel.name,
      type: channel.type
    };
  });
}
export type TServerChannelTransformDto = {server: TServerByNameResponse; channels: TChannelTransformDto[]};
export function transformServerChannelFromDto(data: TGetAllChannelResponse): TServerChannelTransformDto {
  return {
    server: data.server,
    channels: transformChannelFromDto(data.channels)
  };
}
