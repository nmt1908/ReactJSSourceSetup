import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, PlusCircle, User, Clock, ShieldCheck, Hash, Ruler, Tag, Package, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';

const MachineDetailPage = () => {
    const { isHighResPad } = useResponsive();
    const { machineId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const machineNum = machineId?.split('_')[1] || '01';
    const isRunning = parseInt(machineNum) <= 15;

    useEffect(() => {
        const logSize = () => console.log(`[DEBUG] Screen: ${window.innerWidth}x${window.innerHeight} | Touch: ${'ontouchstart' in window || navigator.maxTouchPoints > 0}`);
        logSize();
        window.addEventListener('resize', logSize);
        return () => window.removeEventListener('resize', logSize);
    }, []);

    const moldData = isRunning ? {
        toolingCode: 'MS12345-01',
        moldSize: '08',
        moldName: 'A1',
        article: 'AJ1-HIGH-OG-RED',
        moldId: '2024-V2-001',
        mounter: '047409',
        mountedTime: '08:30:45',
        mountedDate: '14/04/2024'
    } : null;

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center p-0 relative overflow-hidden font-sans select-none">
            {/* Animated Background Decor */}
            <motion.div 
                animate={{ 
                    x: [0, 40, 0], 
                    y: [0, -30, 0], 
                    scale: [1, 1.15, 1] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.1] rounded-full blur-[150px] pointer-events-none" 
            />
            
            {/* Speed Lines Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ 
                     backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 120px, #ffffff 120px, #ffffff 121px)',
                     backgroundSize: '200% 200%'
                 }}>
                <motion.div 
                    animate={{ backgroundPosition: ['0% 0%', '-100% -100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                />
            </div>
            <motion.div 
                animate={{ 
                    x: [0, -30, 0], 
                    y: [0, 50, 0], 
                    scale: [1, 1.1, 1] 
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/[0.05] rounded-full blur-[120px] pointer-events-none" 
            />



            {/* 3. MAIN DATA PANEL */}
            <div className={cn(
                "flex-1 w-full flex items-center justify-center px-4 mt-8 mb-4 min-h-0 transition-all",
                isHighResPad ? "max-w-[96%] mt-2" : "max-w-7xl"
            )}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "w-full bg-[#0c0d12]/95 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 relative overflow-hidden border-2 border-white/[0.08] shadow-3xl flex flex-col h-fit",
                        isHighResPad && "p-8 max-h-[92vh]"
                    )}
                >
                    <div className="absolute inset-0 border border-blue-500/10 rounded-[2.5rem] md:rounded-[3rem] pointer-events-none" />

                    {/* Light Sweep Effect */}
                    <motion.div 
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
                        className="absolute top-0 bottom-0 w-64 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[25deg] z-10 pointer-events-none"
                    />

                    <div className="flex flex-col h-full relative z-20">
                        {/* 1. Permanent Header Row (Always visible) */}
                        <div className={cn(
                            "flex justify-between items-center mb-12 w-full",
                            isHighResPad && "mb-8 px-2"
                        )}>
                            {/* Back Button */}
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/')}
                                className="flex items-center gap-4 bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/10 transition-all shadow-xl group"
                            >
                                <ArrowLeft className="w-6 h-6 text-blue-500 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-zinc-400 text-xs font-black italic tracking-[0.2em] uppercase">{t('back') || 'BACK'}</span>
                            </motion.button>

                            {/* Unified Title (Thông tin khuôn + Máy) */}
                            <div className="flex flex-col items-end border-r-[6px] border-blue-500 pr-8 overflow-visible py-1">
                                <h3 className={cn(
                                    "text-[clamp(1.5rem,4vw,2.8rem)] font-black italic text-white uppercase tracking-tight leading-snug pr-4",
                                    isHighResPad && "text-2xl"
                                )}>
                                    {t('machine')} F1 - {machineNum}
                                </h3>
                                <span className={cn(
                                    "text-blue-500 text-lg md:text-xl font-black italic mt-1 tracking-tighter pr-4 uppercase",
                                    isHighResPad && "text-base"
                                )}>
                                    {isRunning ? t('mold_in_use') : t('ready_to_mount')}
                                </span>
                            </div>
                        </div>

                        {isRunning ? (
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { 
                                            staggerChildren: 0.08, 
                                            delayChildren: 0.1,
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }
                                    }
                                }}
                                className="flex flex-col"
                            >
                                <div className={cn(
                                "grid grid-cols-12 gap-10 items-center",
                                isHighResPad && "gap-6"
                            )}>
                                <div className={cn(
                                    "col-span-12 lg:col-span-7 space-y-8",
                                    isHighResPad && "space-y-4"
                                )}>
                                    <DataGroup icon={Hash} label="Tooling Code" value={moldData.toolingCode} />
                                    <div className={cn(
                                        "grid grid-cols-2 gap-10",
                                        isHighResPad && "gap-6"
                                    )}>
                                        <DataGroup icon={Ruler} label="Mold Size" value={moldData.moldSize} />
                                        <DataGroup icon={Tag} label="Mold Name" value={moldData.moldName} />
                                    </div>
                                    <DataGroup icon={Package} label="Article / Colorway" value={moldData.article} />
                                    <DataGroup icon={Fingerprint} label="Mold ID" value={moldData.moldId} isPrimary />
                                </div>

                                <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end">
                                    <BigAction
                                        icon={Trash2}
                                        label={t('unmount_mold')}
                                        desc={t('unmount_desc')}
                                        color="red"
                                    />
                                </div>
                            </div>

                            <div className={cn(
                                "mt-12 pt-8 border-t-2 border-white/[0.08] grid grid-cols-3 gap-12 overflow-visible",
                                isHighResPad && "mt-8 pt-6 gap-8"
                            )}>
                                <MetadataBlock icon={User} label={t('mounter_label')} value={moldData.mounter} />
                                <MetadataBlock icon={Clock} label={t('time_label')} value={moldData.mountedTime} />
                                <MetadataBlock icon={ShieldCheck} label={t('date_label')} value={moldData.mountedDate} />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                            <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-10">{t('empty_machine')}</h3>
                            <button className="h-24 px-16 rounded-[3.5rem] bg-blue-600 text-white text-2xl font-black italic uppercase tracking-[0.2em] shadow-2xl flex items-center gap-6 active:scale-95 transition-all">
                                <PlusCircle className="w-10 h-10" />
                                {t('mount_now')}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>

            <div className="py-2 text-zinc-500 font-black tracking-[0.8em] text-[10px] uppercase italic opacity-60">
                F1 WORKSHOP • v2.0
            </div>
        </div>
    );
};

