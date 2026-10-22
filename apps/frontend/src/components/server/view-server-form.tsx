import {Separator} from '../ui/separator';

import {useAllMembersInServer, useChangeRole, useServerById} from '@/api/server/api';

import ServerInfo from './server-info';
import ServerMembers from './server-members';
import type {TUserRole} from '@/api/type';
import {useServerEvent} from '@/Realtime/server/use-server-event';
import {useUserEvent} from '@/Realtime/user/use-user-event';

const ViewServer = ({serverId}: {serverId: string}) => {
  const {data: server, isLoading: isServerLoading} = useServerById(serverId, {
    select: res => res.data.data
  });
  useServerEvent(serverId);
  useUserEvent({serverId});
  const {data: members, isLoading: isMembersLoading} = useAllMembersInServer(serverId, {
    select: res => res.data.data
  });
  const {mutate: changeRoleMutate, variables, isPending: isChangeRolePending} = useChangeRole();
  function onRoleChange(userId: string, role: Exclude<TUserRole, 'OWNER'>) {
    changeRoleMutate({
      id: serverId,
      body: {
        memberId: userId,
        role
      }
    });
  }
  return (
    <div className='space-y-6'>
      <ServerInfo name={server?.name} description={server?.description} avatarUrl={server?.avatar_url} isPublic={server?.isPublic} isLoading={isServerLoading} />

      <Separator />

      <ServerMembers members={members} changedUser={variables?.body.memberId || ''} onRoleChange={onRoleChange} isChangeRolePending={isChangeRolePending} isLoading={isMembersLoading} />
    </div>
  );
};

export default ViewServer;
