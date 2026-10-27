import type {TServerByNameResponse} from '../server/type';
import type {TChannelType} from '../type';

export type TChannelResponse = {id: string; name: string; type: TChannelType; serverId: string; createdAt: string};
export type TGetAllChannelResponse = {
  server: TServerByNameResponse;
  channels: TChannelResponse[];
};
export type TCreateChannelBody = {
  name: string;
  type: TChannelType;
  serverId: string;
};
export type TCreateChannelResponse = {
  id: string;
  name: string;
  type: TChannelType;
  serverId: string;
  createdAt: string;
};
export type TEditChannelBody = {
  name: string;
};
export type TEditChannelResponse = {
  id: string;
  name: string;
  type: TChannelType;
  serverId: string;
  createdAt: string;
};
export type TDeleteChannelResponse = {
  id: string;
  name: string;
  type: TChannelType;
  serverId: string;
  createdAt: string;
};

export type TGetChannelByIdResponse = {
  id: string;
  name: string;
  type: TChannelType;
  serverId: string;
  createdAt: string;
};
export type TJoinStreamChannelResponse = {
  id: string;
  name: string;
  type: TChannelType;
  serverId: string;
  createdAt: string;
  streamToken: string;
};
