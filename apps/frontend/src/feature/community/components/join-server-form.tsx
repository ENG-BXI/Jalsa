import {IconUsers} from '@tabler/icons-react';

import type {TPublicServersResponse} from '@/api/server/type';
import {formatText} from '@/lib/utils';

type JoinServerDialogProps = {
  server: TPublicServersResponse['data'][number];
};

const JoinServerDialog = ({server}: JoinServerDialogProps) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        {server.avatar_url ? <img src={server.avatar_url} alt={server.name} className='size-20 shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-border-1' /> : <div className='flex size-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-400 text-xl font-bold tracking-wide'>{formatText(server.name, {mode: 'first-letter-of-words'})}</div>}

        <div className='min-w-0'>
          <h3 className='truncate text-xl font-semibold tracking-tight text-white'>{server.name}</h3>

          <div className='mt-2 flex items-center gap-2 text-sm text-text-1'>
            <IconUsers className='size-4' />
            <span>{server.memberCount.toLocaleString()} members</span>
          </div>
        </div>
      </div>

      {server.description && <p className='text-sm leading-6 text-text-1'>{server.description}</p>}

      <div className='rounded-xl bg-indigo-400/5 px-4 py-4'>
        <p className='text-sm font-medium'>Join this server?</p>

        <p className='mt-1 text-sm leading-5 text-text-1'>You can leave whenever you want.</p>
      </div>
    </div>
  );
};

export default JoinServerDialog;
