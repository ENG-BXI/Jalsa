import type {TChannelType} from '@/components/sidebar/ChannelSidebar.tsx/type';
import {create} from 'zustand';
export type TChannel = {
  id: string;
  name: string;
  type: TChannelType;
};
type channelStore = {
  channel: TChannel;
  setChannel: (channel: TChannel) => void;
};
export const useChannel = create<channelStore>(set => ({
  channel: {id: '', name: '', type: 'text'},
  setChannel: (channel: TChannel) => {
    set({channel: channel});
  }
}));
