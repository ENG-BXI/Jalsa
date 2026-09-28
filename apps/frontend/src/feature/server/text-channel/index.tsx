import {useChannelMessages, useDeleteMessage, useEditMessage, useSendMessage} from '@/api/channel-message/api';
import EmptyChannelPage from '@/components/empty-channel-page';
import ChannelTextInput from '@/components/server/channel/channel-text-input';
import {useHeader} from '@/store/header-store';
import {useChannel} from '@/store/use-channel';
import {useCallback, useEffect, type Dispatch, type SubmitEvent} from 'react';
import {useParams} from 'react-router';
import AllMessage from '../components/message';
import {useMessage} from '@/store/use-message.store';
import {useAppDialog} from '@/store/dialog-store';
import type {TMessageWithUser} from '../components/message/message-types';

const TextChannelPage = () => {
  const params = useParams<{channelName: string; serverId: string}>();
  const title = params.channelName || '';
  const {setHeader} = useHeader();
  const {channel} = useChannel();
  const {setMessage} = useMessage();
  const {setDialog, onClose} = useAppDialog();
  const {data: messages} = useChannelMessages(channel.id, {select: res => res.data.data});
  const {mutate: sendMessage, isPending} = useSendMessage();
  const {mutate: editMessage, isPending: isEditLoading} = useEditMessage();
  const {mutate: deleteMessage, isPending: isDeleteMessagePending} = useDeleteMessage();
  function handleOnSubmit(e: SubmitEvent<HTMLFormElement>, message: string, setMessage: Dispatch<React.SetStateAction<string>>) {
    e.preventDefault();
    if (!channel.id) return;
    if (!message) return;
    sendMessage(
      {
        channelId: channel.id,
        message: {
          text: message
        }
      },
      {
        onSuccess: () => {
          setMessage('');
        }
      }
    );
  }
  const handleEditMessage = useCallback(
    function handleEditMessage({message, setIsEdit, editMessageText, e}: {message: TMessageWithUser; editMessageText: string; setIsEdit: Dispatch<React.SetStateAction<boolean>>; setEditMessageText: Dispatch<React.SetStateAction<string>>; e?: SubmitEvent<HTMLFormElement>}) {
      e?.preventDefault();
      if (!channel.id) return;
      if (message.text !== editMessageText)
        editMessage(
          {
            channelId: channel.id,
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
    [channel.id, editMessage]
  );
  const handleDeleteClick = useCallback(
    function handleDeleteClick(messageId: string) {
      if (!channel.id) return;
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
                channelId: channel.id,
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
    [channel.id, deleteMessage, onClose, setDialog]
  );
  useEffect(() => {
    setMessage({onEditMessage: handleEditMessage, onDelete: handleDeleteClick, isDeleteMessageLoading: isDeleteMessagePending, isEditMessageLoading: isEditLoading});
  }, [handleDeleteClick, handleEditMessage, isDeleteMessagePending, isEditLoading, setMessage]);

  useEffect(() => {
    setHeader({title: title, type: 'text'});
  }, [setHeader, title]);
  return (
    <div className='relative px-4 h-full pb-20'>
      {messages?.length == 0 ? <EmptyChannelPage title={title} /> : <AllMessage messages={messages || []} />}
      <ChannelTextInput onSubmit={handleOnSubmit} isLoading={isPending} placeholder={`Message #${title}`} />
    </div>
  );
};

export default TextChannelPage;
