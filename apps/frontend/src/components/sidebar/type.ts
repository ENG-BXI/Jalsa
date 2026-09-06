import type {ElementType} from 'react';

export type TSideBardServer = {
  id: string;
  image?: string;
  name: string;
  type?: TServerBoxType;
  icon?: ElementType;
};

export type TServerBoxType = 'server' | 'direct' | 'create-server';
