import type {TUserRole} from '@/api/type';
import {create} from 'zustand';
export type TChannelSideBarAndRole = {
  type: 'direct-message' | 'server';
  role?: TUserRole;
  channelSideBar: {
    id?: string;
    name: string;
  } | null;
};
type channelSideBarStore = {
  channelSideBar: TChannelSideBarAndRole;
  setChannelSideBar: (channelSideBar: TChannelSideBarAndRole) => void;
};
export const useChannelSideBar = create<channelSideBarStore>(set => ({
  channelSideBar: {role: undefined, channelSideBar: null, type: 'direct-message'},
  setChannelSideBar: (channelSideBar: TChannelSideBarAndRole) => {
    set({channelSideBar: channelSideBar});
  }
}));
