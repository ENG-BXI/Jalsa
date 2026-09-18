import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {useState} from 'react';
import {IconChevronDown, IconUsersPlus} from '@tabler/icons-react';
import {cn} from 'cn';
import {GetServerPopoverOptions} from './helper';
import {Separator} from '@/components/ui/separator';
import {useAppDialog} from '@/store/dialog-store';
import InviteFriendDialog from '@/components/server/invite-friend-dialog';
import EditServerForm from '@/components/server/edit-server-form';
import ViewServerForm from '@/components/server/view-server-form';
import {formatText} from '@/lib/utils';
import {useChannelSideBar} from '@/store/server-store';
import {useLocation, useNavigate} from 'react-router';

const ServerNameAndAction = () => {
  return (
    <div className='py-2 px-3 min-h-12! flex justify-between items-center'>
      <ServerNamePopover />
      <InviteFriend />
    </div>
  );
};

export default ServerNameAndAction;

function ServerNamePopover() {
  const [open, setOpen] = useState(false);
  const {setDialog, onClose} = useAppDialog();
  const navigate = useNavigate();
  const locale = useLocation();
  const path = locale.pathname.split('/').slice(3);
  const inviteLink = 'https://jalsa-domain/invite/abc123';
  const {channelSideBar, setChannelSideBar} = useChannelSideBar();
  if (!channelSideBar || !channelSideBar.channelSideBar) return;
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

      content: <InviteFriendDialog inviteLink={inviteLink} />
    });
  }
  function onClickEditServer() {
    if (!channelSideBar.channelSideBar?.id) return;
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
          serverId={channelSideBar.channelSideBar.id}
          onClose={data => {
            navigate(`server/${data.name}/${path}`);
            setChannelSideBar({type: 'server', channelSideBar: {name: data.name}});
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
    if (!channelSideBar.channelSideBar?.id) return;
    setDialog({
      title: {
        title: 'Server Information',
        className: 'text-center'
      },

      description: {
        description: 'View your server name, description, and image.',
        className: 'text-center'
      },

      content: <ViewServerForm serverId={channelSideBar.channelSideBar.id}/>,

      primaryAction: {
        text: 'Save Changes',
        formId: 'edit-server-form'
      },

      secondaryAction: {
        text: 'Cancel'
      }
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
        text: 'Leave Server',
        className: 'bg-red-500',
        onClick: () => {}
      },

      secondaryAction: {
        text: 'Cancel'
      }
    });
  }
  const serverPopoverOptions = GetServerPopoverOptions({role: channelSideBar.role, onClickInvite, onClickEditServer, onClickViewServerSetting, onClickLeaveServer});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={'ghost'}>
            {formatText(channelSideBar.channelSideBar!.name, {numOfLetter: 9})} <IconChevronDown stroke={2} className={cn(open && 'rotate-180')} />
          </Button>
        }
      />
      <PopoverContent className='w-60 bg-primary-1' align='end'>
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
  const inviteLink = 'https://jalsa-domain/invite/abc123';

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

      content: <InviteFriendDialog inviteLink={inviteLink} />
    });
  }

  return (
    //  Open Dialog Here
    <Button variant={'ghost'} size={'icon-lg'} onClick={onClick}>
      <IconUsersPlus stroke={2} size={20} />
    </Button>
  );
}
