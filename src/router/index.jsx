import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import HistoryPage from '@/pages/HistoryPage';
import { useAppStore } from '@/store/appStore';

const AuthGuard = ({ children }) => {
    const user = useAppStore(state => state.user);
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <MainLayout />
            </AuthGuard>
        ),
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
                path: '/history',
                element: <HistoryPage />,
            },
            {
                path: '/about',
                element: <AboutPage />,
            },
        ],
    },
], {
    basename: import.meta.env.BASE_URL
});
