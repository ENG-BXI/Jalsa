import {IconLogout, IconSettings2, IconUsersPlus} from '@tabler/icons-react';
import type {TServerPopoverOptions} from './type';

export const serverPopoverOptions: TServerPopoverOptions[] = [
  {
    group: [
      {
        icon: IconUsersPlus,
        title: 'Invite to Server',
        onClick: () => {}
      },
      {
        title: 'Server Setting',
        icon: IconSettings2,
        onClick: () => {}
      }
    ]
  },
  {
    group: [
      {
        title: 'Leave Server',
        icon: IconLogout,
        onClick: () => {},
        color: 'text-red-400'
      }
    ]
  }
];
