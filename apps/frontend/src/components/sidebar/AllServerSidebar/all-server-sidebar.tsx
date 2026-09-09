import {ScrollArea} from '../../ui/scroll-area';
import type {TSideBardServer} from '../type';
import ServerBox from './server-box';
import {IconPlus} from '@tabler/icons-react';

const AllServersSidebar = ({servers}: {servers: TSideBardServer[]}) => {
  return (
    <div className='relative h-screen bg-primary-2  w-min border-e'>
      <ScrollArea className='h-full'>
        <div className='h-full flex flex-col flex-1 p-3'>
          <ServerBox server={{type: 'direct', id: 'direct-message', name: 'Direct Message'}} />
          {servers.map(server => (
            <ServerBox key={server.name} server={{...server, type: 'server'}} />
          ))}
          <ServerBox server={{id: 'create-server', type: 'create-server', name: 'Create Server', icon: IconPlus}} className='mt-auto' />
        </div>
      </ScrollArea>
    </div>
  );
};

export default AllServersSidebar;
