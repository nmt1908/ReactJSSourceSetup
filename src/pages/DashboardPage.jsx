import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Scan, MousePointerClick, ArrowLeft } from 'lucide-react';
import { useNativeScanner } from '@/hooks/useNativeScanner';
import { cn } from '@/lib/utils';
import DigitalClock from '@/components/common/DigitalClock';
import useResponsive from '@/hooks/useResponsive';
import { useAppStore } from '@/store/appStore';
import { machineApi } from '@/api/machineApi';
import { moldApi } from '@/api/moldApi';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { isHighResPad } = useResponsive();
    const { t, i18n } = useTranslation();
    const user = useAppStore(state => state.user);
    const logout = useAppStore(state => state.logout);
    
    // State management purely from DB Query
    const [activeMolds, setActiveMolds] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. Fetch active molds from DB (Independent of socket)
    const fetchActiveMolds = async () => {
        try {
            setIsRefreshing(true);
            const res = await moldApi.getAllActiveMolds();
            if (res.status === 'success') {
                setActiveMolds(res.data);
            }
        } catch (err) {
            console.error("Fetch active molds error:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchActiveMolds();
        const interval = setInterval(fetchActiveMolds, 10000); // Pulse every 10s
        return () => clearInterval(interval);
    }, []);

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [viewMode, setViewMode] = useState('choice'); // 'choice' or 'manual'

    const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'error'
    const [statusMessage, setStatusMessage] = useState('');

    const [debugQr, setDebugQr] = useState('');

    // Logic chung để xử lý mã QR (cả từ máy quét và nhập tay)
    const processQrData = async (rawQrData) => {
        if (!rawQrData || scanStatus !== 'idle') return;
        
        setScanStatus('scanning');
        try {
            const result = await machineApi.getMachineByMtsCode(rawQrData);
            if (result && result.id) {
                setScanStatus('success');
                setStatusMessage(result.id);
                
                // Đợi 1.2s để người dùng thấy thông báo thành công rồi mới chuyển trang
                setTimeout(() => {
                    navigate(`/machine/${result.id}`);
                }, 1200);
            } else {
                setScanStatus('error');
                setStatusMessage(t('no_results') + `: ${rawQrData}`);
                setTimeout(() => setScanStatus('idle'), 3000);
            }
        } catch (error) {
            setScanStatus('error');
            setStatusMessage(t('connection_error') || "Server Connection Error");
            setTimeout(() => setScanStatus('idle'), 3000);
        }
    };


    // Integrate Native Scanner 
    const { startScan } = useNativeScanner(processQrData);

    const handleDebugSubmit = (e) => {
        if (e.key === 'Enter') {
            processQrData(debugQr);
            setDebugQr('');
        }
    };


    // 2. Dynamic machine list based PURELY on DB Mold Info
    const machines = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => {
            const id = `F1_${(i + 1).toString().padStart(2, '0')}`;
            const moldInfo = activeMolds[id];
            
            return {
                id,
                hasMold: !!moldInfo, // True if (unmounted_at IS NULL) record exists
                activeMoldData: moldInfo || null
            };
        });
    }, [activeMolds]);

    // 2. Memoize navigation handler
    const handleMachineClick = useCallback((id) => {
        navigate(`/machine/${id}`);
    }, [navigate]);


    return (
        <div className={cn(
            "h-screen w-full bg-[#050505] flex flex-col items-center p-4 relative overflow-hidden font-sans no-select border-none",
            isHighResPad && "p-2"
        )}>

            <div className={cn(
                "w-full flex justify-between items-center z-50 mb-2 px-6 pt-4 sticky top-0",
                isHighResPad && "px-4 pt-6"
            )}>

                <div className="flex items-center gap-4">
                    {/* Position 1: Back Button */}
                    {viewMode === 'manual' && (
                        <button
                            onClick={() => setViewMode('choice')}
                            className={cn(
                                "flex items-center justify-center gap-3 px-8 py-3.5 min-w-[140px] md:min-w-[180px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95 z-50",
                                isHighResPad && "px-10 py-4 text-sm min-w-[200px]"
                            )}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>{t('back') || 'BACK'}</span>
                        </button>
                    )}

                    {/* Position 2: History Button */}
                    <button 
                        onClick={() => navigate('/history')}
                        className={cn(
                            "flex items-center justify-center gap-3 px-8 py-3.5 min-w-[140px] md:min-w-[180px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95",
                            isHighResPad && "px-10 py-4 text-sm min-w-[200px]"
                        )}
                    >
                        {t('history')}
                    </button>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <DigitalClock />
                </div>


                <div className="flex gap-4">
                    {/* Position 3: User Info */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={cn(
                                "flex items-center gap-3 bg-[#1a1b23] hover:bg-white/[0.08] px-6 py-2.5 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-2xl",
                                isHighResPad && "px-8 py-3"
                            )}
                        >
                            <UserIcon className="w-5 h-5 text-blue-500" />
                            <span className={cn(
                                "text-zinc-100 text-sm font-black italic tracking-widest uppercase",
                                isHighResPad && "text-base"
                            )}>{user?.empNo || 'GUEST'}</span>
                        </button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        // Menu opens to the right to avoid going off-screen if on the far right
                                        className="absolute top-[120%] right-0 w-56 bg-[#1a1b23] rounded-[2rem] z-50 p-1.5 shadow-3xl border border-white/10"
                                    >
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/login');
                                            }}
                                            className="w-full flex items-center gap-4 px-6 py-5 text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[11px] rounded-[1.5rem]"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            {t('logout')}
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex bg-[#1a1b23] p-1.5 rounded-2xl border border-white/10">
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
                isHighResPad && "mt-2 mb-6",
                viewMode === 'choice' ? "block" : "hidden"
            )}>
                <h2 className={cn(
                    "text-zinc-200 text-[clamp(1.5rem,6vh,2.5rem)] font-black tracking-[0.6em] uppercase mb-4 italic text-glow-blue",
                    isHighResPad && "text-xl"
                )}>
                    {t('select_mode') || 'CHỌN CHẾ ĐỘ'}
                </h2>
                <div className={cn(
                    "h-2 w-48 bg-blue-600 mx-auto rounded-full shadow-[0_0_25px_rgba(37,99,235,0.7)]",
                    isHighResPad && "h-1 w-32"
                )} />
            </div>

            <div className={cn(
                "flex-1 w-full max-w-full px-8 mb-6 relative pt-6 md:pt-14",
                viewMode === 'choice' ? "flex flex-col items-center justify-center gap-12" : "block"
            )}
            >
                {viewMode === 'choice' ? (
                    <div className="flex flex-col gap-12 scale-110">
                        <div className="flex gap-12">
                            {/* Option 1: Scan QR */}
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={startScan}
                                className="flex flex-col items-center justify-center gap-8 w-80 h-80 bg-blue-600 rounded-[3.5rem] border-4 border-blue-400/40 shadow-2xl shadow-blue-600/30 group relative overflow-hidden"
                            >
                                <div className="w-24 h-24 bg-white/20 rounded-[1.5rem] flex items-center justify-center relative z-10">
                                    <Scan className="w-12 h-12 text-white" />
                                </div>
                                <span className="text-white text-2xl font-black italic uppercase tracking-[0.2em] relative z-10">
                                    {t('scan_qr')}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            </motion.button>

                            {/* Option 2: Manual Selection */}
                            <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setViewMode('manual')}
                                className="flex flex-col items-center justify-center gap-8 w-80 h-80 bg-[#111218] rounded-[3.5rem] border-4 border-white/10 shadow-2xl group relative overflow-hidden"
                            >
                                <div className="w-24 h-24 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center relative z-10 border border-blue-500/20">
                                    <MousePointerClick className="w-12 h-12 text-blue-500" />
                                </div>
                                <span className="text-zinc-200 text-2xl font-black italic uppercase tracking-[0.2em] relative z-10">
                                    {t('manual_selection')}
                                </span>
                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.button>
                        </div>

                        {/* DEBUG QR INPUT FOR BROWSER TESTING - Commented out for production */}
                        {/* 
                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                                Debug Console (Enter raw QR data)
                            </div>
                            <input
                                type="text"
                                value={debugQr}
                                onChange={(e) => setDebugQr(e.target.value)}
                                onKeyDown={handleDebugSubmit}
                                placeholder="e.g. EMSVG|Y50BL01900080023"
                                className="w-full bg-[#1a1b23] border-2 border-white/5 rounded-2xl px-6 py-4 text-white text-center font-mono text-sm focus:border-blue-600/50 outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>
                        */}

                    </div>

                ) : (
                    <div className={cn(
                        "w-full h-full grid grid-cols-6 grid-rows-4 gap-4",
                        isHighResPad && "gap-7"
                    )}>
                        {machines.map((machine) => (
                            <MachineCard
                                key={machine.id}
                                machine={machine}
                                onClick={handleMachineClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="py-4 text-zinc-500 font-black tracking-[0.8em] text-[10px] uppercase z-10 italic opacity-60">
                PAD INPUT SYSTEM • F1 WORKSHOP • v2.0
            </div>

            {/* Status Overlay for visual feedback */}
            <StatusOverlay status={scanStatus} message={statusMessage} />
        </div>
    );
};

// --- Beautiful Status Overlay Component ---
const StatusOverlay = ({ status, message }) => {
    const { t } = useTranslation();
    if (status === 'idle') return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                    "p-12 rounded-[3.5rem] flex flex-col items-center gap-8 shadow-2xl border-4 text-center max-w-lg mx-4",
                    status === 'success' && "bg-emerald-600/20 border-emerald-500/50",
                    status === 'error' && "bg-red-600/20 border-red-500/50",
                    status === 'scanning' && "bg-blue-600/20 border-blue-500/50"
                )}
            >
                <div className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center",
                    status === 'success' && "bg-emerald-500",
                    status === 'error' && "bg-red-500",
                    status === 'scanning' && "bg-blue-500 animate-pulse"
                )}>
                    {status === 'success' && (
                        <motion.svg 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-white"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                    )}
                    {status === 'error' && <span className="text-6xl text-white font-black">!</span>}
                    {status === 'scanning' && <Scan className="w-16 h-16 text-white animate-spin-slow" />}
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className={cn(
                        "text-3xl font-black italic uppercase tracking-widest",
                        status === 'success' && "text-emerald-400",
                        status === 'error' && "text-red-400",
                        status === 'scanning' && "text-blue-400"
                    )}>
                        {status === 'success' && t('success')}
                        {status === 'error' && t('failed')}
                        {status === 'scanning' && t('processing')}
                    </h3>
                    <p className="text-white/60 font-medium text-lg tracking-tight">
                        {status === 'success' ? t('entering_machine', { id: message }) : message}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};


// 3. Memoized MachineCard for maximum performance
const MachineCard = memo(({ machine, onClick }) => {
    return (
        <div
            onClick={() => onClick(machine.id)}
            className={cn(
                "relative flex flex-col items-center justify-center border cursor-pointer overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] gpu-accelerated transition-all duration-200",
                machine.hasMold
                    ? "bg-blue-600 border-blue-400/40 text-white shadow-xl shadow-blue-900/20 active:bg-blue-500 active:transform active:scale-95"
                    : "bg-[#111218] border-white/5 text-amber-500 active:bg-[#1a1b23] active:transform active:scale-95"
            )}
            style={{ contain: 'layout paint' }}
        >
            {machine.hasMold && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/5 pointer-events-none z-0"
                />
            )}

            <div className="absolute top-[12%] right-[12%]">
                <motion.div
                    animate={machine.hasMold ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
                    transition={machine.hasMold ? { duration: 1.5, repeat: Infinity } : {}}
                    className={cn(
                        "w-3 h-3 md:w-3.5 md:h-3.5 rounded-full shadow-lg",
                        machine.hasMold 
                            ? "bg-emerald-500 shadow-emerald-500/50" 
                            : "bg-amber-400 shadow-amber-400/50"
                    )}
                />
            </div>

            <div className="flex flex-col items-center justify-center h-full relative z-10">
                <span className={cn(
                    "text-[10px] md:text-[12px] font-black tracking-widest transition-colors",
                    machine.hasMold ? "text-white/60" : "text-zinc-600"
                )}>
                    {machine.id.split('_')[0]}
                </span>
                <h2 className={cn(
                    "text-4xl md:text-5xl lg:text-7xl font-black italic -mt-2 transition-colors",
                    machine.hasMold ? "text-white" : "text-amber-500"
                )}>
                    {machine.id.split('_')[1]}
                </h2>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 pointer-events-none z-10" />
        </div>
    );
});

export default DashboardPage;
