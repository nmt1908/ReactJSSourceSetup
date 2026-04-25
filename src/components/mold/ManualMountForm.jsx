import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    X, ArrowLeft, Hash, Ruler, Tag,
    CheckCircle2, Loader2, Database
} from 'lucide-react';
import { moldApi } from '@/api/moldApi';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';

/**
 * ManualMountForm - A 3-step hierarchical selection UI for mounting molds
 * Optimized for tablets (large touch targets, no hover)
 */
const ManualMountForm = ({ isOpen, onClose, machineId, onMountSuccess, qrData = null }) => {
    const { t } = useTranslation();
    const user = useAppStore(state => state.user);

    const [step, setStep] = useState(1); // 1: Model, 2: Size, 3: Name, 4: Confirm
    const [loading, setLoading] = useState(false);
    const [showMountConfirm, setShowMountConfirm] = useState(false);
    const [fetchError, setFetchError] = useState('');

    // Selection State
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [finalMoldId, setFinalMoldId] = useState('');

    // Data Lists
    const [models, setModels] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [names, setNames] = useState([]);
    const [isQrProcessed, setIsQrProcessed] = useState(false);

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedModel('');
            setSelectedSize('');
            setSelectedName('');
            setFinalMoldId('');
            setShowMountConfirm(false);
            setFetchError('');
            setIsQrProcessed(false);
        } else if (qrData && !isQrProcessed) {
            setIsQrProcessed(true); // Đánh dấu đã nhận và xử lý QR, không làm lại nữa
            
            // Xử lý thông minh: Tách theo xuống dòng trước, nếu chỉ ra 1 dòng thì tách theo khoảng trắng
            let lines = qrData.split('\n').map(l => l.trim()).filter(l => l);
            if (lines.length === 1 && qrData.includes(' ')) {
                lines = qrData.split(' ').map(l => l.trim()).filter(l => l);
            }
            
            if (lines.length >= 5) {
                const model = lines[4]; 
                const size = lines[1];  
                const name = lines[2];  
                
                setSelectedModel(model);
                setSelectedSize(size);
                setSelectedName(name);
                setStep(4);
                fetchMoldId(model, size, name);
            }
        } else if (!qrData && !isQrProcessed && isOpen) {
            // Chỉ fetch models lần đầu nếu KHÔNG có QR
            fetchModels();
        }
    }, [isOpen, qrData, isQrProcessed]);

    // Fetching Logic
    const fetchModels = async () => {
        setLoading(true);
        try {
            const res = await moldApi.getModels();
            if (res.status === 'success') {
                setModels(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch models", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSizes = async (model) => {
        setLoading(true);
        try {
            const res = await moldApi.getSizes(model);
            if (res.status === 'success') {
                setSizes(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch sizes", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNames = async (model, size) => {
        setLoading(true);
        try {
            const res = await moldApi.getNames(model, size);
            if (res.status === 'success') {
                setNames(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch names", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoldId = async (model, size, name) => {
        setLoading(true);
        setFetchError('');
        try {
            const res = await moldApi.findMoldId(model, size, name);
            if (res.status === 'success') {
                setFinalMoldId(res.mold_id);
            }
        } catch (error) {
            console.error("❌ [API DEBUG] Error:", error);
            setFetchError(error.response?.status === 404 
                ? 'Không tìm thấy Mold ID tương ứng!' 
                : 'Lỗi kết nối hệ thống!');
        } finally {
            setLoading(false);
            setStep(4);
        }
    };

    // Selection Handlers
    const handleSelectModel = (model) => {
        setSelectedModel(model);
        fetchSizes(model);
        setStep(2);
    };

    const handleSelectSize = (size) => {
        setSelectedSize(size);
        fetchNames(selectedModel, size);
        setStep(3);
    };

    const handleSelectName = (name) => {
        setSelectedName(name);
        fetchMoldId(selectedModel, selectedSize, name);
        setStep(4);
    };

    const handleConfirmMount = async () => {
        setShowMountConfirm(true);
    };

    const executeMount = async () => {
        setLoading(true);
        try {
            const res = await moldApi.mountMold(machineId, finalMoldId, user?.empNo || 'GUEST');
            if (res.status === 'success') {
                onMountSuccess(finalMoldId);
                setShowMountConfirm(false);
                onClose();
            }
        } catch (error) {
            console.error("Mounting failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            if (step === 2) setSelectedModel('');
            if (step === 3) setSelectedSize('');
            if (step === 4) setSelectedName('');
        }
    };

    // Items to display based on step
    const items = useMemo(() => {
        return step === 1 ? models : (step === 2 ? sizes : names);
    }, [step, models, sizes, names]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 lg:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-[96%] lg:max-w-6xl aspect-[16/10] max-h-[92vh] bg-[#050505]/95 border-2 border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(37,99,235,0.15)] transform-gpu"
            >
                {/* Header Section */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
                            >
                                <ArrowLeft className="w-6 h-6 text-blue-500" />
                            </button>
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Database className="w-7 h-7 text-blue-500" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                                {qrData ? t('qr_scan_result') : t('manual_selection')} | {machineId.replace('_', '-')}
                            </h2>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-blue-500 text-sm lg:text-base font-black uppercase tracking-[0.1em] italic">
                                    {qrData ? t('confirm_mount_title') : (
                                        <>
                                            {step === 1 && t('step_1')}
                                            {step === 2 && t('step_2')}
                                            {step === 3 && t('step_3')}
                                            {step === 4 && t('step_4')}
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        title={t('modal_close') || 'Close'}
                        className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 active:scale-90 transition-transform group"
                    >
                        <X className="w-6 h-6 text-red-500 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/5 flex gap-1 px-1">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 h-full rounded-full transition-all duration-500",
                                step >= i ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center gap-6"
                                >
                                    <div className="relative">
                                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                                        <div className="absolute inset-0 blur-xl bg-blue-500/20" />
                                    </div>
                                    <span className="text-zinc-500 font-black italic uppercase tracking-widest text-sm animate-pulse">
                                        {t('loading') || 'Loading...'}
                                    </span>
                                </motion.div>
                            ) : step === 4 ? (
                                <ConfirmationStep
                                    model={selectedModel}
                                    size={selectedSize}
                                    name={selectedName}
                                    moldId={finalMoldId}
                                    fetchError={fetchError}
                                    onConfirm={handleConfirmMount}
                                />
                            ) : (
                                <motion.div
                                    key={`step-${step}`}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className={cn(
                                        "grid gap-8",
                                        step === 1 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                    )}
                                >
                                    {items.length > 0 ? (
                                        items.map((item, idx) => (
                                            <SelectionCard
                                                key={`${item}-${idx}`}
                                                value={item}
                                                icon={step === 1 ? Hash : (step === 2 ? Ruler : Tag)}
                                                onClick={() => {
                                                    if (step === 1) handleSelectModel(item);
                                                    else if (step === 2) handleSelectSize(item);
                                                    else handleSelectName(item);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <p className="text-zinc-600 font-bold text-xl italic uppercase tracking-widest">
                                                {t('no_results')}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Selection Summary - Hidden on Step 4 */}
                {(step < 4 && (selectedModel || selectedSize || selectedName)) && (
                    <div className="p-8 border-t border-white/10 bg-black/80 flex items-center justify-between overflow-x-auto no-scrollbar gap-8">
                        <div className="flex items-center gap-10">
                            {selectedModel && (
                                <SummaryItem label={t('tooling_code')} value={selectedModel} icon={Hash} />
                            )}
                            {selectedSize && (
                                <>
                                    <div className="h-10 w-px bg-white/10" />
                                    <SummaryItem label={t('mold_size')} value={selectedSize} icon={Ruler} />
                                </>
                            )}
                            {selectedName && (
                                <>
                                    <div className="h-10 w-px bg-white/10" />
                                    <SummaryItem label={t('mold_name')} value={selectedName} icon={Tag} />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Mount Confirmation Dialog */}
            <AnimatePresence>
                {showMountConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMountConfirm(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-[#0c0d12] border-2 border-blue-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                        >
                            {/* Blue Header Decoration */}
                            <div className="h-2 w-full bg-blue-600/20 flex gap-1 px-1">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div key={i} className="flex-1 h-full bg-blue-600/40 skew-x-[-45deg]" />
                                ))}
                            </div>

                            <div className="p-8 md:p-10 border-b border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                                        <Hash className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white leading-none">
                                        {t('mount_confirm_title')}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-lg text-zinc-300 font-medium tracking-tight">
                                        {t('mount_confirm_msg')}
                                    </p>

                                    {/* MOLD INFO BOX INSIDE DIALOG */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                                            <div>
                                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t('tooling_code')}</p>
                                                <p className="text-lg font-black text-white italic">{selectedModel}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t('mold_size')}</p>
                                                <p className="text-lg font-black text-white italic">{selectedSize}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-blue-600/5 p-4 rounded-2xl border border-blue-500/10">
                                            <div>
                                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{t('mold_name')}</p>
                                                <p className="text-xl font-black text-white italic">{selectedName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{t('mold_id')}</p>
                                                <p className="text-xl font-black text-blue-500 italic tracking-tighter">{finalMoldId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600/10 border-l-4 border-blue-500 p-4 rounded-r-xl">
                                        <p className="text-sm text-blue-400 font-bold uppercase tracking-wider leading-relaxed">
                                            {t('mount_confirm_warning')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 p-8 bg-black/40">
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => { e.preventDefault(); setShowMountConfirm(false); }}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-sm"
                                >
                                    {t('cancel')}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => { e.preventDefault(); executeMount(); }}
                                    className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                >
                                    {t('ok')}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components for better performance and readability
const SelectionCard = ({ value, icon: Icon, onClick }) => (
    <button
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="group relative h-28 bg-[#1a1b23] border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 transition-all active:scale-95 active:bg-blue-600 active:border-blue-400 transform-gpu"
    >
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-active:bg-white/20 group-active:border-white/40 shrink-0">
            <Icon className="w-6 h-6 text-blue-500 group-active:text-white" />
        </div>
        {/* Slightly reduced font size for better fit in 3 columns */}
        <span className="text-[clamp(1rem,2.2vw,1.8rem)] font-black italic text-white leading-none tracking-tighter pr-4 whitespace-nowrap">
            {value}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent opacity-0 group-active:opacity-100 transition-opacity rounded-[2rem]" />
    </button>
);

const SummaryItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-4 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Icon className="w-5 h-5 text-blue-500" />
        </div>
        <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic leading-none mb-1">{label}</p>
            <p className="text-xl font-black text-white italic leading-none tracking-tight">{value}</p>
        </div>
    </div>
);

const ConfirmationStep = ({ model, size, name, moldId, fetchError, onConfirm }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-2 lg:p-4"
        >
            <div className="w-full max-w-[50rem] bg-white/[0.03] border-2 border-blue-500/30 rounded-[2.5rem] p-6 lg:p-8 relative overflow-hidden shadow-3xl">
                <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none">
                    <CheckCircle2 className="w-80 h-80 text-blue-500" />
                </div>

                <h3 className="text-lg lg:text-xl font-black italic text-zinc-500 uppercase tracking-[0.4em] mb-6 text-center">
                    {t('confirm_mount_title')}
                </h3>

                <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-3 gap-4 pb-5 border-b border-white/10">
                        <InfoBox label={t('tooling_code')} value={model} />
                        <InfoBox label={t('mold_size')} value={size} />
                        <InfoBox label={t('mold_name')} value={name} />
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="w-full bg-blue-600/10 border-2 border-blue-500/30 p-4 lg:p-5 rounded-2xl text-center relative">
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.5em] mb-1">{t('detected_id')}</p>
                            {fetchError ? (
                                <p className="text-xl font-black italic text-red-500 animate-pulse">{fetchError}</p>
                            ) : (
                                <p className="text-3xl lg:text-4xl font-black italic text-blue-500 tracking-tighter text-glow-blue">{moldId || '----'}</p>
                            )}
                        </div>

                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => { e.preventDefault(); onConfirm(); }}
                            disabled={!!fetchError || !moldId}
                            className={cn(
                                "w-full py-5 lg:py-6 rounded-[2rem] text-xl lg:text-2xl font-black italic uppercase tracking-[0.3em] transition-all transform-gpu",
                                (fetchError || !moldId) 
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border-none" 
                                    : "bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)] border-t-2 border-white/30 active:bg-blue-500"
                            )}
                        >
                            {t('mount_confirm_btn')}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const InfoBox = ({ label, value }) => (
    <div className="text-center">
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic mb-1">{label}</p>
        <p className="text-xl lg:text-2xl font-black text-white italic tracking-tight">{value}</p>
    </div>
);

export default ManualMountForm;
