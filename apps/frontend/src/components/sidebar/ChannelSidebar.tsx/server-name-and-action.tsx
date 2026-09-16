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
import {useParams} from 'react-router';
import {formatText} from '@/lib/utils';

const ServerNameAndAction = () => {
  const {serverName} = useParams<{serverName: string}>();
  return (
    <div className='py-2 px-3 min-h-12! flex justify-between items-center'>
      <ServerNamePopover name={serverName || ''} />
      <InviteFriend />
    </div>
  );
};

export default ServerNameAndAction;

interface TServerNamePopoverProps {
  name: string;
}
function ServerNamePopover({name}: TServerNamePopoverProps) {
  const [open, setOpen] = useState(false);
  const {setDialog} = useAppDialog();
  const inviteLink = 'https://jalsa-domain/invite/abc123';

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
    setDialog({
      title: {
        title: 'Edit Server',
        className: 'text-center'
      },

      description: {
        description: 'Update your server name, description, or image.',
        className: 'text-center'
      },

      content: <EditServerForm serverId={name} />,

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
    setDialog({
      title: {
        title: 'Server Information',
        className: 'text-center'
      },

      description: {
        description: 'View your server name, description, and image.',
        className: 'text-center'
      },

      content: <ViewServerForm serverId={name} />,

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
  const serverPopoverOptions = GetServerPopoverOptions({onClickInvite, onClickEditServer, onClickViewServerSetting, onClickLeaveServer});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={'ghost'}>
            {formatText(name, {numOfLetter: 9})} <IconChevronDown stroke={2} className={cn(open && 'rotate-180')} />
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
