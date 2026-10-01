import {useState, type SubmitEvent} from 'react';
import {IconCheck, IconCopy, IconLoader2} from '@tabler/icons-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Switch} from '../ui/switch';
import {useGenerateInviteLink} from '@/api/server/api';
import {useChannelSideBar} from '@/store/server-store';
import {useUser} from '@/store/user-info-store';

const InviteFriendDialog = () => {
  const [copied, setCopied] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const {channelSideBar} = useChannelSideBar();
  const {user} = useUser();
  const {mutate: generateInviteLink, data: generateInviteLinkData, isPending: isGenerateInviteLinkPending} = useGenerateInviteLink();
  const userName = user?.userName;
  const isNull = !generateInviteLinkData?.data.data.code;
  const generatedInvite = `${location.origin}/invite/${channelSideBar.channelSideBar?.serverName}/${generateInviteLinkData?.data.data.code}`;
  const inviteLink = channelSideBar.type == 'direct-message' ? `${location.href}/${userName}` : isNull ? 'Generate Invite Link' : generatedInvite;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  function handleGenerateInviteLink(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!channelSideBar.channelSideBar || !channelSideBar.channelSideBar?.serverId) return;
    generateInviteLink({serverId: channelSideBar.channelSideBar.serverId, body: {isMultiple: isMultiple}});
  }
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Input value={isGenerateInviteLinkPending ? 'Generating invite link...' : inviteLink} readOnly className='bg-zinc-900/50 border-zinc-800/80 text-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-700 transition-all' />
        </div>
        <Button disabled={isGenerateInviteLinkPending || isNull} type='button' variant='outline' size='icon' onClick={handleCopy} className='shrink-0 border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-100 transition-colors'>
          {isGenerateInviteLinkPending ? <IconLoader2 className='size-4 animate-spin' /> : copied ? <IconCheck className='size-4 text-emerald-500' /> : <IconCopy className='size-4 text-zinc-400' />}
        </Button>
      </div>

      <div className='flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4 transition-colors'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='multiple-invite-switch' className='text-sm font-semibold text-zinc-200 cursor-pointer'>
            Multiple Uses Link
          </label>
          <span className='text-xs text-zinc-500 leading-relaxed max-w-62.5'>Allow multiple people to use this invitation link to join the server.</span>
        </div>
        <Switch
          id='multiple-invite-switch'
          checked={isMultiple}
          onCheckedChange={setIsMultiple}
          className='data-[state=checked]:bg-zinc-100'
        />
      </div>

      <form id='generate-invite-link-form' onSubmit={handleGenerateInviteLink}></form>

      <p className='text-xs text-zinc-500 font-medium'>Share this link with your friends to invite them to the server.</p>
    </div>
  );
};

export default InviteFriendDialog;
