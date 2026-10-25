export type TNewChannelMessageEventResponse = {
  id: string;
  from?: string;
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
export type TEditChannelMessageEventResponse = {
  messageId: string;
  data: {
    id: string;
    from?: string;
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
};

export type TDeleteChannelMessageEventResponse = {
  messageId: string;
  data: {
    id: string;
    from?: string;
    text?: string;
    imageUrl?: string;
    channelId: string;
    softDelete: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type TChannelIsTypingEventResponse = {
  isTyping: boolean;
  fromUserId: string;
  fromUserName: string;
  channelId: string;
};

export type TIsTypingStateHook = {
  isTyping: boolean;
  users: {
    userId: string;
    userName: string;
  }[];
};
