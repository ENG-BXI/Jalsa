import { Separator } from '@/components/ui/separator';
import {ScrollArea} from '../../ui/scroll-area';
import type {TSideBardServer} from '../type';
import ServerBox from './server-box';
import {IconCompass, IconPlus} from '@tabler/icons-react';

const AllServersSidebar = ({servers}: {servers: TSideBardServer[]}) => {
  return (
    <div className='relative h-full bg-primary-2 w-min'>
      <ScrollArea className='h-full'>
        <div className='h-full flex flex-col flex-1 p-3'>
          <ServerBox server={{type: 'direct', id: 'direct-message', name: 'Direct Message'}} />
          <Separator className={'mb-2'} />
          {servers.map(server => (
            <ServerBox key={server.name} server={{...server, type: 'server'}} />
          ))}
          <ServerBox server={{id: 'community', type: 'community', name: 'Community', icon: IconCompass}} className='mt-auto' />
          <ServerBox server={{id: 'create-server', type: 'create-server', name: 'Create Server', icon: IconPlus}} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AllServersSidebar;
