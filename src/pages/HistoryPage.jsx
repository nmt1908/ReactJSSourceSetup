import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Clock, Hash, Ruler, Tag, Filter, Fingerprint, CalendarDays, MonitorDot, X, ChevronLeft, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';
import DigitalClock from '@/components/common/DigitalClock';
import { moldApi } from '@/api/moldApi';

const HistoryPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isHighResPad } = useResponsive();
    
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'machine'
    const [selectedMachine, setSelectedMachine] = useState('ALL');
    const [showMachineModal, setShowMachineModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDateModal, setShowDateModal] = useState(false);

    // List of 24 machines
    const machinesList = useMemo(() => 
        Array.from({ length: 24 }, (_, i) => `F1_${(i + 1).toString().padStart(2, '0')}`)
    , []);

    const filteredHistory = useMemo(() => {
        const getLocalDateStr = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const targetDateStr = getLocalDateStr(selectedDate);

        return history.filter(item => {
            const matchesMachine = selectedMachine === 'ALL' || item.machine_id === selectedMachine;
            
            // Filter by date range (inclusive)
            const mountDateStr = getLocalDateStr(item.mounted_at);
            const unmountDateStr = item.unmounted_at ? getLocalDateStr(item.unmounted_at) : null;

            // Record matches if targetDate is between mount and unmount dates (inclusive)
            // or if it started on/before targetDate and is still running.
            const matchesDate = targetDateStr >= mountDateStr && (!unmountDateStr || targetDateStr <= unmountDateStr);
            
            return matchesMachine && matchesDate;
        });
    }, [history, selectedMachine, selectedDate]);

    const fetchHistory = useCallback(async (sort) => {
        setLoading(true);
        try {
            const res = await moldApi.getHistory(sort);
            if (res.status === 'success') {
                setHistory(res.data);
            }
        } catch (error) {
            console.error("Fetch history error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(sortBy);
    }, [fetchHistory, sortBy]);

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center p-0 relative overflow-hidden font-sans no-select">
            
            {/* Header */}
            <div className={cn(
                "w-full flex justify-between items-center z-50 px-10 pt-10 mb-8",
                isHighResPad && "pt-6 px-8 mb-4"
            )}>
                <button
                    onClick={() => navigate('/')}
                    className={cn(
                        "flex items-center justify-center gap-3 px-8 py-3.5 min-w-[140px] md:min-w-[180px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs tracking-[0.2em] uppercase transition-all shadow-lg shadow-blue-600/30 active:scale-95 z-50",
                        isHighResPad && "px-10 py-4 text-sm min-w-[200px]"
                    )}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t('back') || 'BACK'}</span>
                </button>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <DigitalClock />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-blue-600/10 px-6 py-3 rounded-2xl border border-blue-500/20">
                        <MonitorDot className="w-5 h-5 text-blue-500 animate-pulse" />
                        <h1 className="text-blue-500 font-black italic uppercase tracking-[0.3em] text-sm">
                            {t('history')}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-full px-10 mb-6 flex flex-col min-h-0">
                
                {/* Fixed Sort Bar */}
                <div className="flex gap-4 mb-8">
                    <div className="flex bg-[#111218] border-2 border-white/5 p-1.5 rounded-[1.8rem] gap-2">
                        <div className="px-6 flex items-center gap-2 border-r border-white/10 mr-2">
                            <Filter className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('sort_by') || 'SORT BY'}:</span>
                        </div>
                        
                        <button 
                            onClick={() => setShowMachineModal(true)}
                            className={cn(
                                "px-8 py-3 rounded-[1.4rem] flex items-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all",
                                selectedMachine !== 'ALL' ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-white active:bg-white/5"
                            )}
                        >
                            <Hash className="w-4 h-4" /> 
                            {selectedMachine === 'ALL' ? t('machine') : `${t('machine')} ${selectedMachine.split('_')[1]}`}
                        </button>
                        
                        <button 
                            onClick={() => setShowDateModal(true)}
                            className={cn(
                                "px-8 py-3 rounded-[1.4rem] flex items-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all bg-white/5 border border-white/5 text-zinc-400 hover:text-white"
                            )}
                        >
                            <CalendarDays className="w-4 h-4 text-blue-500" /> {selectedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </button>
                    </div>
                    
                    {loading && (
                        <div className="flex items-center gap-3 ml-4">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing...</span>
                        </div>
                    )}
                </div>

                {/* History Table Container */}
                <div className={cn(
                    "flex-1 bg-[#0c0d12]/95 rounded-[2.5rem] border-2 border-white/[0.05] overflow-hidden flex flex-col shadow-3xl",
                    isHighResPad && "rounded-[2rem]"
                )}>
                    {/* Header Columns */}
                    <div className="grid grid-cols-12 px-10 py-6 bg-white/[0.03] border-b border-white/[0.05] relative z-10">
                        <div className="col-span-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('machine')}</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-4">{t('mold_id')}</div>
                        <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('mold_specs')}</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('mount_log')}</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('unmount_log')}</div>
                        <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">{t('status')}</div>
                    </div>

                    {/* Scrollable Rows */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <HistoryRow key={item.id} item={item} index={index} />
                                ))
                            ) : !loading && (
                                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                                    <HistoryIcon className="w-16 h-16" />
                                    <span className="text-xs font-black uppercase tracking-[0.5em]">No history found</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="py-4 text-zinc-700 font-black tracking-[0.8em] text-[10px] uppercase italic opacity-40">
                F1 WORKSHOP • DATA LOG ENGINE • V1.0
            </div>

            {/* Machine Selection Modal */}
            <MachineSelectorModal
                isOpen={showMachineModal}
                onClose={() => setShowMachineModal(false)}
                machines={machinesList}
                selectedMachine={selectedMachine}
                onSelect={(id) => {
                    setSelectedMachine(id);
                    setShowMachineModal(false);
                }}
            />

            {/* Date Selection Modal */}
            <DatePickerModal
                isOpen={showDateModal}
                onClose={() => setShowDateModal(false)}
                selectedDate={selectedDate}
                onSelect={(date) => {
                    setSelectedDate(date);
                    setShowDateModal(false);
                }}
            />
        </div>
    );
};

