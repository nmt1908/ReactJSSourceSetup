import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-foreground font-sans antialiased overflow-x-hidden relative">
            {/* Background Grid Decoration */}
            <div className="fixed inset-0 bg-grid-white pointer-events-none opacity-20" aria-hidden="true" />
            
            <main className="relative min-h-screen w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
