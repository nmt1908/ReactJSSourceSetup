import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import AboutPage from '@/pages/AboutPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <DashboardPage />,
            },
            {
                path: '/machine/:machineId',
                element: <MachineDetailPage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
        ],
    },
]);
