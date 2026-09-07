import AllServersSidebar from './AllServerSidebar/all-server-sidebar';
import ChannelSidebar from './ChannelSidebar.tsx/channel-sidebar';
import {servers} from './helper';

const SideBar = () => {
  return (
    <div className='flex'>
      <AllServersSidebar servers={servers} />
      <ChannelSidebar />
    </div>
  );
};

export default SideBar;
