import {useEffect, useRef} from 'react';

import PublicServerCard from './server-card';
import PublicServerCardSkeleton from './server-card-skeleton';

import type {TPagination, TPublicServersResponse} from '@/api/server/type';

type PublicServerGridProps = {
  servers?: TPublicServersResponse['data'];
  myServersIds?: string[];
  isLoading?: boolean;
  pagination?: TPagination;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetched?: boolean;
};

const PublicServerGrid = ({servers = [], pagination, isFetched, fetchNextPage, isFetchingNextPage = false, myServersIds, isLoading = false}: PublicServerGridProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const myServers = new Set(myServersIds);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !pagination?.hasNextPage || isFetchingNextPage || !fetchNextPage) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '200px'
      }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pagination?.hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && !isFetched) {
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
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {servers.map(server => (
          <PublicServerCard key={server.id} server={server} isJoin={myServers.has(server.id)} />
        ))}
      </div>
      {pagination?.hasNextPage && (
        <div ref={sentinelRef} className='flex min-h-16 items-center justify-center'>
          {isFetchingNextPage && <p className='text-sm text-text-1'>Loading more communities...</p>}
        </div>
      )}
    </>
  );
};

export default PublicServerGrid;
