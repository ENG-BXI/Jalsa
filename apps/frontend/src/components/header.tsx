import {useHeader} from '@/store/header-store';
import {IconHash} from '@tabler/icons-react';

const Header = () => {
  const header = useHeader(state => state.header);

  return (
    <header className='flex min-h-12 shrink-0 items-center gap-2 px-5 border-b'>
      <IconHash />
      {header.title}
    </header>
  );
};

export default Header;
