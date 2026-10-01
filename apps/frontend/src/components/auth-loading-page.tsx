import {IconLoader2, IconMessages} from '@tabler/icons-react';

const AuthLoadingPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-primary-1'>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex size-20 items-center justify-center rounded-3xl bg-primary-3 shadow-lg'>
          <IconMessages size={40} className='text-white' stroke={1.5} />
        </div>

        <div className='flex flex-col items-center gap-3'>
          <h1 className='text-xl font-bold tracking-wider text-white'>JALSA</h1>

          <div className='flex items-center gap-2 text-sm font-medium text-text-1'>
            <IconLoader2 size={16} className='animate-spin' />
            <span>Connecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingPage;
