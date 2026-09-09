import {IconEdit, IconHash, IconLogout, IconSettings2, IconUsersPlus, IconVolume} from '@tabler/icons-react';
import type {TChannel, TChannelType, TServerPopoverOptions} from './type';
import type {ElementType} from 'react';

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

export function GetServerPopoverOptions({onClickInvite, onClickEditServer, onClickViewServerSetting, onClickLeaveServer}: {onClickInvite: () => void; onClickEditServer: () => void; onClickViewServerSetting: () => void; onClickLeaveServer: () => void}): TServerPopoverOptions[] {
  return [
    {
      group: [
        {
          icon: IconUsersPlus,
          title: 'Invite to Server',
          onClick: onClickInvite
        },
        {
          title: 'Edit Server',
          icon: IconEdit,
          onClick: onClickEditServer
        },
        {
          title: 'Server Setting',
          icon: IconSettings2,
          onClick: onClickViewServerSetting
        }
      ]
    },
    {
      group: [
        {
          title: 'Leave Server',
          icon: IconLogout,
          onClick: onClickLeaveServer,
          color: 'text-red-400'
        }
      ]
    }
  ];
}

export const dummyTextChannels: TChannel[] = [
  {id: '1', title: 'general'},
  {id: '2', title: 'announcements'},
  {id: '3', title: 'welcome'},
  {id: '4', title: 'random'},
  {id: '5', title: 'memes'},
  {id: '6', title: 'gaming'},
  {id: '7', title: 'music'},
  {id: '8', title: 'movies'},
  {id: '9', title: 'development'},
  {id: '10', title: 'frontend'},
  {id: '11', title: 'backend'},
  {id: '12', title: 'help'},
  {id: '13', title: 'feedback'}
];

export const dummyVoiceChannels: TChannel[] = [
  {id: '14', title: 'General Voice'},
  {id: '15', title: 'Gaming'},
  {id: '16', title: 'Chill Zone'},
  {id: '17', title: 'Music'},
  {id: '18', title: 'Study Room'},
  {id: '19', title: 'Meeting Room'},
  {id: '20', title: 'Lounge'},
  {id: '21', title: 'AFK'}
];
