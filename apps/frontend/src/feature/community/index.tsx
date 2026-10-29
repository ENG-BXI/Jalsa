import {useState} from 'react';
import {useMyServers, usePublicServers} from '@/api/server/api';
import CommunitySearch from './components/community-search';
import PublicServerGrid from './components/server-grid';
import {ScrollArea} from '@/components/ui/scroll-area';
import {useDebounce} from '@/hooks/use-debounce';
import {useServerEvent} from '@/Realtime/server/use-server-event';
import useSideBar from '@/hooks/use-side-bar';
import {Button} from '@/components/ui/button';
import {IconSquareRoundedArrowLeft} from '@tabler/icons-react';
import {useNavigate} from 'react-router';
import {cn} from 'cn';

const Index = () => {
  const [search, setSearch] = useState('');
  const {hideSideBar} = useSideBar();
  const debounceSearch = useDebounce(search);
  const navigate = useNavigate();
  useServerEvent();
  const {
    data: serversResponse,
    isLoading,
    fetchNextPage,
    isFetched,
    isFetchingNextPage
  } = usePublicServers(
    {search: debounceSearch},
    {
      select: res => {
        return {
          servers: res.pages.flatMap(data => data.data.data.data),
          pagination: res.pages.at(-1)?.data.data.pagination
        };
      }
    }
  );
  const servers = serversResponse?.servers;
  const pagination = serversResponse?.pagination;
  const {data: myServers, isLoading: isMyServersLoading} = useMyServers({
    select: res => res.data.data
  });
  const myServersIds = myServers?.map(server => server.id);
  return (
    <ScrollArea className='h-full bg-primary-2'>
      {hideSideBar && (
        <div className='p-4'>
          <Button
            onClick={() => {
              navigate(-1);
            }}
            variant={'ghost'}
            size={'icon-lg'}
          >
            <IconSquareRoundedArrowLeft className='size-6' />
          </Button>
        </div>
      )}
      <div className={cn('mx-auto w-full max-w-6xl px-6 py-10', hideSideBar && 'px-4 py-5')}>
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
          <PublicServerGrid servers={servers || []} pagination={pagination} isFetched={isFetched} fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} myServersIds={myServersIds} isLoading={isLoading || isMyServersLoading} />
        </section>
      </div>
    </ScrollArea>
  );
};

export default Index;
