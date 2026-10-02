type TFromUser = {
  id: string;
  name: string;
  userName: string;
  jointAt: string;
};
export type TAllChannelMessageResponse = {
  id: string;
  from: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  softDelete: boolean;
  fromUser: TFromUser;
};

export type TSendMessageBody = {
  text: string;
  image?: File | null;
};

export type TSendMessageResponse = {
  id: string;
  channelId: string;
  from: string;
  imageUrl: string;
  softDelete: boolean;
  text: string;
  createdAt: string;
  updatedAt: string;
};
