import {Outlet, useLocation, useNavigate} from 'react-router';
import {LayoutProvider} from './context/layout-provider';
import SideBar from './components/sidebar';
import {useEffect} from 'react';
import {AppDialog} from './components/app-dialog';
import {useSocketSetup} from './Realtime/socket';
import {cn} from 'cn';
import useSideBar from './hooks/use-side-bar';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const {hideSideBar} = useSideBar();

  useSocketSetup();
  useEffect(() => {
    if (pathName == '/') navigate('/direct-message');
  }, [navigate, pathName]);
  return (
    <main>
      <LayoutProvider>
        <div className={cn('bg-primary-2 h-dvh flex overflow-hidden', hideSideBar && 'px-3')}>
          <SideBar />
          <div className={cn('flex flex-1 mt-2 rounded-tl-lg overflow-hidden border border-border-1', hideSideBar && 'rounded-t-lg')}>
            <div className='flex-1'>
              <Outlet />
            </div>
          </div>
          <AppDialog />
        </div>
      </LayoutProvider>
    </main>
  );
}

export default App;