const DatePickerModal = ({ isOpen, onClose, selectedDate, onSelect }) => {
    const { t } = useTranslation();
    const { isHighResPad } = useResponsive();
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    
    // Calendar math
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const monthNames = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={cn(
                            "bg-[#0c0d12] border-2 border-white/10 rounded-[3rem] w-full max-w-2xl p-10 shadow-3xl overflow-hidden flex flex-col",
                            isHighResPad && "max-w-xl p-8"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-6">
                            <button onClick={prevMonth} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-6 h-6 text-blue-500" />
                            </button>
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-widest min-w-[180px] text-center">
                                {monthNames[month]} {year}
                            </h2>
                            <button onClick={nextMonth} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <ChevronRight className="w-6 h-6 text-blue-500" />
                            </button>
                        </div>
                        <button onClick={onClose} className="p-3 text-zinc-500 hover:text-white transition-colors">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-3 mb-4">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                        {/* Empty slots for previous month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        
                        {/* Days of current month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const d = new Date(year, month, day);
                            const isSelected = d.toDateString() === selectedDate.toDateString();
                            const isToday = d.toDateString() === today.toDateString();

                            return (
                                <button
                                    key={day}
                                    onClick={() => onSelect(d)}
                                    className={cn(
                                        "h-16 rounded-2xl flex flex-col items-center justify-center text-lg font-black transition-all relative group active:scale-90",
                                        isSelected 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                                            : "bg-white/5 text-zinc-400 hover:bg-white/10",
                                        isToday && !isSelected && "border-2 border-blue-500/50"
                                    )}
                                >
                                    <span className={cn(
                                        isSelected ? "scale-110" : "scale-100",
                                        "transition-transform"
                                    )}>{day}</span>
                                    {isToday && (
                                        <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => onSelect(new Date())}
                        className="mt-10 py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 font-black italic uppercase tracking-widest text-xs hover:bg-blue-600/20 transition-all active:scale-95"
                    >
                        {t('go_to_today') || 'DANH VỀ HÔM NAY'}
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const MachineSelectorModal = ({ isOpen, onClose, machines, selectedMachine, onSelect }) => {
    const { t } = useTranslation();
    const { isHighResPad } = useResponsive();
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={cn(
                            "bg-[#0c0d12] border-2 border-white/10 rounded-[3rem] w-full max-w-4xl p-10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]",
                            isHighResPad && "p-8 max-w-3xl"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black italic text-white uppercase tracking-widest leading-tight">
                                    {t('select_machine') || 'CHỌN MÁY'}
                                </h2>
                                <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full" />
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors border border-white/5"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-6 contents-contain">
                            <button
                                onClick={() => onSelect('ALL')}
                                className={cn(
                                    "col-span-full py-6 rounded-2xl border-2 font-black italic uppercase tracking-[0.2em] transition-all mb-4",
                                    selectedMachine === 'ALL' 
                                        ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20" 
                                        : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 active:scale-95"
                                )}
                            >
                                {t('all_machines') || 'TẤT CẢ CÁC MÁY'}
                            </button>

                            {machines.map((id) => (
                                <button
                                    key={id}
                                    onClick={() => onSelect(id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-6 rounded-[2.2rem] border-2 transition-all group active:scale-90",
                                        selectedMachine === id
                                            ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20"
                                            : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase opacity-60 group-hover:opacity-100 italic tracking-widest mb-1">
                                        {id.split('_')[0]}
                                    </span>
                                    <span className={cn(
                                        "text-4xl font-black italic",
                                        selectedMachine === id ? "text-white" : "text-zinc-400 group-hover:text-blue-500"
                                    )}>
                                        {id.split('_')[1]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const HistoryRow = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 px-10 py-8 border-b border-white/[0.03] hover:bg-white/[0.03] transition-all items-center group relative overflow-hidden"
        >
            {/* 1. Machine */}
            <div className="col-span-1">
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-600 font-black tracking-widest italic leading-none mb-1">F1</span>
                    <span className="text-4xl font-black italic text-blue-500 leading-none group-hover:scale-110 transition-transform origin-left drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                        {item.machine_id.split('_')[1]}
                    </span>
                </div>
            </div>

            {/* 2. Mold ID (Fixed Column) */}
            <div className="col-span-2 pl-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-xl group-hover:bg-blue-600/20 transition-colors border border-blue-500/10">
                        <Fingerprint className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-black uppercase leading-none mb-1 tracking-wider">MOLD ID</span>
                        <span className="text-white font-black italic text-sm tracking-widest uppercase">{item.mold_id}</span>
                    </div>
                </div>
            </div>

            {/* 3. Mold Specs (Combined Column) */}
            <div className="col-span-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-[10px] font-black italic uppercase tracking-wider">MODEL:</span>
                    <span className="text-zinc-200 font-black italic tracking-wide text-lg leading-none">{item.nike_tool_code}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 text-[10px] font-black italic uppercase">SIZE:</span>
                        <span className="text-zinc-400 text-xs font-black">{item.component_size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 text-[10px] font-black italic uppercase">NAME:</span>
                        <span className="text-zinc-400 text-xs font-black">{item.mold_name}</span>
                    </div>
                </div>
            </div>

            {/* 4. Mount Log */}
            <div className="col-span-2 flex items-center gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                    <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-zinc-200 font-black italic text-xs tracking-widest">{item.mounted_by}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-400 font-bold tabular-nums italic">
                                {new Date(item.mounted_at).toLocaleDateString('sv-SE').replace(/-/g, '/')}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-bold tabular-nums italic">
                                {new Date(item.mounted_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Unmount Log */}
            <div className="col-span-2 flex items-center gap-4 ml-4">
                {item.unmounted_at ? (
                    <div className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/5 w-full">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/10 text-zinc-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-400 font-black italic text-xs tracking-widest">{item.unmounted_by || '----'}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3 h-3 text-zinc-600" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-bold tabular-nums italic">
                                        {new Date(item.unmounted_at).toLocaleDateString('sv-SE').replace(/-/g, '/')}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-bold tabular-nums italic">
                                        {new Date(item.unmounted_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 px-6 py-3 bg-blue-600/5 rounded-2xl border border-blue-500/10 opacity-30">
                        <span className="text-[10px] text-blue-400 font-black italic uppercase tracking-[0.2em] animate-pulse">Running...</span>
                    </div>
                )}
            </div>

            {/* 6. Status Badge */}
            <div className="col-span-2 text-right">
                <span className={cn(
                    "px-5 py-2.5 rounded-xl text-[10px] font-black italic tracking-[0.1em] uppercase",
                    !item.unmounted_at 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "bg-[#111218] text-zinc-600 border border-white/5 opacity-50"
                )}>
                    {!item.unmounted_at ? 'ACTIVATE' : 'FINISHED'}
                </span>
            </div>
        </motion.div>
    );
};

export default HistoryPage;
