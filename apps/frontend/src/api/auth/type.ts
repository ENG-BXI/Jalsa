export type TMe = {
  id: string;
  email: string;
  name: string;
  userName: string;
  jointAt: string;
};

export type TLoginBody = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  user: TMe;
  token: string;
};
