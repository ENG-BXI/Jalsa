export type TMe = {
  id: string;
  email: string;
  name: string;
  userName: string;
  jointAt: string;
};

export type TGetUserByUserNameResponse = {
  id: string;
  name: string;
  userName: string;
};
export type TLoginBody = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  user: TMe;
  token: string;
};

export type TRegisterBody = {
  name: string;
  userName: string;
  email: string;
  password: string;
};

export type TRegisterResponse = {
  user: TMe;
  token: string;
};

export type TIsUserNameAvailableBody = {
  userName: string;
};

export type TIsUserNameAvailableResponse = boolean;
