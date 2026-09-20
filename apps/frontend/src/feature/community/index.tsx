import {useState} from 'react';
import {useMyServers, usePublicServers} from '@/api/server/api';
import CommunitySearch from './components/community-search';
import PublicServerGrid from './components/server-grid';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useDebounce} from '@/hooks/use-debounce';

const Index = () => {
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search);
  const {data: servers, isLoading} = usePublicServers(
    {search: debounceSearch},
    {
      select: res => res.data.data,
      placeholderData: res => res
    }
  );
  const {data: myServers, isLoading: isMyServersLoading} = useMyServers({
    select: res => res.data.data
  });
  const myServersIds = myServers?.map(server => server.id);
  return (
    <ScrollArea className='h-full bg-primary-2'>
      <div className='mx-auto w-full max-w-6xl px-6 py-10'>
        <header className='mb-10 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-white'>Discover Communities</h1>

          <p className='mx-auto mt-2 max-w-lg text-sm leading-6 text-text-1'>Find a community and connect with people who share your interests.</p>

          <div className='mt-6'>
            <CommunitySearch value={search} onChange={setSearch} />
          </div>
        </header>

        <section>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-white'>Popular Communities</h2>

            <p className='mt-1 text-sm text-text-1'>Explore public communities and join the conversation.</p>
          </div>

          <PublicServerGrid servers={servers} myServersIds={myServersIds} isLoading={isLoading || isMyServersLoading} />
        </section>
      </div>
    </ScrollArea>
  );
};

export default Index;
