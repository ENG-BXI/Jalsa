import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router';
import Routers from './routes';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './api/instance';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Routers} />
      <Toaster position='top-right' richColors />
    </QueryClientProvider>
  </StrictMode>
);
