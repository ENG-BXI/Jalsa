import {IconChevronDown} from '@tabler/icons-react';
import {useState} from 'react';

import {cn} from 'cn';
import MemberItem from './components/member-item';
import {useParams} from 'react-router';

export interface TMember {
  id: string;
  name: string;
  userName: string;
}

interface MembersProps {
  members: TMember[];
}

const Members = ({members}: MembersProps) => {
  const [open, setOpen] = useState(true);
  const params = useParams<{receiverMemberUserName: string}>();
  const receiverMemberUserName = params.receiverMemberUserName || '';

  return (
    <div className='mb-5'>
      <div onClick={() => setOpen(pre => !pre)} className='cursor-pointer px-2 text-text-1 hover:text-inherit select-none flex items-center'>
        <h3 className='text-xs'>Members</h3>

        <IconChevronDown size={15} stroke={2} className={cn(!open && '-rotate-90')} />
      </div>

      {open && (
        <div className='flex flex-col mt-1 gap-1'>
          {members.map(member => (
            <MemberItem key={member.id} isActive={receiverMemberUserName == member.userName} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
