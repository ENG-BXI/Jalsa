import {formatText} from '@/lib/utils';

import type {TMessageWithUser} from './message-types';
import {formatMessageDate} from './helper';
import {useDeleteMessage, useEditMessage} from '@/api/channel-message/api';
import {IconPencilFilled, IconTrash} from '@tabler/icons-react';
import {Button} from '@/components/ui/button';
import {useCallback, useEffect, useRef, useState, type SubmitEvent} from 'react';
import {Input} from '@/components/ui/input';
import {useChannel} from '@/store/use-channel';
import {useAppDialog} from '@/store/dialog-store';

interface MessageItemProps {
  message: TMessageWithUser;
  grouped?: boolean;
}

const MessageItem = ({message, grouped = false}: MessageItemProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const {setDialog, dialog, onClose} = useAppDialog();
  const {mutate: editMessage} = useEditMessage();
  const {mutate: deleteMessage, isPending: isDeleteMessagePending} = useDeleteMessage();
  const [isEdit, setIsEdit] = useState(false);
  const [editMessageText, setEditMessageText] = useState(message.text || '');
  const {user} = message;
  const {channel} = useChannel();

  const handleEditMessage = useCallback(
    function handleEditMessage(e?: SubmitEvent<HTMLFormElement>) {
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
    [channel.id, editMessage, editMessageText, message.id]
  );

  function handleDeleteClick() {
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
              messageId: message.id,
              channelId: channel.id
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
  }
  useEffect(() => {
    if (isDeleteMessagePending && dialog) {
      setDialog({
        ...dialog,
        primaryAction: {
          ...dialog.primaryAction,
          text: isDeleteMessagePending ? 'Deleting Message' : 'Delete Message',
          disabled: isDeleteMessagePending
        },
        secondaryAction: {
          ...dialog.secondaryAction,
          text: dialog.secondaryAction?.text || '',
          disabled: isDeleteMessagePending
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteMessagePending]);

  useEffect(() => {
    if (!isEdit) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEdit(false);
        setEditMessageText(message.text || '');
      } else if (e.key == 'Enter') {
        e.preventDefault();
        handleEditMessage();
      }
    };

    messageRef.current?.addEventListener('keydown', handleKeyDown);

    return () => {
      messageRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleEditMessage, isEdit]);

  return (
    <div ref={messageRef} className='relative group flex gap-3 px-4 py-0.5 hover:bg-muted/30'>
      {!grouped ? <div className='mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold'>{formatText(user.userName, {mode: 'first-letter-of-words'}).slice(0, 2)}</div> : <div className='w-10 shrink-0' />}

      <div className='min-w-0 flex-1'>
        {!grouped && (
          <div className='mb-0.5 flex items-baseline gap-2'>
            <span className='font-medium text-foreground'>{user.userName}</span>

            <time className='text-xs text-muted-foreground'>{formatMessageDate(message.createdAt)}</time>
          </div>
        )}

        {message.softDelete ? (
          <p className='text-sm italic text-muted-foreground'>This message was deleted.</p>
        ) : isEdit ? (
          <form onSubmit={handleEditMessage}>
            <Input value={editMessageText} onChange={e => setEditMessageText(e.target.value)} />

            <p className='text-[13px] text-muted-foreground'>
              escape
              <Button
                type='button'
                variant='link'
                className='mt-1 p-1 text-[13px] text-blue-400 no-underline hover:underline'
                onClick={() => {
                  setIsEdit(false);
                  setEditMessageText(message.text || '');
                }}
              >
                to cancel
              </Button>
              • enter to
              <Button type='submit' variant='link' className='mt-1 p-1 text-[13px] text-blue-400 no-underline hover:underline'>
                save
              </Button>
            </p>
          </form>
        ) : (
          <>
            {message.text && (
              <div className='flex items-center gap-2'>
                <p className='whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground'>{message.text}</p>

                {message.createdAt !== message.updatedAt && <p className='text-[10px] text-muted-foreground'>(edited)</p>}
              </div>
            )}

            {message.imageUrl && <img src={message.imageUrl} alt='Message attachment' className='mt-1 max-h-96 max-w-md rounded-lg object-contain' />}
          </>
        )}
      </div>

      {!message.softDelete && (
        <div className='absolute -top-1 right-0 hidden rounded-lg border border-border-1 bg-[#202024] p-1 group-hover:flex'>
          <Button onClick={() => setIsEdit(true)} variant='ghost' size='icon-sm'>
            <IconPencilFilled color='#868686' />
          </Button>

          <Button onClick={handleDeleteClick} variant='ghost' size='icon-sm'>
            <IconTrash color='red' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
