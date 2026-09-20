import PublicServerCard from './server-card';
import PublicServerCardSkeleton from './server-card-skeleton';

import type {TPublicServersResponse} from '@/api/server/type';

type PublicServerGridProps = {
  servers?: TPublicServersResponse[];
  myServersIds?: string[];
  isLoading?: boolean;
};

const PublicServerGrid = ({servers = [], myServersIds, isLoading = false}: PublicServerGridProps) => {
  const myServers = new Set(myServersIds);
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({length: 6}).map((_, index) => (
          <PublicServerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!servers.length) {
    return (
      <div className='flex min-h-60 items-center justify-center'>
        <p className='text-sm text-text-1'>No public communities found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {servers.map(server => {
        const isJoin = myServers.has(server.id);
        return <PublicServerCard key={server.id} server={server} isJoin={isJoin} />;
      })}
    </div>
  );
};

export default PublicServerGrid;
