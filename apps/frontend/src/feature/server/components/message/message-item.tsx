import {formatText} from '@/lib/utils';

import type {TMessageWithUser} from './message-types';
import {formatMessageDate} from './helper';
import {IconPencilFilled, IconTrash} from '@tabler/icons-react';
import {Button} from '@/components/ui/button';
import {useEffect, useRef, useState} from 'react';
import {Input} from '@/components/ui/input';
import {useAppDialog} from '@/store/dialog-store';
import {useMessage} from '@/store/use-message.store';
import UserProfileDialog from './user-profile-dialog';
import {useNavigate} from 'react-router';
import {useUser} from '@/store/user-info-store';
import {useDm} from '@/store/use-dm.store';
interface MessageItemProps {
  message: TMessageWithUser;
  grouped?: boolean;
}

const MessageItem = ({message, grouped = false}: MessageItemProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const {setDialog, dialog, onClose} = useAppDialog();
  const [isEdit, setIsEdit] = useState(false);
  const [editMessageText, setEditMessageText] = useState(message.text || '');
  const navigate = useNavigate();
  const {user: currentUser} = useUser();
  const {setDm} = useDm();
  const {
    message: {onEditMessage, onDelete, isDeleteMessageLoading}
  } = useMessage();
  const {user} = message;
  useEffect(() => {
    if (isDeleteMessageLoading && dialog) {
      setDialog({
        ...dialog,
        primaryAction: {
          ...dialog.primaryAction,
          text: isDeleteMessageLoading ? 'Deleting Message' : 'Delete Message',
          disabled: isDeleteMessageLoading
        },
        secondaryAction: {
          ...dialog.secondaryAction,
          text: dialog.secondaryAction?.text || '',
          disabled: isDeleteMessageLoading
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteMessageLoading]);

  useEffect(() => {
    if (!isEdit) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEdit(false);
        setEditMessageText(message.text || '');
      } else if (e.key == 'Enter') {
        e.preventDefault();
        onEditMessage({message: message, setIsEdit, editMessageText, setEditMessageText});
      }
    };
    messageRef.current?.addEventListener('keydown', handleKeyDown);
    return () => {
      messageRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEditMessage, editMessageText, isEdit]);

  const handleUserClick = () => {
    setDialog({
      title: {
        title: 'User Profile',
        className: 'text-center'
      },

      description: {
        description: 'View this user profile or start a conversation.',
        className: 'text-center'
      },

      content: (
        <UserProfileDialog
          user={{name: message.user.name, userName: message.user.userName, jointAt: message.user.jointAt}}
          onMessage={() => {
            onClose();
            setDm({id: message.user.id, name: message.user.name});
            navigate(`/direct-message/${user.userName}`);
          }}
        />
      ),

      primaryAction: {
        text: 'Close',
        onClick: onClose
      }
    });
  };
  return (
    <div ref={messageRef} className='relative group flex gap-3 px-4 py-0.5 hover:bg-muted/30'>
      {!grouped ? (
        <Button type='button' onClick={handleUserClick} className='mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold transition-opacity hover:opacity-80'>
          {formatText(user.userName, {mode: 'first-letter-of-words'}).slice(0, 2)}
        </Button>
      ) : (
        <div className='w-10 shrink-0' />
      )}

      <div className='min-w-0 flex-1'>
        {!grouped && (
          <div onClick={handleUserClick} className='max-w-min text-nowrap cursor-pointer group mb-0.5 flex items-baseline gap-2'>
            <span className='group-hover:text-muted-foreground font-medium text-foreground'>{user.userName}</span>
            <time className='text-xs text-muted-foreground'>{formatMessageDate(message.createdAt)}</time>
          </div>
        )}

        {message.softDelete ? (
          <p className='text-sm italic text-muted-foreground'>This message was deleted.</p>
        ) : isEdit && user.id == currentUser?.id ? (
          <form
            onSubmit={e => {
              if (!message) return;
              onEditMessage({message: message, setIsEdit, editMessageText, setEditMessageText, e});
            }}
          >
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
            {message.imageUrl && <img src={message.imageUrl} alt='Message attachment' className='mb-1 max-h-96 max-w-md rounded-lg object-contain' />}
            {message.text && (
              <div className='flex items-center gap-2'>
                <p className='whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground'>{message.text}</p>
                {message.createdAt !== message.updatedAt && <p className='text-[10px] text-muted-foreground'>(edited)</p>}
              </div>
            )}
          </>
        )}
      </div>

      {!message.softDelete && user.id == currentUser?.id && (
        <div className='absolute -top-1 right-0 hidden rounded-lg border border-border-1 bg-[#202024] p-1 group-hover:flex'>
          <Button onClick={() => setIsEdit(true)} variant='ghost' size='icon-sm'>
            <IconPencilFilled color='#868686' />
          </Button>

          <Button onClick={() => onDelete(message.id)} variant='ghost' size='icon-sm'>
            <IconTrash color='red' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
