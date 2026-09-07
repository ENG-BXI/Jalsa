import type {ElementType} from 'react';

export type TServerPopoverOptions = {
  group: {icon: ElementType; title: string; onClick: () => void; color?: string}[];
};

export type TChannel = {
  id: string;
  title: string;
};
