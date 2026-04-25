import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, Scan, MousePointerClick, User, Clock, ShieldCheck, Hash, Ruler, Tag, Package, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';
import Notification from '@/components/common/Notification';
import { useNativeScanner } from '@/hooks/useNativeScanner';
import { moldApi } from '@/api/moldApi';
import { useAppStore } from '@/store/appStore';
import ManualMountForm from '@/components/mold/ManualMountForm';

const MachineDetailPage = () => {
    const { isHighResPad } = useResponsive();
    
    const { machineId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useAppStore(state => state.user);
    const scannedQrData = useAppStore(state => state.scannedQrData);
    const setScannedQrData = useAppStore(state => state.setScannedQrData);
    const clearScanData = useAppStore(state => state.clearScanData);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showManualForm, setShowManualForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const [hasMold, setHasMold] = useState(false);
    const [currentMold, setCurrentMold] = useState(null);

    const machineNum = useMemo(() => machineId?.split('_')[1] || '01', [machineId]);

    // 1. Fetch Current Mold Data
    const fetchCurrentStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await moldApi.getCurrentMold(machineId);
            if (res.status === 'success' && res.data) {
                setCurrentMold(res.data);
                setHasMold(true);
            } else {
                setCurrentMold(null);
                setHasMold(false);
            }
        } catch (error) {
            console.error("Failed to fetch machine status", error);
        } finally {
            setLoading(false);
        }
    }, [machineId]);

    useEffect(() => {
        fetchCurrentStatus();
    }, [fetchCurrentStatus]);

    // Auto-restore form if QR data persists (e.g. after page reload/orientation change)
    useEffect(() => {
        if (scannedQrData) {
            setShowManualForm(true);
        }
    }, [scannedQrData]);

    // 2. Integrate Native Scanner for "Mount Mold"
    const handleScanSuccess = useCallback((data) => {
        setScannedQrData(data);
        setShowManualForm(true);
    }, [setScannedQrData]);

    const { startScan } = useNativeScanner(handleScanSuccess);

    const handleMountSuccess = useCallback(( mold_id ) => {
        console.log("🎊 [MACHINE PAGE] Mount success for:", mold_id);
        setNotification({
            show: true,
            message: t('mount_success') || 'Lên khuôn thành công!',
            type: 'success'
        });
        fetchCurrentStatus();
    }, [fetchCurrentStatus, t]);

    const handleManualFormClose = useCallback(() => {
        console.log("🔒 [MACHINE PAGE] Closing manual form");
        setShowManualForm(false);
        clearScanData();
    }, [clearScanData]);

    const handleUnmount = async () => {
        try {
            const res = await moldApi.unmountMold(machineId, user?.empNo || 'GUEST');
            if (res.status === 'success') {
                setShowConfirm(false);
                setShowSuccess(true);
                fetchCurrentStatus();
            }
        } catch (error) {
            setNotification({
                show: true,
                message: `Lỗi hạ khuôn: ${error.message}`,
                type: 'error'
            });
        }
    };

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center p-0 relative overflow-hidden font-sans no-select gpu-accelerated">

            {/* 3. MAIN DATA PANEL */}
            <div className={cn(
                "flex-1 w-full flex items-center justify-center px-4 mt-8 mb-4 min-h-0 transition-all",
                isHighResPad ? "max-w-[96%] mt-2" : "max-w-7xl"
            )}>
                <div
                    className={cn(
                        "w-full bg-[#0c0d12]/98 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 relative overflow-hidden border-2 border-white/[0.08] shadow-3xl flex flex-col h-fit",
                        isHighResPad && "p-8 max-h-[92vh]"
                    )}
                >
                    <div className="absolute inset-0 border border-blue-500/10 rounded-[2.5rem] md:rounded-[3rem] pointer-events-none" />

                    <div className="flex flex-col h-full relative z-20">
                        {/* 1. Permanent Header Row (Always visible) */}
                        <div className={cn(
                            "flex justify-between items-center mb-12 w-full",
                            isHighResPad && "mb-8 px-2"
                        )}>
                            {/* Back Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-4 bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/10 transition-all shadow-xl group active:opacity-70 active:scale-95 transform-gpu"
                            >
                                <ArrowLeft className="w-6 h-6 text-blue-500 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-zinc-400 text-xs font-black italic tracking-[0.2em] uppercase">{t('back') || 'BACK'}</span>
                            </button>

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
                                    {hasMold ? t('mold_in_use') : t('ready_to_mount')}
                                </span>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {hasMold ? (
                                <motion.div
                                    key="mold-info"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
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
                                            <DataGroup icon={Hash} label={t('tooling_code')} value={currentMold?.nike_tool_code} />
                                            <div className={cn(
                                                "grid grid-cols-2 gap-10",
                                                isHighResPad && "gap-6"
                                            )}>
                                                <DataGroup icon={Ruler} label={t('mold_size')} value={currentMold?.component_size} />
                                                <DataGroup icon={Tag} label={t('mold_name')} value={currentMold?.mold_name} />
                                            </div>
                                            <DataGroup icon={Package} label={t('article_color')} value={currentMold?.article || 'N/A'} />
                                            <DataGroup icon={Fingerprint} label={t('mold_id')} value={currentMold?.mold_id} isPrimary />
                                        </div>

                                        <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end">
                                            <BigAction
                                                icon={Trash2}
                                                label={t('unmount_mold')}
                                                desc={t('unmount_desc')}
                                                color="red"
                                                onClick={() => setShowConfirm(true)}
                                            />
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "mt-12 pt-8 border-t-2 border-white/[0.08] grid grid-cols-3 gap-12 overflow-visible",
                                        isHighResPad && "mt-8 pt-6 gap-8"
                                    )}>
                                        <MetadataBlock icon={User} label={t('mounter_label')} value={currentMold?.mounted_by} />
                                        <MetadataBlock icon={Clock} label={t('time_label')} value={new Date(currentMold?.mounted_at).toLocaleTimeString()} />
                                        <MetadataBlock icon={ShieldCheck} label={t('date_label')} value={new Date(currentMold?.mounted_at).toLocaleDateString()} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty-machine"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center py-10 text-center"
                                >
                                    <h3 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-10">{t('ready_to_mount')}</h3>
                                    <div className="flex flex-col gap-6 w-full max-w-2xl">
                                        {/* Option 1: Scan QR */}
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={startScan}
                                            className="w-full bg-blue-600 p-6 rounded-[2.5rem] border-4 border-blue-400/40 shadow-2xl shadow-blue-600/20 group transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                                                        <Scan className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-white text-xl font-black italic uppercase tracking-widest">{t('scan_qr')}</span>
                                                        <span className="text-blue-100/60 text-[10px] font-bold uppercase tracking-[0.2em]">Sử dụng Camera AI</span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                        </motion.button>

                                        {/* Option 2: Manual Selection */}
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowManualForm(true)}
                                            className="w-full bg-[#111218] hover:bg-[#16171d] p-6 rounded-[2.5rem] border border-white/5 transition-all text-left shadow-xl group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center border border-white/5 shadow-lg">
                                                        <MousePointerClick className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-zinc-300 text-xl font-black italic uppercase tracking-widest">{t('manual_selection')}</span>
                                                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Nhập liệu bằng tay</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* High-Alert Confirmation Dialog */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirm(false)}
                            className="absolute inset-0 bg-black/90"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#111218] border-2 border-red-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                        >
                            {/* Alert Header Decoration */}
                            <div className="h-2 w-full bg-red-500/20 flex gap-1 px-1">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="flex-1 h-full bg-red-500/40 skew-x-[-45deg]" />
                                ))}
                            </div>

                            <div className="p-8 md:p-10 border-b border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white leading-none">
                                        {t('unmount_confirm_title')}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-lg text-zinc-300 font-medium tracking-tight">
                                        {t('unmount_confirm_msg')}
                                    </p>
                                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl">
                                        <p className="text-sm text-red-400 font-bold uppercase tracking-wider leading-relaxed">
                                            {t('unmount_confirm_warning')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 p-8 bg-black/40">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-sm"
                                >
                                    {t('cancel')}
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleUnmount}
                                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                >
                                    {t('confirm_unmount')}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Notification
                show={showSuccess || notification.show}
                message={notification.message || t('unmount_success')}
                type={notification.type}
                onClose={() => {
                    setShowSuccess(false);
                    setNotification(prev => ({ ...prev, show: false }));
                }}
            />

            <ManualMountForm 
                isOpen={showManualForm}
                onClose={handleManualFormClose}
                machineId={machineId}
                qrData={scannedQrData}
                onMountSuccess={handleMountSuccess}
            />

            <div className="py-2 text-zinc-500 font-black tracking-[0.8em] text-[10px] uppercase italic opacity-60">
                F1 WORKSHOP • v2.0
            </div>
        </div>
    );
};

