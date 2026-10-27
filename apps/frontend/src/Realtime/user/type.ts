export type TEditUserEventResponse = {
  userId: string;
  data: {
    userName: string;
    id: string;
    name: string;
    email: string;
    jointAt: string;
  };
};

export type TDeleteUserEventResponse = {
  userId: string;
  data: {
    id: string;
    name: string;
    userName: string;
    email: string;
  };
};
