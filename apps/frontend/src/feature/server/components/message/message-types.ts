export interface TMessage {
  id: string;
  from: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  softDelete: boolean;
}

export interface TMessageUser {
  id: string;
  name: string;
  userName: string;
  jointAt: string;
}

export interface TMessageWithUser extends TMessage {
  user: TMessageUser;
}
