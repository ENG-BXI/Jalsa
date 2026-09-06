import App from '@/App';
import {createBrowserRouter} from 'react-router';

const Routers = createBrowserRouter([
  {
    path: '/',
    Component: () => <App />,
    children: [
      {
        path: '/server/:id',
        lazy: async () => {
          const {default: Component} = await import('@/feature/server');
          return {Component};
        }
      },
      {
        path: 'direct-message',
        lazy: async () => {
          const {default: Component} = await import('@/feature/direct-message');
          return {Component};
        }
      }
    ]
  }
]);

export default Routers;
