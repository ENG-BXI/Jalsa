import {useEffect, useState} from 'react';
import {useIsMobile} from './use-mobile';

const useSideBar = () => {
  const isMobile = useIsMobile();
  const pathName = location.pathname;
  const [hasSideBar, setHasSideBar] = useState(false);
  const [hideSideBar, setHideSideBar] = useState(false);
  const [isMessagesPage, setIsMessagesPage] = useState(false);
  useEffect(() => {
    const hasSideBar = pathName == '/direct-message' || (pathName.startsWith('/server') && pathName.split('/').length <= 3);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasSideBar(hasSideBar);
  }, [pathName]);
  useEffect(() => {
    const hideSideBar = isMobile && !hasSideBar;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHideSideBar(hideSideBar);
  }, [hasSideBar, isMobile]);

  useEffect(() => {
    const isMessagesPage = (pathName != '/server' && pathName.startsWith('/server') && pathName.split('/').length > 3) || (pathName !== '/direct-message' && pathName.startsWith('/direct-message'));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMessagesPage(isMessagesPage);
  }, [pathName]);
  return {hideSideBar, isMobile, hasSideBar, isMessagesPage};
};

export default useSideBar;
