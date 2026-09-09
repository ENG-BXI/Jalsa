import type {TChannelType} from '@/components/sidebar/ChannelSidebar.tsx/type';
import {create} from 'zustand';
export type THeader = {
  title: string;
  type: TChannelType;
};
type HeaderStore = {
  header: THeader;
  setHeader: (header: THeader) => void;
};
export const useHeader = create<HeaderStore>(set => ({
  header: {title: '', type: 'text'},
  setHeader: (header: THeader) => {
    set({header: header});
  }
}));
