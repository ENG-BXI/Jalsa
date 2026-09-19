import App from '@/App';
import AuthLayout from '@/layout/auth-layout';
import AuthMiddleware from '@/middleware/auth.middleware';
import GuestMiddleware from '@/middleware/guest.middleware';
import {createBrowserRouter} from 'react-router';

const Routers = createBrowserRouter([
  {
    element: <AuthMiddleware />,
    children: [
      {
        path: '/',
        Component: App,
        children: [
          {
            path: 'server/:serverName',
            children: [
              {
                index: true,
                lazy: async () => {
                  const {default: Component} = await import('@/feature/server');
                  return {Component};
                }
              },
              {
                path: ':channelName',
                lazy: async () => {
                  const {default: Component} = await import('@/feature/server/text-channel');
                  return {Component};
                }
              }
            ]
          },
          {
            path: 'direct-message',
            lazy: async () => {
              const {default: Component} = await import('@/feature/direct-message');
              return {Component};
            }
          },
          {
            path: 'community',
            lazy: async () => {
              const {default: Component} = await import('@/feature/community');
              return {Component};
            }
          }
        ]
      }
    ]
  },
  {
    element: <GuestMiddleware />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            lazy: async () => {
              const {default: Component} = await import('@/feature/auth/login');
              return {Component};
            }
          },
          {
            path: 'register',
            lazy: async () => {
              const {default: Component} = await import('@/feature/auth/register');
              return {Component};
            }
          }
        ]
      }
    ]
  }
]);

export default Routers;
