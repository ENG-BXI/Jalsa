import {Outlet} from 'react-router';
import {LayoutProvider} from './context/layout-provider';
import Header from './components/header';
import SideBar from './components/sidebar';
import ChannelSidebar from './components/sidebar/ChannelSidebar.tsx';

function App() {
  return (
    <main>
      <LayoutProvider>
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
      </LayoutProvider>
    </main>
  );
}

export default App;
