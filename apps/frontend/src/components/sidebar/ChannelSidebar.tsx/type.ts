import type {ElementType} from 'react';

export type TPopoverOptions = {
  group: {icon: ElementType; title: string; onClick: () => void; color?: string}[];
};

export type TChannel = {
  id: string;
  title: string;
};

export type TChannelType = 'text' | 'voice';
