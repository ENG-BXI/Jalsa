import {IconUserPlus} from '@tabler/icons-react';

import {cn} from '@/lib/utils';

import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

type InviteChannelButtonProps = {
  onClick: () => void;
  isOpen?: boolean;
};

export function InviteChannelButton({isOpen = false, onClick}: InviteChannelButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick} delay={50} className='cursor-pointer ms-auto'>
        <IconUserPlus className={cn('hidden group-hover:block', isOpen && 'block')} stroke={2} />
      </TooltipTrigger>

      <TooltipContent className='bg-dialog-primary text-sm text-foreground'>Invite to Channel</TooltipContent>
    </Tooltip>
  );
}
