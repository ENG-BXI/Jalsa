import Cookies from 'universal-cookie';
import {Navigate, Outlet} from 'react-router';

const GuestMiddleware = () => {
  const cookie = new Cookies();
  const token = cookie.get('token');
  if (token) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};

export default GuestMiddleware;
