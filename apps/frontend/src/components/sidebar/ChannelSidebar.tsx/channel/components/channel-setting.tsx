import {cn} from '@/lib/utils';
import type {TUserRole} from '@/api/type';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {IconDotsVertical} from '@tabler/icons-react';
import {GetChannelPopoverOption} from '../../helper';
import {Separator} from '@/components/ui/separator';
import {useAppDialog} from '@/store/dialog-store';
import EditChannelForm from './edit-channel-form';
import {useChannelSideBar} from '@/store/server-store';
import {useNavigate} from 'react-router';
import {useDeleteChannel} from '@/api/channel/api';

type InviteChannelButtonProps = {
  role: TUserRole;
  channelId: string;
  isOpen: boolean;
};

export function ChannelSetting({role, channelId, isOpen}: InviteChannelButtonProps) {
  const [open, setOpen] = useState(false);
  const {setDialog, onClose} = useAppDialog();
  const {channelSideBar} = useChannelSideBar();
  const navigate = useNavigate();
  const {mutate: deleteChannelMutate} = useDeleteChannel();

  function onClickEditChannel() {
    if (!channelSideBar.channelSideBar?.serverId) return;

    setDialog({
      title: {
        title: 'Edit Channel',
        className: 'text-center'
      },

      description: {
        description: 'Update your channel name.',
        className: 'text-center'
      },

      content: (
        <EditChannelForm
          channelId={channelId}
          serverId={channelSideBar.channelSideBar.serverId}
          onClose={data => {
            const channelName = data.name;
            const serverName = channelSideBar.channelSideBar?.serverName;
            navigate(`/server/${serverName}/${channelName}`);
            onClose();
          }}
        />
      ),

      primaryAction: {
        text: 'Save Changes',
        formId: 'edit-channel-form'
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  function onClickDeleteChannel() {
    setDialog({
      title: {
        title: 'Delete Channel',
        className: 'text-center'
      },

      description: {
        description: 'Are you sure you want to delete this channel? This action cannot be undone.',
        className: 'text-center'
      },

      content: null,

      primaryAction: {
        text: 'Delete Channel',
        className: 'bg-red-500',
        onClick: () => {
          if (!channelSideBar.channelSideBar?.serverId) return;

          deleteChannelMutate(
            {channelId: channelId, serverId: channelSideBar.channelSideBar.serverId},
            {
              onSuccess: () => {
                const serverName = channelSideBar.channelSideBar?.serverName;
                navigate(`/server/${serverName}`);
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
  const channelPopoverOptions = GetChannelPopoverOption({role, onClickEditChannel, onClickDeleteChannel});
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn('ms-auto cursor-pointer md:hidden', isOpen && 'md:block')}>
        <IconDotsVertical stroke={2} />
      </PopoverTrigger>
      <PopoverContent className='max-w-60 bg-primary-1' align='center'>
        {channelPopoverOptions.map((optionGroup, index, arr) => {
          return (
            <div key={index} className='w-full'>
              {optionGroup.group.map((option, index2) => (
                <Button onClick={option.onClick} key={index2} variant={'ghost'} className={cn('justify-start rounded-sm w-full h-10', option.color)}>
                  <option.icon />
                  {option.title}
                </Button>
              ))}
              {index != arr.length - 1 && <Separator className={'mt-2'} />}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
