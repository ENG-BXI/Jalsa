export type TSendMessageEventResponse = {
  id: string;
  text?: string;
  imageUrl?: string;
  softDelete: boolean;
  createdAt: string;
  updatedAt: string;
  fromUser?: {
    id: string;
    name: string;
    userName: string;
    jointAt: string;
  };
};

export type TEditMessageEventResponse = {
  id: string;
  to: string;
  text: string;
  updatedAt: string;
};

export type TDeleteMessageEventResponse = {
  id: string;
  to: string;
  text?: string;
  imageUrl?: string;
};

export type TIsTypingEvent = {isTyping: boolean; toUserId: string; toUserName: string};
