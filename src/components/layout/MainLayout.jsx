import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <div className="grain-overlay" aria-hidden="true" />
            <Header />
            <main className="pt-32 pb-20">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
