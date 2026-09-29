import {IconEdit, IconHash, IconLogout, IconPlus, IconSettings2, IconTrash, IconUsersPlus, IconVolume} from '@tabler/icons-react';
import type {TChannelType, TPopoverOptions} from './type';
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
interface TGetServerPopoverOptions {
  isDm: boolean;
  role?: TUserRole;
  onClickInvite: () => void;
  onClickEditServer: () => void;
  onClickViewServerSetting: () => void;
  onClickLeaveServer: () => void;
  onClickDeleteServer: () => void;
  onClickCreateChannel: () => void;
  // DM
  onShareWithFriends: () => void;
  onClickEditUser: () => void;
  onClickLogout: () => void;
  onDeleteAccount: () => void;
}
export function GetServerPopoverOptions({
  isDm,
  role,
  onClickInvite,
  onClickEditServer,
  onClickViewServerSetting,
  onClickLeaveServer,
  onClickDeleteServer,
  onClickCreateChannel,
  onShareWithFriends,
  onClickEditUser,
  onClickLogout,
  onDeleteAccount,
}: TGetServerPopoverOptions): TPopoverOptions[] {
  if (isDm)
    return [
      {
        group: [
          {
            icon: IconUsersPlus,
            title: 'Share with Friends',
            onClick: onShareWithFriends
          },
          {
            title: 'Edit User Profile',
            icon: IconEdit,
            onClick: onClickEditUser
          }
        ]
      },
      {
        group: [
          {
            title: 'Logout',
            icon: IconLogout,
            onClick: onClickLogout,
            color: 'text-red-400'
          },
          {
            title: 'Delete Account',
            icon: IconLogout,
            onClick: onDeleteAccount,
            color: 'text-red-400'
          }
        ]
      }
    ];
  else
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
          },
          ...(role === 'OWNER' || role === 'ADMIN'
            ? [
                {
                  title: 'Create Channel',
                  icon: IconPlus,
                  onClick: onClickCreateChannel
                }
              ]
            : [])
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

export function GetChannelPopoverOption({role, onClickEditChannel, onClickDeleteChannel}: {role: TUserRole; onClickEditChannel: () => void; onClickDeleteChannel: () => void}): TPopoverOptions[] {
  return [
    {
      group: [
        ...(role === 'OWNER' || role === 'ADMIN'
          ? [
              {
                title: 'Edit Channel',
                icon: IconEdit,
                onClick: onClickEditChannel
              }
            ]
          : [])
      ]
    },
    {
      group: [
        ...(role === 'OWNER' || role === 'ADMIN'
          ? [
              {
                title: 'Delete Channel',
                icon: IconTrash,
                onClick: onClickDeleteChannel,
                color: 'text-red-400'
              }
            ]
          : [])
      ]
    }
  ];
}
