/**
 * LEO Senior Standard Reactor - Project Entry
 * @author Nguyễn Minh Tâm (AKA LEO)
 * @born 19/08/2003
 */
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { router } from './router';
import './config/i18n';
import './index.css';

import SmoothScroll from './components/layout/SmoothScroll';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <RouterProvider router={router} />
      </SmoothScroll>
    </QueryClientProvider>
  );
}

export default App;
