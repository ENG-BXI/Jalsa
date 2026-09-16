export type TResponse<T> = {
  message: string;
  data: T;
};

export type TUserRole = 'ADMIN' | 'OWNER' | 'MEMBER';
