import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import type {Dispatch, SubmitEvent} from 'react';
import {create} from 'zustand';
export type TMessage = {
  onEditMessage: ({message, editMessageText, setEditMessageText, setIsEdit, e}: {editMessageText: string; setIsEdit: Dispatch<React.SetStateAction<boolean>>; setEditMessageText: Dispatch<React.SetStateAction<string>>; message: TMessageWithUser; e?: SubmitEvent<HTMLFormElement>}) => void;
  onDelete: (messageId: string) => void;
  isEditMessageLoading?: boolean;
  isDeleteMessageLoading?: boolean;
};
type MessageStore = {
  message: TMessage;
  setMessage: (Message: TMessage) => void;
};
export const useMessage = create<MessageStore>(set => ({
  message: {onEditMessage: () => {}, onDelete: () => {}, isDeleteMessageLoading: false, isEditMessageLoading: false},
  setMessage: (message: TMessage) => {
    set({message: message});
  }
}));
