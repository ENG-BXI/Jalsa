export type TEditUserBody = {
  name: string;
  userName: string;
};
export type TGetUserByUserNameResponse = {
  id: string;
  name: string;
  userName: string;
};
export type TEditUserResponse = {
  user: {
    id: string;
    name: string;
    userName: string;
    email: string;
    jointAt: string;
  };
  token?: string;
};

export type TDeleteUserResponse = {
  userName: string;
  id: string;
  name: string;
  email: string;
};
