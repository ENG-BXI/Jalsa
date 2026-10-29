import type {TUserRole} from '../type';

export type TMyServersResponse = {
  role: TUserRole;
  server: {
    id: string;
    name: string;
    avatar_url?: string;
  };
};
export type TPublicServersParams = {
  page?: number;
  limit?: number;
  search?: string;
};
export type TPublicServersResponse = {
  data: TPublicServersData[];
  pagination: TPagination;
};
export type TPublicServersData = {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  memberCount: number;
};
export type TPagination = {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
  serverImage?: File;
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
  serverImage?: File;
};
export type TEditServerResponse = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};
export type TLeaveUserFromServerResponse = {
  id: string;
  serverId: string;
  userId: string;
  role: TUserRole;
  createdAt: string;
};
export type TKickUserFromServerResponse = {
  id: string;
  serverId: string;
  userId: string;
  role: TUserRole;
  createdAt: string;
};
export type TKickUserFromServerBody = {
  memberId: string;
};
export type TDeleteServerResponse = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};
export type TChangeRoleBody = {
  memberId: string;
  role: TUserRole;
};
export type TChangeRoleResponse = {
  id: string;
  serverId: string;
  userId: string;
  role: TUserRole;
  createdAt: string;
};
export type TAddUserToServerResponse = {
  createdAt: string;
  server: {
    name: string;
  };
};
export type TAddUserToPrivateServerResponse = TAddUserToServerResponse;

export type TGenerateInviteCodeResponse = {
  code: string;
  expiresAt: string;
  isMultiple: boolean;
};
export type TGenerateInviteCodeBody = {
  isMultiple?: boolean;
};

export type TGetNumberOfMembersInServerResponse = {
  id: string;
  userSevers: number;
};
