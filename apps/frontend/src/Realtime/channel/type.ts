import type {TChannelType} from '@/api/type';

export type EditChannelEventResponse = {
  channelId: string;
  data: {
    createdAt: string;
    id: string;
    name: string;
    serverId: string;
    type: TChannelType;
  };
};

export type TDeleteChannelEventResponse = {
  channelId: string;
  data: {
    createdAt: string;
    id: string;
    name: string;
    serverId: string;
    type: TChannelType;
  };
};