const DataGroup = ({ icon: Icon, label, value, isPrimary }) => {
    const { isHighResPad } = useResponsive();
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, x: -40, filter: 'blur(10px)' },
                visible: { 
                    opacity: 1, 
                    x: 0, 
                    filter: 'blur(0px)',
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                }
            }}
            className="flex flex-col overflow-visible group"
        >
            <div className="flex items-center gap-2 mb-1">
                <div className="relative flex items-center justify-center">
                    {Icon && <Icon className="w-3.5 h-3.5 text-blue-500/60 group-hover:text-blue-400 transition-colors z-10" />}
                    {/* HUD spinning ring */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-4px] border border-blue-500/20 border-t-blue-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                </div>
                <span className={cn(
                    "text-xs font-black text-zinc-400 uppercase tracking-[0.3em] italic leading-none pr-4",
                    isHighResPad && "text-[11px]"
                )}>{label}</span>
            </div>
            <motion.span 
                animate={isPrimary ? { opacity: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
                className={cn(
                    "text-[clamp(1.8rem,4.5vw,4.2rem)] font-black italic tracking-tighter leading-tight transition-all pr-8 overflow-visible",
                    isHighResPad ? "text-[clamp(1.6rem,4vw,3.2rem)]" : "",
                    isPrimary ? "text-[#3b82f6] text-glow-blue" : "text-white group-hover:text-blue-100/90"
                )}
            >
                {value}
            </motion.span>
        </motion.div>
    );
};

const MetadataBlock = ({ icon: Icon, label, value }) => {
    const { isHighResPad } = useResponsive();
    return (
        <div className="flex items-center gap-5 overflow-visible">
            <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20",
                isHighResPad && "w-14 h-14"
            )}>
                <Icon className="w-6 md:w-8 h-6 md:h-8" />
            </div>
        <div className="min-w-0 flex flex-col overflow-visible">
            <p className="text-xs text-zinc-400 font-black uppercase tracking-widest mb-0.5 italic leading-snug pr-4 whitespace-nowrap">{label}</p>
            <p className={cn(
                "text-xl font-black italic text-zinc-100 leading-snug pr-6 whitespace-nowrap",
                isHighResPad && "text-lg"
            )}>{value}</p>
        </div>
        </div>
    );
};

const BigAction = ({ icon: Icon, label, desc, color }) => {
    const { isHighResPad } = useResponsive();
    return (
        <button className={cn(
            "w-full max-w-sm p-8 rounded-[3rem] border-[3px] transition-all active:scale-95 group relative overflow-hidden flex items-center gap-6 text-left",
            color === 'red' ? "bg-red-500/10 border-red-500/40 text-red-500 hover:bg-red-500/20 shadow-2xl" : "",
            isHighResPad ? "p-6 scale-95" : "scale-110 lg:scale-120"
        )}>
            <div className={cn(
                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-red-500/20",
                isHighResPad && "w-12 h-12"
            )}>
                <Icon className={cn("w-8 h-8 text-red-500", isHighResPad && "w-6 h-6")} />
            </div>
            <div className="min-w-0">
                <p className={cn(
                    "text-xl md:text-2xl font-black italic uppercase tracking-tight leading-none",
                    isHighResPad && "text-lg md:text-xl"
                )}>{label}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mt-2 leading-tight">{desc}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default MachineDetailPage;
