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
export type TServerByNameResponse = {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  owner_id: string;
  isPublic: boolean;
  createdAt: string;
  userSevers: [
    {
      role: TUserRole;
    }
  ];
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
export type TEditServerBody = {
  name?: string;
  description?: string;
  isPublic?: boolean;
};
export type TEditServerResponse = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};
