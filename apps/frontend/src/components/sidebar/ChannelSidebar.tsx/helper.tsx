import {IconEdit, IconHash, IconLogout, IconSettings2, IconUsersPlus, IconVolume} from '@tabler/icons-react';
import type {TChannelType, TServerPopoverOptions} from './type';
import type {ElementType} from 'react';
import type {TUserRole} from '@/api/type';

export const channelMapper: Record<TChannelType, {title: string; icon: ElementType}> = {
  text: {
    title: 'Text Channels',
    icon: IconHash
  },
  voice: {
    title: 'Voice Channels',
    icon: IconVolume
  }
};

export function GetServerPopoverOptions({role, onClickInvite, onClickEditServer, onClickViewServerSetting, onClickLeaveServer, onClickDeleteServer}: {role?: TUserRole; onClickInvite: () => void; onClickEditServer: () => void; onClickViewServerSetting: () => void; onClickLeaveServer: () => void; onClickDeleteServer: () => void}): TServerPopoverOptions[] {
  return [
    {
      group: [
        {
          icon: IconUsersPlus,
          title: 'Invite to Server',
          onClick: onClickInvite
        },
        ...(role == 'OWNER' || role == 'ADMIN'
          ? [
              {
                title: 'Edit Server',
                icon: IconEdit,
                onClick: onClickEditServer
              }
            ]
          : []),
        {
          title: 'Server Information',
          icon: IconSettings2,
          onClick: onClickViewServerSetting
        }
      ]
    },
    {
      group: [
        ...(role != 'OWNER'
          ? [
              {
                title: 'Leave Server',
                icon: IconLogout,
                onClick: onClickLeaveServer,
                color: 'text-red-400'
              }
            ]
          : []),
        ...(role == 'OWNER'
          ? [
              {
                title: 'Delete Server',
                icon: IconLogout,
                onClick: onClickDeleteServer,
                color: 'text-red-400'
              }
            ]
          : [])
      ]
    }
  ];
}
