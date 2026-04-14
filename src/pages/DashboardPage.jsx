import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Maximize2, Minimize2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Generate 24 dummy machines (F1_01 to F1_24)
    const machines = Array.from({ length: 24 }, (_, i) => {
        const id = `F1_${String(i + 1).padStart(2, '0')}`;
        const hasMold = i < 15;
        return { id, hasMold };
    });

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center p-4 relative overflow-hidden font-sans select-none border-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full flex justify-between items-start z-50 mb-2 px-6 pt-4 sticky top-0">
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] px-6 py-2.5 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-2xl backdrop-blur-md"
                    >
                        <User className="w-5 h-5 text-blue-500" />
                        <span className="text-zinc-100 text-sm font-black italic tracking-widest uppercase">047409</span>
                    </button>
                    
                    <AnimatePresence>
                        {showUserMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-[120%] left-0 w-56 glass-card rounded-[2rem] z-50 p-1.5 shadow-3xl border-blue-500/20"
                                >
                                    <button className="w-full flex items-center gap-4 px-6 py-5 text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[11px] rounded-[1.5rem]">
                                        <LogOut className="w-5 h-5" />
                                        {t('logout')}
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-500 hover:text-white transition-all backdrop-blur-md active:scale-90"
                    >
                        {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                    </button>
                    
                    <button className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95">
                        {t('history')}
                    </button>

                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                        {['vi', 'zh', 'en'].map((l) => (
                            <button
                                key={l}
                                onClick={() => i18n.changeLanguage(l)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                                    i18n.language === l ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center mt-6 mb-10 z-10">
                <h2 className="text-zinc-200 text-[clamp(1.5rem,6vh,2.5rem)] font-black tracking-[0.6em] uppercase mb-4 italic text-glow-blue">
                    {t('select_machine') || 'CHỌN MÁY'}
                </h2>
                <div className="h-2 w-48 bg-blue-600 mx-auto rounded-full shadow-[0_0_25px_rgba(37,99,235,0.7)]" />
            </div>

            <div className="flex-1 w-full max-w-full px-8 mb-6 grid grid-cols-6 grid-rows-4 gap-4 min-h-0">
                {machines.map((machine, index) => (
                    <motion.div
                        key={machine.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.005 }}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/machine/${machine.id}`)}
                        className={cn(
                            "relative flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl rounded-[2.5rem] lg:rounded-[3.5rem]",
                            machine.hasMold 
                                ? "bg-blue-600 border-blue-400/50 text-white shadow-blue-600/30" 
                                : "bg-[#111218] border-amber-500/30 text-amber-500 hover:border-amber-500/60"
                        )}
                    >
                        <div className="absolute top-[12%] right-[12%]">
                            <div className={cn(
                                "w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full shadow-[0_0_12px_currentColor]",
                                machine.hasMold ? "text-emerald-400 bg-emerald-500" : "text-amber-500 bg-amber-500 shadow-amber-500/50"
                            )} />
                        </div>

                        <div className="flex flex-col items-center justify-center h-full">
                            <span className={cn(
                                "text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] opacity-40 leading-none mb-1",
                                machine.hasMold ? "text-white" : "text-amber-500/70"
                            )}>
                                F1
                            </span>
                            <span className={cn(
                                "text-[clamp(3rem,10vh,6rem)] font-black italic tracking-tighter leading-none drop-shadow-2xl",
                                machine.hasMold ? "text-white" : "text-amber-500"
                            )}>
                                {machine.id.split('_')[1]}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            <div className="py-4 text-zinc-800 font-black tracking-[0.5em] text-[10px] uppercase z-10 italic opacity-40">
                PAD INPUT SYSTEM • F1 WORKSHOP • v2.0
            </div>
        </div>
    );
};

export default DashboardPage;
