import {Navigate, Outlet} from 'react-router';
import {useMe} from '../api/auth/api';
import {useUser} from '@/store/user-info-store';
import Cookies from 'universal-cookie';
import AuthLoadingPage from '@/components/auth-loading-page';
const AuthMiddleware = () => {
  const cookie = new Cookies();
  const token = cookie.get('token');
  const {data: res, isLoading} = useMe({select: res => res.data, enabled: !!token});
  const setUser = useUser(state => state.setUser);
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  if (isLoading) {
    return <AuthLoadingPage />;
  }
  if (!res) {
    return <Navigate to='/login' replace />;
  }
  setUser(res.data);
  return <Outlet />;
};

export default AuthMiddleware;
