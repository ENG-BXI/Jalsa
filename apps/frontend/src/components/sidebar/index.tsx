import {useMyServers} from '@/api/server/api';
import AllServersSidebar from './AllServerSidebar/all-server-sidebar';
import AllServersSidebarSkeleton from './AllServerSidebar/all-servers-sidebar-skeleton';
import {useEffect} from 'react';
import {useAppDialog} from '@/store/dialog-store';
import CreateServerForm from '../server/create-server-form';

const SideBar = () => {
  const {data: servers, isLoading} = useMyServers({select: res => res.data.data});
  const {setDialog, dialog, onClose, setDisabled} = useAppDialog();
  useEffect(() => {
    if (isLoading) return;
    if (servers?.length == 0) {
      setDisabled(true);
      setDialog({
        title: {
          title: 'Create Your Server',
          className: 'text-center'
        },

        description: {
          description: 'Create a server and start building your own community.',
          className: 'text-center'
        },

        content: <CreateServerForm onClose={() => {}} />,

        primaryAction: {
          text: 'Create Server',
          formId: 'create-server-form'
        }
      });
    } else {
      if (dialog) {
        setDisabled(null);
        onClose();
      }
    }
  }, [isLoading, servers?.length]);
  return <div>{isLoading ? <AllServersSidebarSkeleton /> : <AllServersSidebar servers={servers || []} />}</div>;
};

export default SideBar;
