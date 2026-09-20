import {Outlet, useLocation, useNavigate} from 'react-router';
import {LayoutProvider} from './context/layout-provider';
import SideBar from './components/sidebar';
import {useEffect} from 'react';
import { AppDialog } from './components/app-dialog';
import { Toaster } from 'sonner';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  useEffect(() => {
    if (pathName == '/') navigate('/direct-message');
  }, [navigate, pathName]);
  return (
    <main>
      <LayoutProvider>
        <div className='bg-primary-2 h-screen flex overflow-hidden'>
          <SideBar />
          <div className='flex flex-1 mt-2 rounded-tl-lg overflow-hidden border border-border-1'>
            <div className='flex-1'>
              <Outlet />
            </div>
          </div>
          <AppDialog />
          <Toaster position='top-right' richColors />
        </div>
      </LayoutProvider>
    </main>
  );
}

export default App;
