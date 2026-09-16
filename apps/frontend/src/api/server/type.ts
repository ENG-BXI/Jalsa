import type {TUserRole} from '../type';

export type TMyServersResponse = {
  role: TUserRole;
  server: {
    id: string;
    name: string;
    avatar_url?: string;
  };
};
export type TPublicServersResponse = {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
};

export type TServerByIdResponse = {
  avatar_url?: string;
  createdAt: string;
  description: string;
  id: string;
  isPublic: boolean;
  name: string;
  owner_id: string;
};
export type TAllMembersResponse = {
  role: TUserRole;
  user: {
    id: string;
    name: string;
    userName: string;
    jointAt: string;
  };
};

export type TCreateServerBody = {
  name: string;
  description?: string;
  isPublic: boolean;
};
export type TCreateServerResponse = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};
