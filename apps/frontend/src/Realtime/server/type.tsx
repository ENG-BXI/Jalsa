import type {TUserRole} from '@/api/type';

export type TCreateServerEventResponse = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  avatar_url: string;
};

export type TEditServerEventResponse = {
  serverId: string;
  data: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    avatar_url: string;
  };
};

export type TDeleteServerEventResponse = {
  serverId: string;
  data: {
    id: string;
    name: string;
    description: string;
    avatar_url: string;
    isPublic: boolean;
  };
};

export type TAddUserToServerEventResponse = {
  serverId: string;
  data: {
    role: TUserRole;
    createdAt: string;
    server?: {
      name: string;
      isPublic: boolean;
    };
    user?: {
      id: string;
      name: string;
      userName: string;
      jointAt: string;
    };
  };
};

export type TLeaveFromServerEventResponse = {
  serverId: string;
  data: {
    role: TUserRole;
    server?: {
      isPublic: boolean;
    };
    user?: {
      id: string;
      name: string;
      userName: string;
      jointAt: string;
    };
  };
};

export type TChangeRoleInServerEventResponse = {
  serverId: string;
  data: {
    serverId: string;
    id: string;
    createdAt: string;
    userId: string;
    role: TUserRole;
  };
};
