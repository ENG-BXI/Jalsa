import AllServersSidebar from './AllServerSidebar/all-server-sidebar';
import {servers} from './helper';

const SideBar = () => {
  return (
    <div className='flex'>
      <AllServersSidebar servers={servers} />
    </div>
  );
};

export default SideBar;
