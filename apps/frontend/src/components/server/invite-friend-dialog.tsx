import {useState} from 'react';
import {IconCheck, IconCopy} from '@tabler/icons-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

interface InviteFriendDialogProps {
  inviteLink: string;
}
const InviteFriendDialog = ({inviteLink}: InviteFriendDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input value={inviteLink} readOnly className='bg-muted' />

        <Button type='button' variant='outline' size='icon' onClick={handleCopy}>
          {copied ? <IconCheck className='size-4' /> : <IconCopy className='size-4' />}
        </Button>
      </div>

      <p className='text-sm text-muted-foreground'>Share this link with your friends to invite them to the server.</p>
    </div>
  );
};

export default InviteFriendDialog;
