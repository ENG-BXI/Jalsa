import {Button} from '@/components/ui/button';
import type {TMember} from '..';
import {useNavigate} from 'react-router';
import {cn} from 'cn';

interface MemberItemProps {
  isActive?: boolean;
  member: TMember;
}

const MemberItem = ({isActive = false, member}: MemberItemProps) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/direct-message/${member.userName}`);
  }
  return (
    <Button onClick={handleClick} variant='ghost' size='lg' className={cn('group select-none text-text-1 justify-start p-2 text-sm', isActive && 'bg-primary-1')}>
      <div className='size-8 rounded-full bg-muted flex items-center justify-center shrink-0'>
        <span className='text-xs font-medium text-foreground'>{member.name.charAt(0).toUpperCase()}</span>
      </div>

      <div className='flex flex-col items-start min-w-0 ml-2'>
        <span className='truncate text-sm text-foreground'>{member.name}</span>

        <span className='truncate text-xs text-text-1'>@{member.userName}</span>
      </div>
    </Button>
  );
};
export default MemberItem;
