import {useDeleteDMMessage, useEditDMMessage, useGetAllDMMessage, useSendDMMessage} from '@/api/direct-message/api';
import {useUserByUserName} from '@/api/user/api';
import ChannelTextInput from '@/components/server/channel/channel-text-input';
import AllMessage from '@/feature/server/components/message';
import IsTypingComponents from '@/feature/server/components/message/is-typing-components';
import type {TMessageWithUser} from '@/feature/server/components/message/message-types';
import useDmEvent, {useIsDmTypingEvent} from '@/Realtime/direct-message/use-dm-event';
import {useUserEvent} from '@/Realtime/user/use-user-event';
import {useAppDialog} from '@/store/dialog-store';
import {useHeader} from '@/store/header-store';
import {useDm} from '@/store/use-dm.store';
import {useMessage} from '@/store/use-message.store';
import {useCallback, useEffect, type Dispatch, type SubmitEvent} from 'react';
import {useParams} from 'react-router';

const ReceiverMember = () => {
  const params = useParams<{receiverMemberUserName: string}>();
  const title = params.receiverMemberUserName || '';
  const {setHeader} = useHeader();
  const {data: messages} = useGetAllDMMessage(title, {select: res => res.data.data, enabled: !!title});
  const {Dm, setDm} = useDm();
  const {mutate: sendMessage, isPending} = useSendDMMessage();
  const {setMessage} = useMessage();
  const {setDialog, onClose} = useAppDialog();
  const {mutate: editMessage, isPaused: isEditLoading} = useEditDMMessage();
  const {mutate: deleteMessage, isPending: isDeleteDMMessagePending} = useDeleteDMMessage();
  const {data: receiverUser, isLoading: isReceiverUserLoading, isFetched: isReceiverUserFetched} = useUserByUserName(params.receiverMemberUserName || '', {enabled: !!params.receiverMemberUserName, select: res => res.data.data});
  useUserEvent({receiverId: receiverUser?.id});
  useDmEvent({receiverUserName: title});
  const {isTyping, handleIsTypingEvent} = useIsDmTypingEvent({receiverUserId: Dm.id});
  function handleOnSubmit(e: SubmitEvent<HTMLFormElement>, message: string, setMessage: Dispatch<React.SetStateAction<string>>, file: File | null, setFile: Dispatch<React.SetStateAction<File | null>>) {
    e.preventDefault();
    if (!Dm.id) return;
    if (!message && !file) return;
    sendMessage(
      {
        receiverId: Dm.id,
        message: {
          text: message,
          image: file
        }
      },
      {
        onSuccess: () => {
          setMessage('');
          setFile(null);
          handleIsTypingEvent({isTyping: false, toUserName: title});
        }
      }
    );
  }
  const handleEditMessage = useCallback(
    function handleEditMessage({message, setIsEdit, editMessageText, e}: {message: TMessageWithUser; editMessageText: string; setIsEdit: Dispatch<React.SetStateAction<boolean>>; setEditMessageText: Dispatch<React.SetStateAction<string>>; e?: SubmitEvent<HTMLFormElement>}) {
      e?.preventDefault();
      if (!Dm.id) return;
      if (message.text !== editMessageText)
        editMessage(
          {
            messageId: message.id,
            message: {
              text: editMessageText
            }
          },
          {
            onSuccess: () => {
              setIsEdit(false);
            }
          }
        );
    },
    [Dm.id, editMessage]
  );
  const handleDeleteClick = useCallback(
    function handleDeleteClick(messageId: string) {
      if (!Dm.id) return;

      setDialog({
        title: {
          title: 'Delete Message',
          className: 'text-center'
        },

        description: {
          description: 'Are you sure you want to delete this message? This action cannot be undone.',
          className: 'text-center'
        },
        content: <div />,
        primaryAction: {
          text: 'Delete Message',
          onClick: () => {
            deleteMessage(
              {
                messageId: messageId
              },
              {
                onSuccess: () => {
                  onClose();
                }
              }
            );
          }
        },

        secondaryAction: {
          text: 'Cancel'
        }
      });
    },
    [Dm.id, deleteMessage, onClose, setDialog]
  );
  useEffect(() => {
    if (!isReceiverUserLoading && isReceiverUserFetched && receiverUser) {
      setDm({
        id: receiverUser.id,
        name: receiverUser.name
      });
    }
  }, [isReceiverUserFetched, isReceiverUserLoading, receiverUser, setDm]);
  useEffect(() => {
    setMessage({onEditMessage: handleEditMessage, onDelete: handleDeleteClick, isDeleteMessageLoading: isDeleteDMMessagePending, isEditMessageLoading: isEditLoading});
  }, [handleDeleteClick, handleEditMessage, isDeleteDMMessagePending, isEditLoading, setMessage]);

  useEffect(() => {
    setHeader({title: title, type: 'text'});
  }, [setHeader, title]);

  return (
    <div className='relative px-4 h-full pb-20'>
      <AllMessage messages={messages || []} />
      <IsTypingComponents name={isTyping.toUserName} isTyping={isTyping.isTyping} />
      <ChannelTextInput onSubmit={handleOnSubmit} onTyping={isTyping => handleIsTypingEvent({isTyping, toUserName: title})} isLoading={isPending} placeholder={`Message #${title}`} />
    </div>
  );
};

export default ReceiverMember;
