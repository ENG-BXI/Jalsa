import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useEffect, useState} from 'react';
import {IconChevronDown, IconUsersPlus} from '@tabler/icons-react';
import {cn} from 'cn';
import {GetServerPopoverOptions} from './helper';
import {Separator} from '@/components/ui/separator';
import {useAppDialog} from '@/store/dialog-store';
import InviteFriendDialog from '@/components/server/invite-friend-dialog';
import EditServerForm from '@/components/server/edit-server-form';
import {formatText} from '@/lib/utils';
import {useChannelSideBar} from '@/store/server-store';
import {useLocation, useNavigate} from 'react-router';
import {useDeleteServer, useLeaveUserFromServer} from '@/api/server/api';
import ViewServer from '@/components/server/view-server-form';
import CreateChannelForm from './channel/components/create-channel-form';
import {useDeleteUser} from '@/api/user/api';
import EditUserForm from '../../../feature/user/edit-user';
import Cookies from 'universal-cookie';

const ServerNameAndAction = () => {
  const {channelSideBar} = useChannelSideBar();
  return (
    <div className='py-2 px-3 min-h-12! flex justify-between items-center'>
      <ServerNamePopover />
      {channelSideBar.role !== 'MEMBER' && <InviteFriend />}
    </div>
  );
};

export default ServerNameAndAction;

