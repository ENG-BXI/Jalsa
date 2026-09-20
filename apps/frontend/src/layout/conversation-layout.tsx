import Header from '@/components/header';
import ChannelSidebar from '@/components/sidebar/ChannelSidebar.tsx';
import {Outlet} from 'react-router';

const ConversationLayout = () => {
  return (
    <div className='flex h-full'>
      <ChannelSidebar />
      <div className='bg-primary-1 flex flex-col flex-1'>
        <Header />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ConversationLayout;