const DataGroup = memo(({ icon: Icon, label, value, isPrimary }) => {
    const { isHighResPad } = useResponsive();
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { duration: 0.2 }
                }
            }}
            className="flex flex-col overflow-visible group"
        >
            <div className="flex items-center gap-2 mb-1">
                <div className="relative flex items-center justify-center">
                    {Icon && <Icon className="w-3.5 h-3.5 text-blue-500/60 transition-colors z-10" />}
                    {/* HUD spinning ring - Static for Performance */}
                    <div className="absolute inset-[-4px] border border-blue-500/10 border-t-blue-500/40 rounded-full opacity-60" />
                </div>
                <span className={cn(
                    "text-xs font-black text-zinc-400 uppercase tracking-[0.3em] italic leading-none pr-4",
                    isHighResPad && "text-[11px]"
                )}>{label}</span>
            </div>
            <span
                className={cn(
                    "text-[clamp(1.8rem,4.5vw,4.2rem)] font-black italic tracking-tighter leading-tight transition-all pr-8 overflow-visible",
                    isHighResPad ? "text-[clamp(1.6rem,4vw,3.2rem)]" : "",
                    isPrimary ? "text-[#3b82f6] text-glow-blue" : "text-white"
                )}
            >
                {value}
            </span>
        </motion.div>
    );
});

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

const BigAction = memo(({ icon: Icon, label, desc, color, onClick }) => {
    const { isHighResPad } = useResponsive();
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full max-w-sm p-8 rounded-[3rem] border-[3px] transition-all group relative overflow-hidden flex items-center gap-6 text-left shadow-2xl",
                color === 'red' ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-red-500/10" : "",
                isHighResPad ? "p-6 scale-95" : "scale-110 lg:scale-120"
            )}
        >
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
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent opacity-30" />
        </button>
    );
});

export default MachineDetailPage;
