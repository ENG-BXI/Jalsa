import {IconCalendar, IconLoader2, IconTrash, IconUsers} from '@tabler/icons-react';

import type {TAllMembersResponse} from '@/api/server/type';
import type {TUserRole} from '@/api/type';

import {formatText} from '@/lib/utils';

import {Skeleton} from '../ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select';
import {useChannelSideBar} from '@/store/server-store';
import {Button} from '../ui/button';
import {useKickUserFromServer} from '@/api/server/api';

type ServerMembersProps = {
  members?: TAllMembersResponse[];
  isLoading?: boolean;
  isChangeRolePending: boolean;
  changedUser: string;
  onRoleChange?: (userId: string, role: Exclude<TUserRole, 'OWNER'>) => void;
};

const ServerMembers = ({members = [], isLoading = false, changedUser, isChangeRolePending, onRoleChange}: ServerMembersProps) => {
  const {channelSideBar} = useChannelSideBar();
  const userRole = channelSideBar.role;
  const {mutate: kickMember, isPending: isKickPending} = useKickUserFromServer();
  function handleOnKickMember(memberId: string) {
    const serverId = channelSideBar.channelSideBar?.serverId;
    if (!serverId) return;
    kickMember({id: serverId, body: {memberId}});
  }
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <IconUsers className='size-5' />
          <h3 className='font-semibold'>Members</h3>
        </div>

        {!isLoading && <span className='text-sm text-muted-foreground'>{members.length}</span>}
      </div>

      <div className='space-y-1'>
        {isLoading ? (
          Array.from({length: 4}).map((_, index) => (
            <div key={index} className='flex items-center gap-3 rounded-md p-2'>
              <Skeleton className='size-10 rounded-full' />

              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
          ))
        ) : members.length > 0 ? (
          members.map(member => (
            <div key={member.user.id} className='flex items-center justify-between rounded-md p-2 hover:bg-muted/50'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-medium uppercase'>
                  {formatText(member.user.name, {
                    mode: 'first-letter-of-words'
                  })}
                </div>

                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{member.user.name}</p>

                  <p className='truncate text-xs text-muted-foreground'>@{member.user.userName}</p>
                </div>
              </div>

              <div className='flex shrink-0 items-center gap-3'>
                <MemberRole role={member.role} onChange={role => onRoleChange?.(member.user.id, role)} isChangeRolePending={member.user.id == changedUser && isChangeRolePending} />

                <div className='hidden items-center gap-1 text-xs text-muted-foreground md:flex'>
                  <IconCalendar className='size-3.5' />
                  {new Date(member.user.jointAt).toLocaleDateString()}
                </div>
                {(userRole == 'OWNER' || userRole == 'ADMIN') && member.role !== 'OWNER' && (
                  <Button disabled={isKickPending} onClick={() => handleOnKickMember(member.user.id)} variant={'outline'}>
                    {isKickPending ? <IconLoader2 className='text-red-500 animate-spin' /> : <IconTrash className='text-red-500' />}
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='py-6 text-center text-sm text-muted-foreground'>No members found.</p>
        )}
      </div>
    </div>
  );
};

function MemberRole({role, onChange, isChangeRolePending}: {role: TUserRole; onChange?: (role: Exclude<TUserRole, 'OWNER'>) => void; isChangeRolePending?: boolean}) {
  const {channelSideBar} = useChannelSideBar();
  const userRole = channelSideBar.role;
  if (role === 'OWNER') {
    return <span className='text-xs text-muted-foreground'>Owner</span>;
  }
  if (userRole == 'MEMBER') {
    if (role == 'ADMIN') return <span className='text-xs text-muted-foreground'>Admin</span>;
    if (role == 'MEMBER') return <span className='text-xs text-muted-foreground'>Member</span>;
  }
  return (
    <Select value={role} onValueChange={value => onChange?.(value as Exclude<TUserRole, 'OWNER'>)}>
      <SelectTrigger className='h-8 w-28 text-xs'>
        <SelectValue />
        {isChangeRolePending && <IconLoader2 className='animate-spin' />}
      </SelectTrigger>

      <SelectContent>
        <SelectItem value='MEMBER'>Member</SelectItem>
        <SelectItem value='ADMIN'>Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ServerMembers;
