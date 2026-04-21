import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Maximize2, Minimize2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import DigitalClock from '@/components/common/DigitalClock';
import useResponsive from '@/hooks/useResponsive';


const DashboardPage = () => {
    const { isHighResPad } = useResponsive();
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
        <motion.div className={cn(
            "h-screen w-full bg-[#050505] flex flex-col items-center p-4 relative overflow-hidden font-sans select-none border-none",
            isHighResPad && "p-2"
        )}>
            {/* Animated Background Decor */}
            <motion.div 
                animate={{ 
                    x: [0, 50, 0], 
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1] 
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" 
            />
            <motion.div 
                animate={{ 
                    x: [0, -40, 0], 
                    y: [0, -60, 0],
                    scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" 
            />

            {/* Speed Lines Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                     backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, #ffffff 100px, #ffffff 101px)',
                     backgroundSize: '200% 200%'
                 }}>
                <motion.div 
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                />
            </div>

            <div className={cn(
                "w-full flex justify-between items-center z-50 mb-2 px-6 pt-4 sticky top-0",
                isHighResPad && "px-4 pt-6"
            )}>

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={cn(
                            "flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] px-6 py-2.5 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-2xl backdrop-blur-md",
                            isHighResPad && "px-8 py-3"
                        )}
                    >
                        <User className="w-5 h-5 text-blue-500" />
                        <span className={cn(
                            "text-zinc-100 text-sm font-black italic tracking-widest uppercase",
                            isHighResPad && "text-base"
                        )}>047409</span>
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

                <div className="absolute left-1/2 -translate-x-1/2">
                    <DigitalClock />
                </div>


                <div className="flex gap-4">
                    <button
                        onClick={toggleFullscreen}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-500 hover:text-white transition-all backdrop-blur-md active:scale-90"
                    >
                        {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                    </button>

                    <button className={cn(
                        "px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95",
                        isHighResPad && "px-10 py-4 text-sm"
                    )}>
                        {t('history')}
                    </button>

                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                        {['vi', 'zh', 'en'].map((l) => (
                            <button
                                key={l}
                                onClick={() => i18n.changeLanguage(l)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                                    isHighResPad && "px-6 py-2.5 text-xs",
                                    i18n.language === l ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={cn(
                "text-center mt-6 mb-10 z-10",
                isHighResPad && "mt-2 mb-6"
            )}>
                <h2 className={cn(
                    "text-zinc-200 text-[clamp(1.5rem,6vh,2.5rem)] font-black tracking-[0.6em] uppercase mb-4 italic text-glow-blue",
                    isHighResPad && "text-xl"
                )}>
                    {t('select_machine') || 'CHỌN MÁY'}
                </h2>
                <div className={cn(
                    "h-2 w-48 bg-blue-600 mx-auto rounded-full shadow-[0_0_25px_rgba(37,99,235,0.7)]",
                    isHighResPad && "h-1 w-32"
                )} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.012 }
                    }
                }}
                className={cn(
                    "flex-1 w-full max-w-full px-8 mb-6 grid grid-cols-6 grid-rows-4 gap-4 min-h-0 relative",
                    isHighResPad && "px-4 mb-4 gap-7"
                )}
            >
                {/* HUD Light Sweep Effect - Optimized Frequency */}
                <motion.div 
                    animate={{ left: ['-100%', '250%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 10 }}
                    style={{ willChange: 'transform' }}
                    className="absolute top-0 bottom-0 w-64 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[35deg] z-20 pointer-events-none"
                />

                {machines.map((machine, index) => (
                    <motion.div
                        key={machine.id}
                        variants={{
                            hidden: { opacity: 0, scale: 0.8, x: -20 },
                            visible: { 
                                opacity: 1, 
                                scale: 1, 
                                x: 0,
                                transition: { type: "spring", stiffness: 450, damping: 25 }
                            }
                        }}
                        whileHover="hover"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate(`/machine/${machine.id}`)}
                        className={cn(
                            "relative flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] transform-gpu",
                            machine.hasMold
                                ? "bg-blue-600 border-blue-400/40 text-white shadow-xl"
                                : "bg-[#111218] border-amber-500/20 text-amber-500"
                        )}
                    >
                        {/* Nitrous Aura - Correctly hidden by default (initial="initial") */}
                        <motion.div 
                            initial="initial"
                            variants={{
                                hover: { scale: 1.4, opacity: 0.4, filter: 'blur(40px)' },
                                initial: { scale: 1, opacity: 0, filter: 'blur(10px)' }
                            }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "absolute inset-0 pointer-events-none z-0",
                                machine.hasMold ? "bg-blue-400" : "bg-amber-400"
                            )}
                            style={{ willChange: 'transform, opacity, filter' }}
                        />
                        <div className="absolute top-[12%] right-[12%]">
                            <motion.div 
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={cn(
                                    "w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full shadow-[0_0_12px_currentColor]",
                                    machine.hasMold ? "text-emerald-400 bg-emerald-500" : "text-amber-500 bg-amber-500 shadow-amber-500/50"
                                )} 
                            />
                        </div>

                        <div className="flex flex-col items-center justify-center h-full relative z-10">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10" />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="py-4 text-zinc-500 font-black tracking-[0.8em] text-[10px] uppercase z-10 italic opacity-60"
            >
                PAD INPUT SYSTEM • F1 WORKSHOP • v2.0
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
