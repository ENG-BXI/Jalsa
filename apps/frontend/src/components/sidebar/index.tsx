import AllServersSidebar from './all-server-sidebar';
import {servers} from './helper';

const SideBar = () => {
  return (
    <div>
      <AllServersSidebar servers={servers} />
    </div>
  );
};

export default SideBar;
