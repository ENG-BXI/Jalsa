import {Separator} from './ui/separator';
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from './ui/breadcrumb';
import React from 'react';
import {useHeader} from '@/store/header-store';
export type TBreadcrumb = {
  title: string;
  url: string;
};

const Header = () => {
  const breadcrumb = useHeader(state => state.breadcrumb);

  return (
    <header className='flex h-10 shrink-0 items-center gap-2'>
      <div className='flex items-center gap-2 px-3'>
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;
