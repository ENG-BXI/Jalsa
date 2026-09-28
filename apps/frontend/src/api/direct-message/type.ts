export type TGetAllDMMessage = {
  id: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  softDelete: boolean;
  fromUser: {
    id: string;
    name: string;
    userName: string;
    jointAt: string;
  };
};

export type TGetAllDMMember = {
  id: string;
  name: string;
  userName: string;
};

export type TSendDMMessageBody = {
  text: string;
  // TODO: Add this later
  // image
};

export type TSendDMMessageResponse = {
  id: string;
  text: string;
  isNew: boolean;
};

export type TEditDMMessageBody = {
  text: string;
  // TODO: Add this later
  // image
};
export type TEditDMMessageResponse = {
  id: string;
  text: string;
};

export type TDeleteDMMessageResponse = {
  id: string;
  text: string;
};
