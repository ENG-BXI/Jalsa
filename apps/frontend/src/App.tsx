import {Outlet} from 'react-router';
import {LayoutProvider} from './context/layout-provider';
import Header from './components/header';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './api/instance';
import {AppDialog} from './components/app-dialog';
import {Toaster} from 'sonner';
import SideBar from './components/sidebar';
import ChannelSidebar from './components/sidebar/ChannelSidebar.tsx';

function App() {
  return (
    <main>
      <LayoutProvider>
        <QueryClientProvider client={queryClient}>
          <div className='bg-primary-2 h-screen flex overflow-hidden'>
            <SideBar />
            <div className='flex flex-1 mt-2 rounded-tl-lg overflow-hidden border border-border-1'>
              <ChannelSidebar />
              <div className='bg-primary-1 flex flex-col flex-1'>
                <Header />
                <div className='flex-1'>
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          <AppDialog />
          <Toaster dir='rtl' position='top-right' richColors />
        </QueryClientProvider>
      </LayoutProvider>
    </main>
  );
}

export default App;
