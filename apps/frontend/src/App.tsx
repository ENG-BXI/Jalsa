import {Outlet} from 'react-router';
import {LayoutProvider} from './context/layout-provider';
import Header from './components/header';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './api/instance';
import {AppDialog} from './components/app-dialog';
import {Toaster} from 'sonner';
import SideBar from './components/sidebar';

function App() {
  return (
    <main>
      <LayoutProvider>
        <QueryClientProvider client={queryClient}>
          <div className='flex max-h-screen overflow-hidden'>
            <SideBar />
            <div className='flex-1'>
              <Header />
              <Outlet />
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
