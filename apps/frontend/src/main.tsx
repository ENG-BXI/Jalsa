import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router';
import Routers from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={Routers} />
  </StrictMode>
);