function ServerNamePopover() {
  const [open, setOpen] = useState(false);
  const {dialog, setDialog, onClose} = useAppDialog();
  const {mutate: leaveFromServerMutate, isPending: isLeaveUserPending} = useLeaveUserFromServer();
  const {mutate: deleteServerMutate, isPending: isDeleteServerPending} = useDeleteServer();
  const {mutate: deleteUserMutate, isPending: isDeleteUserPending} = useDeleteUser();
  const navigate = useNavigate();
  const locale = useLocation();
  const path = locale.pathname.split('/').slice(3);
  const {channelSideBar, setChannelSideBar} = useChannelSideBar();
  const cookie = new Cookies();

  // Delete Server
  useEffect(() => {
    if (isDeleteServerPending && dialog) {
      setDialog({
        ...dialog,
        primaryAction: {
          ...dialog.primaryAction,
          text: isDeleteServerPending ? 'Deleting Server' : 'Delete Server',
          disabled: isDeleteServerPending
        },
        secondaryAction: {
          ...dialog.secondaryAction,
          text: dialog.secondaryAction?.text || '',
          disabled: isDeleteServerPending
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteServerPending]);
  // Leaver User From Server
  useEffect(() => {
    if (isLeaveUserPending && dialog) {
      setDialog({
        ...dialog,
        primaryAction: {
          ...dialog.primaryAction,
          text: isLeaveUserPending ? 'Leaving From Server' : 'Leave Server',
          disabled: isLeaveUserPending
        },
        secondaryAction: {
          ...dialog.secondaryAction,
          text: dialog.secondaryAction?.text || '',
          disabled: isLeaveUserPending
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaveUserPending]);
  function onClickInvite() {
    setDialog({
      title: {
        title: 'Invite Friends',
        className: 'text-center'
      },

      description: {
        description: 'Invite your friends to join your server and grow your community.',
        className: 'text-center'
      },
      primaryAction: {
        text: 'Generate Invite Link',
        formId: 'generate-invite-link-form'
      },

      content: <InviteFriendDialog />
    });
  }
  function onClickEditServer() {
    if (!channelSideBar.channelSideBar?.serverId) return;
    setDialog({
      title: {
        title: 'Edit Server',
        className: 'text-center'
      },

      description: {
        description: 'Update your server name, description, or image.',
        className: 'text-center'
      },

      content: (
        <EditServerForm
          serverId={channelSideBar.channelSideBar.serverId}
          onClose={data => {
            navigate(`server/${data.name}/${path}`);
            setChannelSideBar({type: 'server', channelSideBar: {serverName: data.name}});
            onClose();
          }}
        />
      ),

      primaryAction: {
        text: 'Save Changes',
        formId: 'edit-server-form'
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  function onClickViewServerSetting() {
    if (!channelSideBar.channelSideBar?.serverId) return;
    setDialog({
      title: {
        title: 'Server Information',
        className: 'text-center'
      },

      description: {
        description: 'View your server name, description, and image.',
        className: 'text-center'
      },

      content: <ViewServer serverId={channelSideBar.channelSideBar.serverId} />
    });
  }
  function onClickLeaveServer() {
    setDialog({
      title: {
        title: 'Leave Server',
        className: 'text-center'
      },
      description: {
        description: 'Are you sure you want to leave this server? You will need a new invite to join again.',
        className: 'text-center'
      },
      content: null,
      primaryAction: {
        text: isLeaveUserPending ? 'Leaving From Server' : 'Leave Server',
        disabled: isLeaveUserPending,
        className: 'bg-red-500',
        onClick: () => {
          if (!channelSideBar.channelSideBar?.serverId) return;
          leaveFromServerMutate(
            {id: channelSideBar.channelSideBar.serverId},
            {
              onSuccess: () => {
                navigate('/');
                onClose();
              }
            }
          );
        }
      },

      secondaryAction: {
        text: 'Cancel',
        disabled: isLeaveUserPending
      }
    });
  }
  function onClickDeleteServer() {
    setDialog({
      title: {
        title: 'Delete Server',
        className: 'text-center'
      },

      description: {
        description: 'Are you sure you want to delete this server? This action cannot be undone.',
        className: 'text-center'
      },

      content: null,

      primaryAction: {
        text: 'Delete Server',
        className: 'bg-red-500',
        onClick: () => {
          if (!channelSideBar.channelSideBar?.serverId) return;
          deleteServerMutate(
            {id: channelSideBar.channelSideBar.serverId},
            {
              onSuccess: () => {
                navigate('/');
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
  function onClickCreateChannel() {
    if (!channelSideBar.channelSideBar?.serverId) return;

    setDialog({
      title: {
        title: 'Create Channel',
        className: 'text-center'
      },

      description: {
        description: 'Create a new channel and choose how members will communicate.',
        className: 'text-center'
      },

      content: (
        <CreateChannelForm
          serverId={channelSideBar.channelSideBar?.serverId}
          onClose={data => {
            const serverName = channelSideBar.channelSideBar?.serverName;
            const channelName = data.name;
            onClose();
            navigate(`/server/${serverName}/${channelName}`);
          }}
        />
      ),

      primaryAction: {
        text: 'Create Channel',
        formId: 'create-channel-form'
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  // Dm
  function onClickEditUser() {
    setDialog({
      title: {
        title: 'Edit Profile',
        className: 'text-center'
      },

      description: {
        description: 'Update your name and username.',
        className: 'text-center'
      },

      content: (
        <EditUserForm
          onClose={() => {
            onClose();
            location.reload();
          }}
        />
      ),

      primaryAction: {
        text: 'Save Changes',
        formId: 'edit-user-form'
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  function onClickLogout() {
    setDialog({
      title: {
        title: 'Logout',
        className: 'text-center'
      },

      description: {
        description: 'Are you sure you want to logout from your account?',
        className: 'text-center'
      },

      content: null,

      primaryAction: {
        text: 'Logout',
        className: 'bg-red-500',
        onClick: () => {
          cookie.remove('token');
          navigate('/login');
          onClose();
        }
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  function onDeleteAccount() {
    setDialog({
      title: {
        title: 'Delete Account',
        className: 'text-center'
      },

      description: {
        description: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
        className: 'text-center'
      },

      content: null,

      primaryAction: {
        text: isDeleteUserPending ? 'Deleting Account' : 'Delete Account',
        className: 'bg-red-500',
        disabled: isDeleteUserPending,
        onClick: () => {
          deleteUserMutate(undefined, {
            onSuccess: () => {
              onClose();
            }
          });
        }
      },

      secondaryAction: {
        text: 'Cancel',
        disabled: isDeleteUserPending
      }
    });
  }
  function onShareWithFriends() {
    setDialog({
      title: {
        title: 'Share Your Profile',
        className: 'text-center'
      },

      description: {
        description: 'Share your profile with friends so they can find you and send you a message on Jalsa.',
        className: 'text-center'
      },

      content: <InviteFriendDialog />
    });
  }

  const serverPopoverOptions = GetServerPopoverOptions({
    isDm: channelSideBar.type == 'direct-message',
    role: channelSideBar.role,
    onClickInvite,
    onClickEditServer,
    onClickViewServerSetting,
    onClickLeaveServer,
    onClickDeleteServer,
    onClickCreateChannel,
    onClickEditUser,
    onClickLogout,
    onDeleteAccount,
    onShareWithFriends
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={'ghost'}>
            {formatText(channelSideBar.channelSideBar?.serverName || '', {numOfLetter: 9})} <IconChevronDown stroke={2} className={cn(open && 'rotate-180')} />
          </Button>
        }
      />
      <PopoverContent className='max-w-60 bg-primary-1' align='end'>
        {serverPopoverOptions.map((optionGroup, index, arr) => {
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
function InviteFriend() {
  const {setDialog} = useAppDialog();
  function onClick() {
    setDialog({
      title: {
        title: 'Invite Friends',
        className: 'text-center'
      },

      description: {
        description: 'Invite your friends to join your server and grow your community.',
        className: 'text-center'
      },
      primaryAction: {
        text: 'Generate Invite Link',
        formId: 'generate-invite-link-form'
      },

      content: <InviteFriendDialog />
    });
  }

  return (
    //  Open Dialog Here
    <Button variant={'ghost'} size={'icon-lg'} onClick={onClick}>
      <IconUsersPlus stroke={2} size={20} />
    </Button>
  );
}
