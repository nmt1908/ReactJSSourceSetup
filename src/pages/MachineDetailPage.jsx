import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, PlusCircle, User, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const MachineDetailPage = () => {
    const { machineId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const machineNum = machineId?.split('_')[1] || '01';
    const isRunning = parseInt(machineNum) <= 15;

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
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/[0.1] rounded-full blur-[150px] pointer-events-none" />

            {/* 1. FIXED BACK BUTTON - SÁT MÉP TRÊN TRÁI */}
            <div className="absolute top-2 left-4 z-[100]">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 bg-[#111218] hover:bg-[#1a1b23] px-6 py-3 rounded-xl border-2 border-blue-500/40 transition-all active:scale-90 group shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5 text-blue-400 group-hover:-translate-x-1" />
                    <span className="text-white text-[10px] font-black italic tracking-widest uppercase italic">BACK</span>
                </button>
            </div>

            {/* 2. FIXED MACHINE TITLE - SÁT MÉP TRÊN GIỮA */}
            <div className="absolute top-2 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <div className="flex flex-col items-center pointer-events-auto">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", isRunning ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500 shadow-[0_0_8px_#f59e0b]")} />
                        <span className="text-zinc-600 text-[8px] font-black tracking-[0.4em] uppercase italic leading-none">STATUS</span>
                    </div>
                    <h2 className="text-white text-[clamp(1.8rem,5vw,2.8rem)] font-black italic tracking-tighter uppercase leading-none">
                        F1 <span className="text-blue-500">{machineNum}</span>
                    </h2>
                </div>
            </div>

            {/* 3. MAIN DATA PANEL - CĂN CHỈNH KHOẢNG CÁCH HỢP LÝ VỚI TOP */}
            <div className="flex-1 w-full flex items-center justify-center max-w-7xl px-4 mt-20 mb-4 min-h-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-[#0c0d12]/95 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 relative overflow-hidden border-2 border-white/[0.08] shadow-3xl flex flex-col h-fit"
                >
                    <div className="absolute inset-0 border border-blue-500/10 rounded-[2.5rem] md:rounded-[3rem] pointer-events-none" />

                    {isRunning ? (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-5 mb-8 border-l-[6px] border-blue-500 pl-7">
                                <h3 className="text-[clamp(1.2rem,3vw,2rem)] font-black italic text-white uppercase tracking-tight">Thông tin khuôn</h3>
                                <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 text-blue-400 text-[9px] font-black tracking-widest uppercase italic">ACTIVE</div>
                            </div>

                            <div className="grid grid-cols-12 gap-10 items-center">
                                <div className="col-span-12 lg:col-span-7 space-y-8">
                                    <DataGroup label="Tooling Code" value={moldData.toolingCode} />
                                    <div className="grid grid-cols-2 gap-10">
                                        <DataGroup label="Mold Size" value={moldData.moldSize} />
                                        <DataGroup label="Mold Name" value={moldData.moldName} />
                                    </div>
                                    <DataGroup label="Article / Colorway" value={moldData.article} />
                                    <DataGroup label="Mold ID" value={moldData.moldId} isPrimary />
                                </div>

                                <div className="col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end">
                                    <BigAction
                                        icon={Trash2}
                                        label="XUỐNG KHUÔN"
                                        desc="Ghi nhận kết thúc sản xuất"
                                        color="red"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t-2 border-white/[0.08] grid grid-cols-3 gap-6">
                                <MetadataBlock icon={User} label="Người lên khuôn" value={moldData.mounter} />
                                <MetadataBlock icon={Clock} label="Thời gian" value={moldData.mountedTime} />
                                <MetadataBlock icon={ShieldCheck} label="Ngày thực hiện" value={moldData.mountedDate} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter mb-10">MÁY TRỐNG</h3>
                            <button className="h-24 px-16 rounded-[3.5rem] bg-blue-600 text-white text-2xl font-black italic uppercase tracking-[0.2em] shadow-2xl flex items-center gap-6">
                                <PlusCircle className="w-10 h-10" />
                                LÊN KHUÔN NGAY
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="py-2 text-zinc-800 font-black tracking-[0.5em] text-[10px] uppercase italic opacity-20">
                F1 WORKSHOP • v2.0
            </div>
        </div>
    );
};

const DataGroup = ({ label, value, isPrimary }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1.5 italic leading-none">{label}</span>
        <span className={cn(
            "text-[clamp(1.8rem,4.5vw,4.2rem)] font-black italic tracking-tighter leading-none transition-all truncate",
            isPrimary ? "text-[#3b82f6] text-glow-blue" : "text-white"
        )}>
            {value}
        </span>
    </div>
);

const MetadataBlock = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-5">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
            <Icon className="w-6 md:w-8 h-6 md:h-8" />
        </div>
        <div className="min-w-0">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1 truncate italic leading-none">{label}</p>
            <p className="text-xl font-black italic text-zinc-100 truncate leading-none">{value}</p>
        </div>
    </div>
);

const BigAction = ({ icon: Icon, label, desc, color }) => {
    return (
        <button className={cn(
            "w-full max-w-sm p-8 rounded-[3rem] border-[3px] transition-all active:scale-95 group relative overflow-hidden flex items-center gap-6 text-left",
            color === 'red' ? "bg-red-500/10 border-red-500/40 text-red-500 hover:bg-red-500/20 shadow-2xl scale-110 lg:scale-120" : ""
        )}>
            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-red-500/20">
                <Icon className="w-8 h-8 text-red-500" />
            </div>
            <div className="min-w-0">
                <p className="text-xl md:text-2xl font-black italic uppercase tracking-tight leading-none">{label}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mt-2 leading-tight">{desc}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
};

export default MachineDetailPage;
