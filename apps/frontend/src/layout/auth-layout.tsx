import {Outlet} from 'react-router';

const AuthLayout = () => {
  return (
    <main className='flex min-h-dvh items-center justify-center bg-brand px-4'>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
