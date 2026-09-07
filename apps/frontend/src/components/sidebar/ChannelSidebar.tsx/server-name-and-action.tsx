import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {serverName} from '../helper';
import {useState} from 'react';
import {IconChevronDown, IconUsersPlus} from '@tabler/icons-react';
import {cn} from 'cn';
import {serverPopoverOptions} from './helper';
import {Separator} from '@/components/ui/separator';

const ServerNameAndAction = () => {
  return (
    <div className='flex justify-between items-center'>
      <ServerNamePopover name={serverName} />
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
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant={'ghost'}>
            {name} <IconChevronDown stroke={2} className={cn(open && 'rotate-180')} />
          </Button>
        }
      />
      <PopoverContent className='w-60 bg-primary-1' align='end'>
        {serverPopoverOptions.map((optionGroup, index, arr) => {
          return (
            <div key={index} className='w-full'>
              {optionGroup.group.map((option, index2) => (
                <Button key={index2} variant={'ghost'} className={cn('justify-start rounded-sm w-full h-10', option.color)}>
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
  return (
    //  Open Dialog Here
    <Button variant={'ghost'} size={'icon-lg'}>
      <IconUsersPlus stroke={2} size={20} />
    </Button>
  );
}
