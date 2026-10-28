import useSideBar from '@/hooks/use-side-bar';
import {useHeader} from '@/store/header-store';
import {IconHash, IconSquareRoundedArrowLeft} from '@tabler/icons-react';
import {Button} from './ui/button';
import {useNavigate} from 'react-router';
import {cn} from 'cn';

const Header = () => {
  const header = useHeader(state => state.header);
  const navigate = useNavigate();
  const {hideSideBar, isMessagesPage} = useSideBar();
  return (
    header.title &&
    isMessagesPage && (
      <header className={cn('flex min-h-12 shrink-0 items-center gap-2 px-5 border-b')}>
        {hideSideBar && (
          <Button
            onClick={() => {
              navigate(-1);
            }}
            variant={'ghost'}
            size={'icon-lg'}
          >
            <IconSquareRoundedArrowLeft className='size-6' />
          </Button>
        )}
        <IconHash />
        {header.title}
      </header>
    )
  );
};

export default Header;
